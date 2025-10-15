# backend/app/main.py - Complete Updated Version with Cover URL Support
import uuid
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, inspect as sql_inspect
from app.db import SessionLocal, engine
from app import models, schemas
from app.core.config import settings
import boto3
from botocore.client import Config as BotoConfig
from fastapi.responses import StreamingResponse
from datetime import datetime

# Create tables if not exist
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️ Database table creation warning: {e}")

app = FastAPI(
    title="Readora Professional Library API",
    description="Global Digital Library Management System - Professional Edition",
    version="3.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize S3 clients
try:
    s3_internal = boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        config=BotoConfig(signature_version="s3v4"),
    )

    s3_presign = boto3.client(
        "s3",
        endpoint_url=getattr(settings, "S3_PUBLIC_ENDPOINT_URL", settings.S3_ENDPOINT_URL),
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        config=BotoConfig(signature_version="s3v4"),
    )
    print("✅ S3 clients initialized successfully")
except Exception as e:
    print(f"⚠️ S3 client initialization warning: {e}")
    s3_internal = None
    s3_presign = None

# Root endpoint
@app.get("/")
def read_root():
    """API root endpoint"""
    return {
        "message": "Welcome to Readora Professional Library API",
        "status": "running",
        "version": "3.0.0",
        "description": "Global Digital Library Platform - Multi-Format Support (PDF, EPUB, HTML, TXT)",
        "endpoints": {
            "public_library": "/books/public",
            "user_uploads": "/books/user-uploads", 
            "all_books": "/books",
            "upload": "/books (POST)",
            "search": "/books/search",
            "featured": "/books/featured",
            "stats": "/stats",
            "health": "/health",
            "docs": "/docs"
        }
    }

# Health check
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "readora-professional-api",
        "version": "3.0.0",
        "timestamp": datetime.now().isoformat(),
        "supported_formats": ["PDF", "EPUB", "HTML", "TXT"]
    }

