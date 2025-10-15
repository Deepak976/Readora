#!/usr/bin/env python3
"""
Script to clear sample books from the Readora database.
This removes all books with source = 'Sample Data' to clean up the public library.
"""

import asyncio
import asyncpg
import os
from datetime import datetime

# Database connection from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://readora_user:readora_pass@db:5432/readora_db")

async def clear_sample_books():
    """Remove all sample books from the database."""
    print("🔗 Connecting to database...")
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("✅ Connected to database successfully!")
        
        # Count existing sample books
        count_query = "SELECT COUNT(*) FROM books WHERE source = 'Sample Data'"
        count = await conn.fetchval(count_query)
        print(f"📊 Found {count} sample books in database")
        
        if count > 0:
            # Delete all sample books
            print("🗑️ Clearing sample books...")
            delete_query = "DELETE FROM books WHERE source = 'Sample Data'"
            result = await conn.execute(delete_query)
            print(f"✅ Successfully deleted all sample books")
            print(f"📈 Database cleanup completed!")
        else:
            print("ℹ️ No sample books found - database is already clean")
        
        # Show remaining books count
        remaining_query = "SELECT COUNT(*) FROM books"
        remaining = await conn.fetchval(remaining_query)
        print(f"📚 Remaining books in database: {remaining}")
        
        # Show breakdown by source
        sources_query = "SELECT source, COUNT(*) FROM books GROUP BY source"
        sources = await conn.fetch(sources_query)
        if sources:
            print("📋 Books by source:")
            for row in sources:
                print(f"  - {row['source']}: {row['count']} books")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
    
    finally:
        if 'conn' in locals():
            await conn.close()
            print("🔌 Database connection closed.")

async def show_database_stats():
    """Show current database statistics."""
    print("\n" + "="*50)
    print("📊 CURRENT DATABASE STATUS")
    print("="*50)
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Total books
        total = await conn.fetchval("SELECT COUNT(*) FROM books")
        print(f"Total books: {total}")
        
        # By source
        sources = await conn.fetch("SELECT source, COUNT(*) FROM books GROUP BY source ORDER BY COUNT(*) DESC")
        print(f"Books by source:")
        for row in sources:
            source_name = row['source'] or 'Unknown'
            print(f"  {source_name}: {row['count']}")
        
        # Admin uploaded books
        admin_books = await conn.fetchval("SELECT COUNT(*) FROM books WHERE source = 'Admin Upload' AND is_public = true")
        print(f"Public library books (admin uploaded): {admin_books}")
        
        # Personal documents
        personal_books = await conn.fetchval("SELECT COUNT(*) FROM books WHERE is_public = false OR library_type = 'personal'")
        print(f"Personal documents: {personal_books}")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")

if __name__ == "__main__":
    print("🧹 READORA DATABASE CLEANUP")
    print("This will remove all sample/demo books from the database")
    print("Your uploaded books will remain untouched")
    print("-" * 50)
    
    asyncio.run(clear_sample_books())
    asyncio.run(show_database_stats())
    
    print("\n✨ Cleanup complete! Your public library is now clean.")
    print("📤 Upload books via the Admin Panel to populate your public library.")