# backend/scripts/import_gutenberg.py
"""
Project Gutenberg Bulk Import Script
Downloads and imports hundreds of legal books from Project Gutenberg
"""

import os
import sys
import requests
import time
import json
import uuid
from pathlib import Path

# Add the app directory to Python path
sys.path.append('/app')

import boto3
from botocore.client import Config as BotoConfig
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database URL from environment
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/postgres')

# S3 configuration
S3_ENDPOINT_URL = os.getenv('S3_ENDPOINT_URL', 'http://minio:9000')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY', 'minioadmin')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY', 'minioadmin')
S3_BUCKET = os.getenv('S3_BUCKET', 'digital-library')

class GutenbergImporter:
    def __init__(self):
        self.engine = create_engine(DATABASE_URL)
        self.Session = sessionmaker(bind=self.engine)
        
        # Initialize S3 client
        self.s3_client = boto3.client(
            's3',
            endpoint_url=S3_ENDPOINT_URL,
            aws_access_key_id=S3_ACCESS_KEY,
            aws_secret_access_key=S3_SECRET_KEY,
            config=BotoConfig(signature_version='s3v4')
        )
        
        self.base_url = "https://gutendex.com/books"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Readora-Library-Builder/1.0 (Educational Purpose)'
        })
    
    def get_popular_books(self, limit=200):
        """Get popular books from Project Gutenberg API"""
        print(f"🔍 Fetching {limit} popular books from Project Gutenberg...")
        
        books = []
        page = 1
        
        while len(books) < limit:
            try:
                # Get books sorted by popularity (download count)
                url = f"{self.base_url}?languages=en&topic=!juvenile&page={page}"
                print(f"   📄 Fetching page {page}...")
                
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                data = response.json()
                
                if not data.get('results'):
                    print("   ⚠️ No more results available")
                    break
                
                # Filter books that have PDF downloads
                for book in data['results']:
                    if len(books) >= limit:
                        break
                    
                    # Check if book has PDF format
                    pdf_url = None
                    for format_url, mime_type in book.get('formats', {}).items():
                        if 'application/pdf' in mime_type or format_url.endswith('.pdf'):
                            pdf_url = format_url
                            break
                    
                    if pdf_url:
                        books.append({
                            'id': book['id'],
                            'title': book['title'],
                            'authors': book.get('authors', []),
                            'subjects': book.get('subjects', []),
                            'download_count': book.get('download_count', 0),
                            'pdf_url': pdf_url,
                            'gutenberg_url': f"https://www.gutenberg.org/ebooks/{book['id']}"
                        })
                
                page += 1
                time.sleep(1)  # Be respectful to the API
                
            except Exception as e:
                print(f"   ❌ Error fetching page {page}: {e}")
                break
        
        print(f"✅ Found {len(books)} books with PDF downloads")
        return books[:limit]
    
    def download_pdf(self, book_data):
        """Download PDF file from Project Gutenberg"""
        try:
            print(f"   📥 Downloading: {book_data['title'][:50]}...")
            
            response = self.session.get(book_data['pdf_url'], timeout=60, stream=True)
            response.raise_for_status()
            
            # Read the content
            pdf_content = response.content
            file_size = len(pdf_content)
            
            if file_size < 1000:  # Less than 1KB, probably not a real PDF
                print(f"   ⚠️ File too small ({file_size} bytes), skipping")
                return None
            
            print(f"   ✅ Downloaded {file_size / 1024 / 1024:.2f} MB")
            return pdf_content
            
        except Exception as e:
            print(f"   ❌ Download failed: {e}")
            return None
    
    def upload_to_s3(self, pdf_content, book_data):
        """Upload PDF to S3/MinIO"""
        try:
            # Generate S3 key
            safe_title = "".join(c for c in book_data['title'] if c.isalnum() or c in (' ', '-', '_')).strip()
            safe_title = safe_title.replace(' ', '_')[:50]  # Limit length
            
            s3_key = f"gutenberg/{book_data['id']}_{safe_title}.pdf"
            
            print(f"   ☁️ Uploading to S3: {s3_key}")
            
            self.s3_client.put_object(
                Bucket=S3_BUCKET,
                Key=s3_key,
                Body=pdf_content,
                ContentType='application/pdf'
            )
            
            print(f"   ✅ Uploaded successfully")
            return s3_key
            
        except Exception as e:
            print(f"   ❌ S3 upload failed: {e}")
            return None
    
    def save_to_database(self, book_data, s3_key, file_size):
        """Save book metadata to database"""
        try:
            session = self.Session()
            
            # Extract author names
            authors = [author.get('name', 'Unknown') for author in book_data.get('authors', [])]
            author_str = ', '.join(authors) if authors else 'Unknown Author'
            
            # Extract subjects for tags and genre
            subjects = book_data.get('subjects', [])
            genre = subjects[0] if subjects else 'Literature'
            
            # Create book record
            insert_query = text("""
                INSERT INTO books (
                    title, author, description, filename, s3_key,
                    copyright_status, license, source, source_url, 
                    language, genre, tags, file_size,
                    is_public, is_featured, download_count, view_count,
                    created_at, updated_at, verification_date
                ) VALUES (
                    :title, :author, :description, :filename, :s3_key,
                    :copyright_status, :license, :source, :source_url,
                    :language, :genre, :tags, :file_size,
                    :is_public, :is_featured, :download_count, :view_count,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
            """)
            
            session.execute(insert_query, {
                'title': book_data['title'][:255],  # Limit length
                'author': author_str[:255],
                'description': f"Classic literature from Project Gutenberg. Subjects: {', '.join(subjects[:3])}",
                'filename': f"{book_data['title'][:50]}.pdf",
                's3_key': s3_key,
                'copyright_status': 'public_domain',
                'license': 'Public Domain',
                'source': 'Project Gutenberg',
                'source_url': book_data['gutenberg_url'],
                'language': 'en',
                'genre': genre[:100],
                'tags': json.dumps(subjects[:5]),  # First 5 subjects as tags
                'file_size': file_size,
                'is_public': True,
                'is_featured': book_data['download_count'] > 1000,  # Feature popular books
                'download_count': 0,
                'view_count': 0
            })
            
            session.commit()
            session.close()
            
            print(f"   ✅ Saved to database")
            return True
            
        except Exception as e:
            print(f"   ❌ Database save failed: {e}")
            if 'session' in locals():
                session.rollback()
                session.close()
            return False
    
    def book_exists(self, gutenberg_id):
        """Check if book already exists in database"""
        try:
            session = self.Session()
            result = session.execute(
                text("SELECT COUNT(*) FROM books WHERE source_url LIKE :url"),
                {'url': f'%gutenberg.org/ebooks/{gutenberg_id}%'}
            ).scalar()
            session.close()
            return result > 0
        except:
            return False
    
    def import_books(self, limit=100, start_from=0):
        """Main import process"""
        print(f"🚀 Starting Project Gutenberg import...")
        print(f"📊 Target: {limit} books (starting from #{start_from})")
        
        # Get book list
        books = self.get_popular_books(limit + start_from)
        
        if start_from > 0:
            books = books[start_from:]
        else:
            books = books[:limit]
        
        success_count = 0
        skip_count = 0
        error_count = 0
        
        for i, book_data in enumerate(books, 1):
            print(f"\n📖 [{i}/{len(books)}] Processing: {book_data['title'][:60]}...")
            
            # Check if already exists
            if self.book_exists(book_data['id']):
                print(f"   ⏭️ Already exists, skipping")
                skip_count += 1
                continue
            
            # Download PDF
            pdf_content = self.download_pdf(book_data)
            if not pdf_content:
                error_count += 1
                continue
            
            # Upload to S3
            s3_key = self.upload_to_s3(pdf_content, book_data)
            if not s3_key:
                error_count += 1
                continue
            
            # Save to database
            if self.save_to_database(book_data, s3_key, len(pdf_content)):
                success_count += 1
                print(f"   🎉 SUCCESS! Total imported: {success_count}")
            else:
                error_count += 1
            
            # Respectful delay
            time.sleep(2)
        
        print(f"\n🏁 Import completed!")
        print(f"✅ Successfully imported: {success_count} books")
        print(f"⏭️ Skipped (already exist): {skip_count} books")
        print(f"❌ Errors: {error_count} books")
        print(f"📚 Your library now has {success_count + skip_count} Gutenberg classics!")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Import books from Project Gutenberg')
    parser.add_argument('--limit', type=int, default=50, help='Number of books to import (default: 50)')
    parser.add_argument('--start-from', type=int, default=0, help='Start importing from book number (default: 0)')
    
    args = parser.parse_args()
    
    try:
        importer = GutenbergImporter()
        importer.import_books(limit=args.limit, start_from=args.start_from)
    except KeyboardInterrupt:
        print("\n⚠️ Import interrupted by user")
    except Exception as e:
        print(f"\n💥 Fatal error: {e}")

if __name__ == "__main__":
    main()