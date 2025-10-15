#!/usr/bin/env python3
"""
Update Book Covers via API
===========================
Uses your existing PUT /books/{book_id} endpoint to update covers

Usage:
    python update_covers_via_api.py
"""

import json
import requests
import sys
import time

API_BASE_URL = "http://localhost:8000"

def update_book_cover(book_id: int, cover_url: str) -> bool:
    """Update a book's cover_url via API"""
    try:
        response = requests.put(
            f"{API_BASE_URL}/api/books/{book_id}",
            json={"cover_url": cover_url},
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"   ✅ Updated book {book_id}")
            return True
        else:
            print(f"   ❌ Failed (status {response.status_code}): {response.text[:50]}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)[:50]}")
        return False

def main():
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║     Update Book Covers via API                         ║
    ╚════════════════════════════════════════════════════════╝
    """)
    
    # Load the mapping file
    try:
        with open('book_covers_mapping.json', 'r') as f:
            cover_mapping = json.load(f)
        
        print(f"✅ Loaded {len(cover_mapping)} cover URLs\n")
    except FileNotFoundError:
        print("❌ Error: book_covers_mapping.json not found!")
        print("   Run fetch_covers.py first.\n")
        sys.exit(1)
    
    # Check API health
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ API is healthy\n")
        else:
            print("⚠️  API returned non-200 status")
    except:
        print("❌ Cannot connect to API at", API_BASE_URL)
        print("   Make sure your backend is running\n")
        sys.exit(1)
    
    # Update books
    print(f"📚 Updating {len(cover_mapping)} books...\n")
    
    successful = 0
    failed = 0
    
    for idx, (book_id, cover_url) in enumerate(cover_mapping.items(), 1):
        print(f"[{idx}/{len(cover_mapping)}] Book ID {book_id}")
        
        if update_book_cover(int(book_id), cover_url):
            successful += 1
        else:
            failed += 1
        
        # Rate limiting
        if idx % 5 == 0:
            time.sleep(1)
    
    # Summary
    print("\n" + "="*70)
    print(f"✅ Successfully updated: {successful}/{len(cover_mapping)}")
    print(f"❌ Failed: {failed}/{len(cover_mapping)}")
    print(f"📈 Success rate: {(successful/len(cover_mapping))*100:.1f}%")
    print("="*70)
    
    if successful > 0:
        print("\n🎉 Book covers updated!")
        print("   Refresh your browser to see the changes")
        print(f"   Visit: http://localhost:5173")

if __name__ == "__main__":
    main()