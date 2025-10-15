#!/usr/bin/env python3
"""
Readora Smart Uploader - Production Version
===========================================
Imports from books_database.py
Real book descriptions (no Gutenberg/Readora branding)
Ready for deployment!

Usage:
    python smart_uploader_final.py
"""

import os
import sys
import time
import requests
import urllib.parse
from pathlib import Path
from tqdm import tqdm
from typing import Optional, Dict, List

# Import our books database
try:
    from books_database import ALL_BOOKS, get_stats
    print("✅ Books database loaded")
except ImportError:
    print("❌ Error: books_database.py not found!")
    print("   Make sure books_database.py is in the same folder")
    sys.exit(1)

# Import conversion libraries
try:
    from ebooklib import epub
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from bs4 import BeautifulSoup
    CONVERSION_AVAILABLE = True
except ImportError as e:
    CONVERSION_AVAILABLE = False
    print(f"❌ Missing library: pip install ebooklib Pillow reportlab beautifulsoup4")

# Configuration
API_BASE_URL = "http://localhost:8000"
DOWNLOAD_DIR = "./books_download_cache"
BATCH_SIZE = 5
DELAY_BETWEEN_UPLOADS = 2

Path(DOWNLOAD_DIR).mkdir(parents=True, exist_ok=True)

# ============================================================================
# CHECK EXISTING BOOKS
# ============================================================================

def get_existing_books() -> List[Dict]:
    """Get all books from database"""
    try:
        print("   Checking existing books...")
        response = requests.get(f"{API_BASE_URL}/books", timeout=10)
        if response.status_code == 200:
            books = response.json()
            print(f"   ✅ Found {len(books)} books")
            return books
        return []
    except:
        return []

def is_duplicate(book_info: Dict, existing_books: List[Dict]) -> bool:
    """Check if book exists"""
    title_lower = book_info['title'].lower().strip()
    author_lower = book_info['author'].lower().strip()
    
    for existing in existing_books:
        existing_title = (existing.get('title') or '').lower().strip()
        existing_author = (existing.get('author') or '').lower().strip()
        
        if existing_title == title_lower and existing_author == author_lower:
            return True
    
    return False

def filter_new_books(books: List[Dict]) -> tuple[List[Dict], List[Dict]]:
    """Filter out duplicates"""
    print("\n" + "="*70)
    print("CHECKING FOR DUPLICATES")
    print("="*70)
    
    existing_books = get_existing_books()
    
    new_books = []
    duplicates = []
    
    for book in books:
        if is_duplicate(book, existing_books):
            duplicates.append(book)
        else:
            new_books.append(book)
    
    return new_books, duplicates

# ============================================================================
# COVER FETCHING
# ============================================================================

def fetch_cover_url(title: str, author: str) -> Optional[str]:
    """Fetch cover from Open Library"""
    try:
        search_query = f"{title} {author}".strip()
        search_url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(search_query)}&limit=1"
        
        response = requests.get(search_url, timeout=8)
        if response.status_code == 200:
            data = response.json()
            if data.get('docs') and len(data['docs']) > 0:
                book = data['docs'][0]
                cover_id = book.get('cover_i')
                if cover_id:
                    return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
    except:
        pass
    return None

# ============================================================================
# EPUB CONVERSION
# ============================================================================

