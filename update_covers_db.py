#!/usr/bin/env python3
"""
Update Database with Book Cover URLs
====================================
Reads book_covers_mapping.json and updates database

Usage:
    python update_covers_db.py
"""

import json
import requests
import sys

API_BASE_URL = "http://localhost:8000"

def update_book_cover_in_db(book_id: int, cover_url: str) -> bool:
    """Update a book's cover_url in the database via API"""
    try:
        # We need to use the direct database update since we don't have a PUT endpoint
        # For now, we'll use a workaround by creating a manual SQL update
        print(f"   Book ID {book_id}: {cover_url[:60]}...")
        return True
    except Exception as e:
        print(f"   ❌ Failed: {str(e)}")
        return False

def main():
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║     Update Database with Book Cover URLs              ║
    ╚════════════════════════════════════════════════════════╝
    """)
    
    # Load the mapping file
    try:
        with open('book_covers_mapping.json', 'r') as f:
            cover_mapping = json.load(f)
        
        print(f"✅ Loaded {len(cover_mapping)} cover URLs from mapping file\n")
    except FileNotFoundError:
        print("❌ Error: book_covers_mapping.json not found!")
        print("   Run fetch_covers.py first to generate the mapping.\n")
        sys.exit(1)
    
    # Generate SQL update statements
    print("📝 Generating SQL update statements...\n")
    print("="*70)
    print("Copy and paste these commands into your database:")
    print("="*70)
    print()
    
    for book_id, cover_url in cover_mapping.items():
        # Escape single quotes in URL
        safe_url = cover_url.replace("'", "''")
        sql = f"UPDATE books SET cover_url = '{safe_url}' WHERE id = {book_id};"
        print(sql)
    
    print()
    print("="*70)
    print("\n📋 How to apply these updates:\n")
    print("Method 1 - Copy each line individually:")
    print("  1. Copy the UPDATE statements above")
    print("  2. Run: docker-compose exec db psql -U postgres -d postgres")
    print("  3. Paste each UPDATE statement and press Enter\n")
    
    print("Method 2 - Save to file and execute:")
    print("  1. Save updates to a file (see below)")
    print("  2. Run the batch update command\n")
    
    # Save to SQL file
    sql_file = "update_covers.sql"
    with open(sql_file, 'w') as f:
        for book_id, cover_url in cover_mapping.items():
            safe_url = cover_url.replace("'", "''")
            f.write(f"UPDATE books SET cover_url = '{safe_url}' WHERE id = {book_id};\n")
    
    print(f"✅ SQL file saved to: {sql_file}")
    print(f"\n🚀 Quick command to apply all updates:")
    print(f"   docker-compose exec -T db psql -U postgres -d postgres < {sql_file}")
    print()

if __name__ == "__main__":
    main()