# Get public library books
@app.get("/books/public")
def get_public_books(
    genre: Optional[str] = Query(None, description="Filter by genre"),
    featured_only: bool = Query(False, description="Show only featured books"),
    limit: int = Query(100, description="Maximum number of books to return"),
    db: Session = Depends(get_db)
):
    """Get public library books - curated, legal, public domain content"""
    try:
        print(f"[get_public_books] Fetching public books (genre={genre}, featured={featured_only}, limit={limit})")
        
        query = db.query(models.Book)
        
        try:
            public_filter = or_(
                models.Book.source == 'Sample Data',
                models.Book.copyright_status == 'Public Domain',
                and_(models.Book.is_public.is_(True), models.Book.source != 'User Upload')
            )
            query = query.filter(public_filter)
            
            if featured_only:
                query = query.filter(models.Book.is_featured.is_(True))
                
        except Exception as e:
            print(f"[get_public_books] Using fallback filter: {e}")
            query = query.filter(
                or_(
                    models.Book.source == 'Sample Data',
                    models.Book.featured.is_(True) if hasattr(models.Book, 'featured') else False
                )
            )
        
        if genre and genre != "all":
            try:
                if hasattr(models.Book, 'genre'):
                    query = query.filter(models.Book.genre.ilike(f"%{genre}%"))
                else:
                    query = query.filter(models.Book.description.ilike(f"%{genre}%"))
            except:
                pass
        
        try:
            if hasattr(models.Book, 'is_featured'):
                query = query.order_by(models.Book.is_featured.desc(), models.Book.title.asc())
            else:
                query = query.order_by(models.Book.title.asc())
        except:
            query = query.order_by(models.Book.title.asc())
        
        books = query.limit(limit).all()
        print(f"[get_public_books] Found {len(books)} public books")
        
        return convert_books_to_dict(books)
        
    except Exception as e:
        print(f"[get_public_books] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get user uploaded books
@app.get("/books/user-uploads")
def get_user_uploads(
    limit: int = Query(50, description="Maximum number of books to return"),
    db: Session = Depends(get_db)
):
    """Get user uploaded books - personal collections"""
    try:
        print(f"[get_user_uploads] Fetching user uploads (limit={limit})")
        
        query = db.query(models.Book)
        
        try:
            query = query.filter(
                and_(
                    models.Book.source != 'Sample Data',
                    models.Book.filename.isnot(None),
                    models.Book.s3_key.isnot(None)
                )
            )
        except Exception as e:
            print(f"[get_user_uploads] Using fallback filter: {e}")
            query = query.filter(models.Book.filename.isnot(None))
        
        books = query.order_by(models.Book.created_at.desc()).limit(limit).all()
        print(f"[get_user_uploads] Found {len(books)} user uploads")
        
        return convert_books_to_dict(books)
        
    except Exception as e:
        print(f"[get_user_uploads] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get featured books
@app.get("/books/featured")
def get_featured_books(
    limit: int = Query(12, description="Maximum number of featured books"),
    db: Session = Depends(get_db)
):
    """Get featured books for homepage display"""
    try:
        print(f"[get_featured_books] Fetching featured books (limit={limit})")
        
        query = db.query(models.Book)
        
        try:
            query = query.filter(models.Book.is_featured.is_(True))
        except:
            if hasattr(models.Book, 'featured'):
                query = query.filter(models.Book.featured.is_(True))
            else:
                query = query.filter(models.Book.source == 'Sample Data')
        
        books = query.order_by(models.Book.title.asc()).limit(limit).all()
        print(f"[get_featured_books] Found {len(books)} featured books")
        
        return convert_books_to_dict(books)
        
    except Exception as e:
        print(f"[get_featured_books] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Enhanced search endpoint
@app.get("/books/search")
def search_books(
    q: str = Query(..., description="Search query"),
    category: str = Query("all", description="Category: all, public, uploads"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    author: Optional[str] = Query(None, description="Filter by author"),
    limit: int = Query(50, description="Maximum results"),
    db: Session = Depends(get_db)
):
    """Advanced book search across title, author, description, and genre"""
    try:
        print(f"[search_books] Search: '{q}' in {category} (genre={genre}, author={author})")
        
        query = db.query(models.Book)
        
        if category == "public":
            try:
                query = query.filter(
                    or_(
                        models.Book.source == 'Sample Data',
                        models.Book.copyright_status == 'Public Domain',
                        models.Book.is_public.is_(True)
                    )
                )
            except:
                query = query.filter(models.Book.source == 'Sample Data')
        elif category == "uploads":
            try:
                query = query.filter(
                    and_(
                        models.Book.source != 'Sample Data',
                        models.Book.filename.isnot(None)
                    )
                )
            except:
                query = query.filter(models.Book.filename.isnot(None))
        
        search_filter = or_(
            models.Book.title.ilike(f"%{q}%"),
            models.Book.author.ilike(f"%{q}%"),
            models.Book.description.ilike(f"%{q}%")
        )
        
        try:
            if hasattr(models.Book, 'genre'):
                search_filter = or_(search_filter, models.Book.genre.ilike(f"%{q}%"))
        except:
            pass
            
        query = query.filter(search_filter)
        
        if genre and genre != "all":
            try:
                if hasattr(models.Book, 'genre'):
                    query = query.filter(models.Book.genre.ilike(f"%{genre}%"))
            except:
                pass
                
        if author:
            query = query.filter(models.Book.author.ilike(f"%{author}%"))
        
        books = query.order_by(models.Book.title.asc()).limit(limit).all()
        print(f"[search_books] Found {len(books)} results")
        
        return {
            "query": q,
            "category": category,
            "total_results": len(books),
            "books": convert_books_to_dict(books)
        }
        
    except Exception as e:
        print(f"[search_books] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

# Statistics endpoint
@app.get("/stats")
def get_library_stats(db: Session = Depends(get_db)):
    """Get library statistics"""
    try:
        total_books = db.query(models.Book).count()
        
        try:
            public_books = db.query(models.Book).filter(
                or_(
                    models.Book.source == 'Sample Data',
                    models.Book.is_public.is_(True)
                )
            ).count()
            user_uploads = db.query(models.Book).filter(
                and_(
                    models.Book.source != 'Sample Data',
                    models.Book.filename.isnot(None)
                )
            ).count()
            featured_count = db.query(models.Book).filter(models.Book.is_featured.is_(True)).count()
        except:
            public_books = db.query(models.Book).filter(models.Book.source == 'Sample Data').count()
            user_uploads = total_books - public_books
            featured_count = 0
        
        genres = {}
        try:
            if hasattr(models.Book, 'genre'):
                genre_results = db.query(models.Book.genre).filter(models.Book.genre.isnot(None)).all()
                for (genre,) in genre_results:
                    if genre:
                        genres[genre] = genres.get(genre, 0) + 1
        except:
            pass
        
        return {
            "total_books": total_books,
            "public_library_books": public_books,
            "user_uploaded_books": user_uploads,
            "featured_books": featured_count,
            "available_genres": list(genres.keys()),
            "genre_distribution": genres,
            "supported_formats": ["PDF", "EPUB", "HTML", "TXT"],
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"[get_stats] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Stats error: {str(e)}")

# Get all books (legacy endpoint)
@app.get("/books")
def get_books(db: Session = Depends(get_db)):
    """Get all books (legacy endpoint - maintained for compatibility)"""
    try:
        print("[get_books] Fetching all books...")
        books = db.query(models.Book).order_by(models.Book.created_at.desc()).all()
        print(f"[get_books] Found {len(books)} total books")
        return convert_books_to_dict(books)
        
    except Exception as e:
        print(f"[get_books] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get single book by ID
@app.get("/books/{book_id}")
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    """Get a single book by ID"""
    try:
        print(f"[get_book_by_id] Fetching book ID: {book_id}")
        book = db.query(models.Book).filter(models.Book.id == book_id).first()
        
        if not book:
            raise HTTPException(status_code=404, detail=f"Book with ID {book_id} not found")
        
        return convert_book_to_dict(book)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[get_book_by_id] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Enhanced upload with multi-format support and cover URL
@app.post("/books")
def upload_book(
    title: str = Form(...),
    author: str = Form(""),
    description: str = Form(None),
    genre: str = Form(None),
    copyright_status: str = Form("unknown"),
    language: str = Form("en"),
    is_public: bool = Form(True),
    cover_url: str = Form(None),  # ← BOOK COVERS
    file: UploadFile = None,
    db: Session = Depends(get_db)
):
    """Upload a new book - supports PDF, EPUB, HTML, and TXT formats"""
    if file is None:
        raise HTTPException(status_code=400, detail="File is required")
    
    allowed_types = [
        "application/pdf",
        "application/epub+zip",
        "application/epub",
        "text/html",
        "text/plain",
        "application/octet-stream"
    ]
    
    file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    allowed_extensions = ['pdf', 'epub', 'html', 'htm', 'txt']
    
    if file.content_type not in allowed_types and file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: PDF, EPUB, HTML, TXT"
        )

    if not s3_internal:
        raise HTTPException(status_code=500, detail="S3 storage not available")

    try:
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_title = safe_title.replace(' ', '_')
        s3_key = f"books/{uuid.uuid4()}_{safe_title}.{file_ext}"

        print(f"[upload] Uploading {file.filename} to {s3_key}")
        
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        s3_internal.upload_fileobj(file.file, settings.S3_BUCKET, s3_key)
        
        book_data = {
            "title": title,
            "author": author if author else None,
            "description": description,
            "filename": file.filename,
            "s3_key": s3_key,
            "cover_url": cover_url,
            "file_size": file_size,
            "copyright_status": copyright_status,
            "language": language,
            "is_public": is_public,
            "is_featured": False,
            "download_count": 0,
            "view_count": 0,
        }
        
        if genre:
            book_data["genre"] = genre
        
        new_book = models.Book(**book_data)
        
        db.add(new_book)
        db.commit()
        db.refresh(new_book)
        
        print(f"[upload] Book {new_book.id} created successfully")
        
        return convert_book_to_dict(new_book)

    except Exception as e:
        print(f"[upload] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Download/stream book
@app.get("/books/{book_id}/download")
def download_book(book_id: int, inline: bool = False, db: Session = Depends(get_db)):
    """Download or stream a book"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if not s3_internal or not s3_presign:
        raise HTTPException(status_code=500, detail="S3 storage not available")

    try:
        file_ext = book.filename.split('.')[-1].lower() if book.filename and '.' in book.filename else 'pdf'
        
        content_type_map = {
            'pdf': 'application/pdf',
            'epub': 'application/epub+zip',
            'html': 'text/html',
            'htm': 'text/html',
            'txt': 'text/plain'
        }
        content_type = content_type_map.get(file_ext, 'application/pdf')
        
        if inline and file_ext == 'pdf':
            obj = s3_internal.get_object(Bucket=settings.S3_BUCKET, Key=book.s3_key)
            body = obj["Body"]
            headers = {
                "Content-Disposition": f'inline; filename="{book.filename}"',
                "Content-Type": content_type
            }
            
            try:
                book.view_count = (book.view_count or 0) + 1
                db.commit()
            except:
                pass
            
            return StreamingResponse(body, media_type=content_type, headers=headers)
        else:
            s3_params = {
                "Bucket": settings.S3_BUCKET,
                "Key": book.s3_key,
                "ResponseContentType": content_type,
                "ResponseContentDisposition": f'attachment; filename="{book.filename}"'
            }
            url = s3_presign.generate_presigned_url("get_object", Params=s3_params, ExpiresIn=3600)
            
            try:
                book.download_count = (book.download_count or 0) + 1
                db.commit()
            except:
                pass
            
            return {"url": url, "format": file_ext.upper()}

    except Exception as e:
        print(f"[download] Error: {e}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

# Delete book
@app.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book_title = book.title
    
    try:
        if s3_internal and hasattr(book, 's3_key') and book.s3_key:
            try:
                s3_internal.delete_object(Bucket=settings.S3_BUCKET, Key=book.s3_key)
            except Exception as s3_error:
                print(f"[delete] S3 warning: {s3_error}")
        
        db.delete(book)
        db.commit()
        
        return {
            "message": f"Book '{book_title}' deleted successfully",
            "deleted_id": book_id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete: {str(e)}")

# Helper functions
def convert_books_to_dict(books):
    """Convert list of books to dictionaries"""
    return [convert_book_to_dict(book) for book in books]

def convert_book_to_dict(book):
    """Convert single book to dictionary with ALL columns"""
    mapper = sql_inspect(book.__class__)
    book_dict = {}
    
    for column in mapper.columns:
        try:
            value = getattr(book, column.name)
            book_dict[column.name] = value
        except Exception as e:
            print(f"[convert] Warning getting {column.name}: {e}")
            book_dict[column.name] = None
    
    return book_dict

print("🚀 Readora Professional Library API starting...")
print("📚 Endpoints: /books, /books/public, /books/featured, /health")
print("📄 Formats: PDF, EPUB, HTML, TXT")
print("🎨 Book covers: Enabled!")