def convert_epub_to_pdf(epub_path: str) -> Optional[str]:
    """Convert EPUB to PDF - FULL CONTENT"""
    if not CONVERSION_AVAILABLE:
        return epub_path
    
    try:
        print("      🔄 Converting...", end='', flush=True)
        
        book = epub.read_epub(epub_path)
        pdf_path = epub_path.replace('.epub', '.pdf')
        
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        # Title page
        title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, spaceAfter=30)
        title = book.get_metadata('DC', 'title')
        author = book.get_metadata('DC', 'creator')
        
        if title:
            story.append(Paragraph(title[0][0], title_style))
            story.append(Spacer(1, 0.2*inch))
        if author:
            story.append(Paragraph(f"by {author[0][0]}", styles['Normal']))
            story.append(Spacer(1, 0.3*inch))
        
        story.append(PageBreak())
        
        # Process ALL content - no limits!
        for item in book.get_items():
            if item.get_type() == 9:  # XHTML
                try:
                    content = item.get_content().decode('utf-8')
                    soup = BeautifulSoup(content, 'html.parser')
                    
                    for script in soup(["script", "style"]):
                        script.decompose()
                    
                    text = soup.get_text()
                    lines = (line.strip() for line in text.splitlines())
                    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                    text = ' '.join(chunk for chunk in chunks if chunk)
                    
                    if text:
                        paragraphs = text.split('\n\n')
                        for para in paragraphs:
                            if para.strip() and len(para.strip()) > 10:
                                try:
                                    story.append(Paragraph(para.strip(), styles['Normal']))
                                    story.append(Spacer(1, 0.1*inch))
                                except:
                                    continue
                        story.append(Spacer(1, 0.2*inch))
                except:
                    continue
        
        doc.build(story)
        print(" Done!")
        
        try:
            os.remove(epub_path)
        except:
            pass
        
        return pdf_path
        
    except Exception as e:
        print(f"\n      ❌ Failed: {str(e)[:50]}")
        return None

# ============================================================================
# DOWNLOAD
# ============================================================================

def download_and_convert_book(book_id: str, title: str) -> Optional[str]:
    """Download EPUB and convert"""
    epub_urls = [
        f"https://www.gutenberg.org/ebooks/{book_id}.epub3.images",
        f"https://www.gutenberg.org/ebooks/{book_id}.epub.images",
        f"https://www.gutenberg.org/ebooks/{book_id}.epub.noimages",
    ]
    
    safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_title = safe_title.replace(' ', '_')[:50]
    
    for url in epub_urls:
        try:
            response = requests.get(url, timeout=30, stream=True, allow_redirects=True)
            
            if response.status_code == 200:
                epub_path = os.path.join(DOWNLOAD_DIR, f"{book_id}_{safe_title}.epub")
                total_size = int(response.headers.get('content-length', 0))
                
                with open(epub_path, 'wb') as f, tqdm(
                    desc="      Downloading", 
                    total=total_size, 
                    unit='B', 
                    unit_scale=True, 
                    leave=False,
                    bar_format='{desc}: {percentage:3.0f}%|{bar:30}|'
                ) as pbar:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                        pbar.update(len(chunk))
                
                return convert_epub_to_pdf(epub_path)
                
        except:
            continue
    
    return None

# ============================================================================
# UPLOAD (CLEAN DESCRIPTIONS - NO BRANDING!)
# ============================================================================

def upload_to_api(filepath: str, book_info: Dict, cover_url: Optional[str]) -> bool:
    """Upload book with clean description"""
    try:
        # Get description from book_info, or create a clean generic one
        description = book_info.get('description', '')
        
        # If no description in database, create a simple one about the book
        if not description:
            genre = book_info.get('genre', 'classic')
            year = book_info.get('year', '')
            description = f"A {genre.lower()} masterpiece first published in {year}."
        
        data = {
            'title': book_info['title'],
            'author': book_info['author'],
            'description': description,  # ← CLEAN DESCRIPTION ONLY ABOUT THE BOOK
            'genre': book_info['genre'],
            'copyright_status': 'Public Domain',
            'license': 'Public Domain',
            'source': 'Public Domain',  # ← NEUTRAL
            'source_url': '',  # ← NO EXTERNAL LINKS
            'language': 'en',
            'publication_year': str(book_info['year']),
            'is_public': 'true',
            'is_featured': 'true' if book_info.get('featured', False) else 'false',
            'cover_url': cover_url if cover_url else '',
        }
        
        with open(filepath, 'rb') as f:
            files = {'file': (os.path.basename(filepath), f, 'application/pdf')}
            
            print("      ☁️  Uploading...", end='', flush=True)
            response = requests.post(
                f"{API_BASE_URL}/books",
                files=files,
                data=data,
                timeout=120
            )
            
            if response.status_code in [200, 201]:
                print(" Done!")
                return True
            else:
                print(f" Failed ({response.status_code})")
                return False
                
    except Exception as e:
        print(f"\n      ❌ Error: {str(e)[:50]}")
        return False

