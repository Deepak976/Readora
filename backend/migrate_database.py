# backend/migrate_database.py
"""
Database migration script for Docker environment
Run this to safely add new columns to your PostgreSQL database
"""

import os
import sys
import time

# Add the app directory to Python path
sys.path.append('/app')

from sqlalchemy import create_engine, text

# Database URL from environment
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/postgres')

def run_migration():
    """Add new columns to existing books table"""
    
    print("🔄 Starting database migration...")
    print(f"📍 Database URL: {DATABASE_URL}")
    
    try:
        engine = create_engine(DATABASE_URL)
        
        # List of columns to add (only if they don't exist)
        migration_queries = [
            # Legal compliance fields
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS copyright_status VARCHAR(50) DEFAULT 'unknown';",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS license VARCHAR(255);",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS source VARCHAR(255);",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS source_url VARCHAR(512);",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS legal_notes TEXT;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS attribution_required BOOLEAN DEFAULT false;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS commercial_use_allowed BOOLEAN DEFAULT true;",
            
            # Content metadata
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS publication_year INTEGER;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS genre VARCHAR(100);",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS tags JSONB;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS file_size BIGINT;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS page_count INTEGER;",
            
            # Status and visibility
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;",
            "ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;",
        ]
        
        # Index creation queries (only if they don't exist)
        index_queries = [
            "CREATE INDEX IF NOT EXISTS idx_books_copyright_status ON books(copyright_status);",
            "CREATE INDEX IF NOT EXISTS idx_books_language ON books(language);",
            "CREATE INDEX IF NOT EXISTS idx_books_is_public ON books(is_public);",
            "CREATE INDEX IF NOT EXISTS idx_books_is_featured ON books(is_featured);",
            "CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);",
            "CREATE INDEX IF NOT EXISTS idx_books_publication_year ON books(publication_year);",
        ]
        
        # Wait for database to be ready
        print("⏳ Waiting for database connection...")
        for attempt in range(10):
            try:
                with engine.connect() as connection:
                    connection.execute(text("SELECT 1;"))
                    print("✅ Database connection established!")
                    break
            except Exception as e:
                print(f"   Attempt {attempt + 1}/10 failed: {e}")
                time.sleep(2)
        else:
            raise Exception("Could not connect to database after 10 attempts")
        
        with engine.connect() as connection:
            # Start transaction
            trans = connection.begin()
            
            try:
                # Check if books table exists
                check_table_query = """
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'books'
                );
                """
                table_exists = connection.execute(text(check_table_query)).scalar()
                
                if not table_exists:
                    print("❌ Books table doesn't exist yet. Please start your app first to create the table.")
                    return False
                
                # Count existing books
                existing_books = connection.execute(text("SELECT COUNT(*) FROM books;")).scalar()
                print(f"📚 Found {existing_books} existing books")
                
                # Add columns
                print("📝 Adding new columns...")
                for i, query in enumerate(migration_queries, 1):
                    try:
                        connection.execute(text(query))
                        print(f"   ✅ {i}/{len(migration_queries)}: Column added")
                    except Exception as e:
                        print(f"   ⚠️  {i}/{len(migration_queries)}: {str(e)}")
                
                # Add indexes
                print("🔍 Creating indexes...")
                for i, query in enumerate(index_queries, 1):
                    try:
                        connection.execute(text(query))
                        print(f"   ✅ {i}/{len(index_queries)}: Index created")
                    except Exception as e:
                        print(f"   ⚠️  {i}/{len(index_queries)}: {str(e)}")
                
                # Update existing records with default values
                print("🔄 Updating existing records...")
                update_query = """
                UPDATE books SET 
                    copyright_status = COALESCE(copyright_status, 'unknown'),
                    license = COALESCE(license, 'To be verified'),
                    source = COALESCE(source, 'User Upload'),
                    is_public = COALESCE(is_public, true),
                    is_featured = COALESCE(is_featured, false),
                    download_count = COALESCE(download_count, 0),
                    view_count = COALESCE(view_count, 0),
                    attribution_required = COALESCE(attribution_required, false),
                    commercial_use_allowed = COALESCE(commercial_use_allowed, true),
                    language = COALESCE(language, 'en'),
                    verification_date = COALESCE(verification_date, CURRENT_TIMESTAMP),
                    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)
                WHERE id IS NOT NULL;
                """
                result = connection.execute(text(update_query))
                print(f"   ✅ Updated {result.rowcount} records")
                
                # Commit transaction
                trans.commit()
                print("✅ Migration completed successfully!")
                
                # Show final count
                final_count = connection.execute(text("SELECT COUNT(*) FROM books;")).scalar()
                print(f"📚 Total books in database: {final_count}")
                
                return True
                
            except Exception as e:
                trans.rollback()
                print(f"❌ Migration failed: {e}")
                raise
                
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def create_content_sources_table():
    """Create the content_sources table"""
    print("📝 Creating content_sources table...")
    
    try:
        engine = create_engine(DATABASE_URL)
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS content_sources (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            base_url VARCHAR(512),
            api_endpoint VARCHAR(512),
            is_trusted BOOLEAN DEFAULT true,
            default_license VARCHAR(255),
            requires_attribution BOOLEAN DEFAULT false,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        with engine.connect() as connection:
            connection.execute(text(create_table_query))
            connection.commit()
            print("✅ Content sources table created!")
            
    except Exception as e:
        print(f"❌ Failed to create content_sources table: {e}")

if __name__ == "__main__":
    print("🚀 Starting Readora database migration...")
    
    # Run migrations
    if run_migration():
        create_content_sources_table()
        print("\n🎉 All migrations completed successfully!")
    else:
        print("\n❌ Migration failed!")
        sys.exit(1)