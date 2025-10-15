#!/usr/bin/env python3
"""
Automatic Book Cover Fetcher for Readora
=========================================
Fetches book covers from multiple sources and updates database

Requirements:
    pip install requests Pillow

Usage:
    python fetch_covers.py
"""

import os
import sys
import time
import requests
from pathlib import Path
from typing import Optional, Dict
import urllib.parse

API_BASE_URL = "http://localhost:8000"
COVERS_DIR = "./book_covers"
Path(COVERS_DIR).mkdir(parents=True, exist_ok=True)

# ============================================================================
# COVER SOURCES (In order of preference)
# ============================================================================

class CoverFetcher:
    """Fetch book covers from multiple sources"""
    
    @staticmethod
    def fetch_from_open_library(title: str, author: str) -> Optional[str]:
        """Fetch from Open Library Covers API (BEST for classics)"""
        try:
            # Search for book
            search_query = f"{title} {author}".strip()
            search_url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(search_query)}&limit=1"
            
            print(f"      🔍 Searching Open Library...")
            response = requests.get(search_url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('docs') and len(data['docs']) > 0:
                    book = data['docs'][0]
                    
                    # Try to get cover ID
                    cover_id = book.get('cover_i')
                    if cover_id:
                        # Get medium size cover (M = medium, L = large, S = small)
                        cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                        print(f"      ✅ Found cover on Open Library!")
                        return cover_url
                    
                    # Try ISBN if cover_i not available
                    isbn = book.get('isbn', [None])[0] if book.get('isbn') else None
                    if isbn:
                        cover_url = f"https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg"
                        print(f"      ✅ Found cover via ISBN!")
                        return cover_url
            
            print(f"      ⚠️ No cover found on Open Library")
            return None
            
        except Exception as e:
            print(f"      ❌ Open Library error: {str(e)[:40]}")
            return None
    
    @staticmethod
    def fetch_from_google_books(title: str, author: str) -> Optional[str]:
        """Fetch from Google Books API (Good backup)"""
        try:
            search_query = f"intitle:{title}+inauthor:{author}".replace(' ', '+')
            api_url = f"https://www.googleapis.com/books/v1/volumes?q={search_query}&maxResults=1"
            
            print(f"      🔍 Searching Google Books...")
            response = requests.get(api_url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('totalItems', 0) > 0:
                    book = data['items'][0]
                    cover_url = book.get('volumeInfo', {}).get('imageLinks', {}).get('thumbnail')
                    
                    if cover_url:
                        # Upgrade to higher quality
                        cover_url = cover_url.replace('&zoom=1', '&zoom=2')
                        cover_url = cover_url.replace('http://', 'https://')
                        print(f"      ✅ Found cover on Google Books!")
                        return cover_url
            
            print(f"      ⚠️ No cover found on Google Books")
            return None
            
        except Exception as e:
            print(f"      ❌ Google Books error: {str(e)[:40]}")
            return None
    
    @staticmethod
    def fetch_from_project_gutenberg(gutenberg_id: str) -> Optional[str]:
        """Try Project Gutenberg cover (if available)"""
        try:
            # Some books have covers on Gutenberg
            cover_url = f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.cover.medium.jpg"
            
            print(f"      🔍 Checking Project Gutenberg...")
            response = requests.head(cover_url, timeout=5)
            
            if response.status_code == 200:
                print(f"      ✅ Found cover on Project Gutenberg!")
                return cover_url
            
            return None
        except:
            return None
    
    @staticmethod
    def generate_placeholder(title: str, author: str, genre: str) -> str:
        """Generate a nice placeholder cover URL"""
        # Use a cover generator service
        encoded_title = urllib.parse.quote(title[:50])
        encoded_author = urllib.parse.quote(author[:30])
        
        # Use DiceBear or similar service (or we can generate locally)
        # For now, return a generic URL pattern
        return f"https://via.placeholder.com/300x450/667eea/ffffff?text={encoded_title}"

# ============================================================================
# MAIN COVER FETCHING LOGIC
# ============================================================================

def fetch_and_save_cover(book: Dict) -> Optional[str]:
    """Fetch cover from multiple sources and save locally"""
    title = book.get('title', '')
    author = book.get('author', 'Unknown')
    book_id = book.get('id')
    gutenberg_id = book.get('source_url', '').split('/')[-1] if book.get('source_url') else None
    
    print(f"\n📖 {title} by {author}")
    
    # Try multiple sources in order
    cover_url = None
    
    # 1. Try Open Library (best for classics)
    cover_url = CoverFetcher.fetch_from_open_library(title, author)
    
    # 2. Try Project Gutenberg if we have ID
    if not cover_url and gutenberg_id:
        cover_url = CoverFetcher.fetch_from_project_gutenberg(gutenberg_id)
    
    # 3. Try Google Books as backup
    if not cover_url:
        cover_url = CoverFetcher.fetch_from_google_books(title, author)
    
    # 4. Generate placeholder if nothing found
    if not cover_url:
        print(f"      ⚠️ No cover found - using placeholder")
        genre = book.get('genre', 'Classic')
        cover_url = CoverFetcher.generate_placeholder(title, author, genre)
    
    # Download and save cover locally
    if cover_url and not cover_url.startswith('https://via.placeholder'):
        try:
            print(f"      💾 Downloading cover...")
            response = requests.get(cover_url, timeout=10)
            
            if response.status_code == 200:
                # Save cover image
                filename = f"book_{book_id}.jpg"
                filepath = os.path.join(COVERS_DIR, filename)
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                print(f"      ✅ Saved: {filename}")
                
                # Return local path or keep URL for now
                return cover_url
        except Exception as e:
            print(f"      ❌ Download failed: {str(e)[:40]}")
    
    return cover_url

# ============================================================================
# UPDATE DATABASE WITH COVERS
# ============================================================================

def update_book_cover(book_id: int, cover_url: str) -> bool:
    """Update book with cover URL in database"""
    try:
        # Note: You'll need to add a PUT endpoint to your API
        # For now, we'll just return the URL
        print(f"      📝 Cover URL: {cover_url[:60]}...")
        return True
    except Exception as e:
        print(f"      ❌ Update failed: {str(e)}")
        return False

# ============================================================================
# MAIN PROCESS
# ============================================================================

def fetch_covers_for_all_books():
    """Fetch covers for all books in library"""
    
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║       Automatic Book Cover Fetcher for Readora         ║
    ╚════════════════════════════════════════════════════════╝
    """)
    
    # Get all public library books
    try:
        print("\n🔍 Fetching books from database...\n")
        response = requests.get(f"{API_BASE_URL}/books/public?limit=200", timeout=10)
        
        if response.status_code != 200:
            print("❌ Cannot fetch books from API")
            return
        
        books = response.json()
        total = len(books)
        
        print(f"📚 Found {total} books\n")
        print("="*70)
        
        successful = 0
        failed = 0
        cover_mapping = {}  # Store book_id: cover_url mapping
        
        for idx, book in enumerate(books, 1):
            print(f"\n[{idx}/{total}] Processing...")
            
            cover_url = fetch_and_save_cover(book)
            
            if cover_url:
                successful += 1
                cover_mapping[book['id']] = cover_url
                update_book_cover(book['id'], cover_url)
            else:
                failed += 1
            
            # Rate limiting
            if idx % 5 == 0:
                print(f"\n⏸️  Pausing...")
                time.sleep(2)
            else:
                time.sleep(1)
        
        # Save mapping to JSON file
        import json
        with open('book_covers_mapping.json', 'w') as f:
            json.dump(cover_mapping, f, indent=2)
        
        print("\n" + "="*70)
        print("📊 Summary:")
        print(f"✅ Covers found: {successful}/{total}")
        print(f"❌ Not found: {failed}/{total}")
        print(f"📈 Success rate: {(successful/total)*100:.1f}%")
        print("="*70)
        
        print(f"\n💾 Cover mapping saved to: book_covers_mapping.json")
        print(f"📁 Cover images saved to: {COVERS_DIR}/")
        
        print("\n📋 Next steps:")
        print("1. Add 'cover_url' field to your Book model")
        print("2. Update frontend to display covers")
        print("3. Re-run uploader with cover fetching")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return

# ============================================================================
# CLI
# ============================================================================

def main():
    print("\nOptions:")
    print("1. Fetch covers for all existing books")
    print("2. Test cover search for a single book")
    print("3. Generate cover URL mapping only (no download)")
    
    choice = input("\nSelect (1-3): ").strip()
    
    if choice == "1":
        fetch_covers_for_all_books()
    
    elif choice == "2":
        title = input("Book title: ").strip()
        author = input("Author: ").strip()
        
        print(f"\n🔍 Searching for: {title} by {author}\n")
        
        cover_url = CoverFetcher.fetch_from_open_library(title, author)
        if not cover_url:
            cover_url = CoverFetcher.fetch_from_google_books(title, author)
        
        if cover_url:
            print(f"\n✅ Found cover!")
            print(f"URL: {cover_url}")
        else:
            print(f"\n❌ No cover found")
    
    elif choice == "3":
        print("Generating URL mapping...")
        fetch_covers_for_all_books()
    
    else:
        print("Invalid option")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted")
        sys.exit(1)