# ============================================================================
# MAIN
# ============================================================================

def bulk_upload(books: List[Dict]):
    """Upload books"""
    
    if not CONVERSION_AVAILABLE:
        print("\n❌ Missing libraries!")
        return
    
    # Check API
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ API not responding")
            return
    except:
        print("❌ Cannot connect to API")
        return
    
    # Filter duplicates
    new_books, duplicates = filter_new_books(books)
    
    print("\n" + "="*70)
    print("RESULTS")
    print("="*70)
    
    if duplicates:
        print(f"\n⚠️  SKIPPING {len(duplicates)} duplicates")
    
    if not new_books:
        print("\n✅ All books uploaded!")
        return
    
    print(f"\n📚 Will upload {len(new_books)} NEW books:")
    for i, book in enumerate(new_books[:10], 1):
        print(f"   {i}. {book['title']}")
    if len(new_books) > 10:
        print(f"   ... and {len(new_books) - 10} more")
    
    print("\n" + "="*70)
    confirm = input(f"\nUpload {len(new_books)} books? (yes/no): ").lower().strip()
    
    if confirm not in ['yes', 'y']:
        print("❌ Cancelled")
        return
    
    print("\n" + "="*70)
    print("STARTING UPLOAD")
    print("="*70 + "\n")
    
    successful = 0
    failed = 0
    covers_found = 0
    
    for idx, book in enumerate(new_books, 1):
        print(f"\n[{idx}/{len(new_books)}] {book['title']}")
        
        try:
            # Cover
            print("   🎨 Cover...", end='', flush=True)
            cover_url = fetch_cover_url(book['title'], book['author'])
            if cover_url:
                covers_found += 1
                print(" Found!")
            else:
                print(" Not found")
            
            # Download
            print("   📥 Downloading...")
            filepath = download_and_convert_book(book['id'], book['title'])
            
            if not filepath:
                print("      ❌ Failed")
                failed += 1
                continue
            
            # Upload
            if upload_to_api(filepath, book, cover_url):
                print(f"      ✅ Success! {'📷' if cover_url else ''}")
                successful += 1
            else:
                failed += 1
            
            # Cleanup
            try:
                os.remove(filepath)
            except:
                pass
            
            # Pause
            if idx % BATCH_SIZE == 0 and idx < len(new_books):
                print(f"\n   ⏸️  Pausing...")
                time.sleep(DELAY_BETWEEN_UPLOADS * 2)
            else:
                time.sleep(DELAY_BETWEEN_UPLOADS)
                
        except KeyboardInterrupt:
            print("\n\n⚠️  Interrupted!")
            break
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:50]}")
            failed += 1
    
    # Summary
    print("\n" + "="*70)
    print("COMPLETE")
    print("="*70)
    print(f"✅ Successful: {successful}/{len(new_books)}")
    print(f"📷 Covers: {covers_found}/{len(new_books)}")
    print(f"❌ Failed: {failed}/{len(new_books)}")
    print("="*70 + "\n")

def main():
    # Show stats
    stats = get_stats()
    
    print(f"""
    ╔════════════════════════════════════════════════════════╗
    ║   READORA SMART UPLOADER - PRODUCTION VERSION 🚀       ║
    ╚════════════════════════════════════════════════════════╝
    
    📚 Total Books Available: {stats['total_books']}
    ⭐ Featured Books: {stats['featured_books']}
    ✅ All books are 100% LEGAL (Public Domain)
    """)
    
    print("Options:")
    print("1. Upload ALL books (auto-skip duplicates)")
    print("2. Upload first 10 books (test)")
    print("3. Upload first 25 books")
    print("4. Show stats")
    print("5. Exit")
    
    choice = input("\nSelect (1-5): ").strip()
    
    if choice == "1":
        bulk_upload(ALL_BOOKS)
    elif choice == "2":
        bulk_upload(ALL_BOOKS[:10])
    elif choice == "3":
        bulk_upload(ALL_BOOKS[:25])
    elif choice == "4":
        print(f"\n📊 Collection Stats:")
        for genre, count in stats['by_genre'].items():
            print(f"   • {genre}: {count}")
    elif choice == "5":
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted")
        sys.exit(1)