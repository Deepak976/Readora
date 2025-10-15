# backend/app/api/books.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, asc, text
from typing import Optional, List
from app.db import SessionLocal
from app.models import Book
from app.schemas import BookOut, BookUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/books", response_model=dict)
def get_books_paginated(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search in title, author, description"),
    author: Optional[str] = Query(None, description="Filter by author"),
    language: Optional[str] = Query(None, description="Filter by language"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    copyright_status: Optional[str] = Query(None, description="Filter by copyright status"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    featured_only: bool = Query(False, description="Show only featured books"),
    public_only: bool = Query(True, description="Show only public books"),
    db: Session = Depends(get_db)
):
    """
    Get books with pagination, search, and filtering
    Enhanced version of the original /books endpoint
    """
    
    # Base query
    query = db.query(Book)
    
    # Apply public filter
    if public_only:
        query = query.filter(Book.is_public == True)
    
    # Apply filters
    if search:
        search_filter = or_(
            Book.title.ilike(f"%{search}%"),
            Book.author.ilike(f"%{search}%"),
            Book.description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if author:
        query = query.filter(Book.author.ilike(f"%{author}%"))
    
    if language:
        query = query.filter(Book.language == language)
        
    if genre:
        query = query.filter(Book.genre.ilike(f"%{genre}%"))
        
    if copyright_status:
        query = query.filter(Book.copyright_status == copyright_status)
        
    if featured_only:
        query = query.filter(Book.is_featured == True)
    
    # Apply sorting
    if hasattr(Book, sort_by):
        sort_column = getattr(Book, sort_by)
        if sort_order.lower() == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
    else:
        # Default sort
        query = query.order_by(desc(Book.created_at))
    
    # Get total count for pagination
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    books = query.offset(offset).limit(limit).all()
    
    # Calculate pagination info
    total_pages = (total_count + limit - 1) // limit
    has_next = page < total_pages
    has_prev = page > 1
    
    return {
        "books": books,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
            "has_next": has_next,
            "has_previous": has_prev
        },
        "filters_applied": {
            "search": search,
            "author": author,
            "language": language,
            "genre": genre,
            "copyright_status": copyright_status,
            "featured_only": featured_only,
            "public_only": public_only
        }
    }

@router.get("/books/featured", response_model=List[BookOut])
def get_featured_books(
    limit: int = Query(10, le=50, description="Number of featured books"),
    db: Session = Depends(get_db)
):
    """Get featured books for homepage"""
    return db.query(Book).filter(
        and_(Book.is_public == True, Book.is_featured == True)
    ).order_by(desc(Book.created_at)).limit(limit).all()

@router.get("/books/stats")
def get_books_stats(db: Session = Depends(get_db)):
    """Get collection statistics"""
    
    # Basic stats
    total_books = db.query(func.count(Book.id)).scalar()
    public_books = db.query(func.count(Book.id)).filter(Book.is_public == True).scalar()
    featured_books = db.query(func.count(Book.id)).filter(Book.is_featured == True).scalar()
    
    # Copyright status distribution
    copyright_stats = db.execute(text("""
        SELECT copyright_status, COUNT(*) as count 
        FROM books 
        WHERE is_public = true 
        GROUP BY copyright_status 
        ORDER BY count DESC
    """)).fetchall()
    
    # Language distribution
    language_stats = db.execute(text("""
        SELECT language, COUNT(*) as count 
        FROM books 
        WHERE is_public = true 
        GROUP BY language 
        ORDER BY count DESC
        LIMIT 10
    """)).fetchall()
    
    # Top authors
    author_stats = db.execute(text("""
        SELECT author, COUNT(*) as book_count 
        FROM books 
        WHERE is_public = true AND author IS NOT NULL AND author != ''
        GROUP BY author 
        ORDER BY book_count DESC 
        LIMIT 10
    """)).fetchall()
    
    # Recent activity
    recent_uploads = db.query(func.count(Book.id)).filter(
        Book.created_at >= func.now() - text("INTERVAL '7 days'")
    ).scalar()
    
    return {
        "total_books": total_books,
        "public_books": public_books,
        "featured_books": featured_books,
        "recent_uploads_7days": recent_uploads,
        "copyright_distribution": [
            {"status": row.copyright_status or "unknown", "count": row.count} 
            for row in copyright_stats
        ],
        "language_distribution": [
            {"language": row.language or "unknown", "count": row.count} 
            for row in language_stats
        ],
        "top_authors": [
            {"name": row.author, "book_count": row.book_count} 
            for row in author_stats
        ]
    }

@router.get("/books/search/suggestions")
def get_search_suggestions(
    q: str = Query(..., min_length=2, description="Search query"),
    db: Session = Depends(get_db)
):
    """Get search suggestions for autocomplete"""
    
    # Title suggestions
    title_suggestions = db.query(Book.title).filter(
        and_(Book.is_public == True, Book.title.ilike(f"%{q}%"))
    ).limit(5).all()
    
    # Author suggestions
    author_suggestions = db.query(Book.author).filter(
        and_(
            Book.is_public == True, 
            Book.author.ilike(f"%{q}%"),
            Book.author.isnot(None),
            Book.author != ""
        )
    ).distinct().limit(5).all()
    
    return {
        "titles": [title[0] for title in title_suggestions],
        "authors": [author[0] for author in author_suggestions]
    }

@router.put("/books/{book_id}", response_model=BookOut)
def update_book(
    book_id: int,
    book_update: BookUpdate,
    db: Session = Depends(get_db)
):
    """Update book metadata (for admin/legal compliance)"""
    
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Update only provided fields
    update_data = book_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)
    
    # Update the updated_at timestamp
    book.updated_at = func.now()
    
    db.commit()
    db.refresh(book)
    
    return book

@router.post("/books/{book_id}/track-view")
def track_book_view(book_id: int, db: Session = Depends(get_db)):
    """Track when someone views/reads a book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.view_count = (book.view_count or 0) + 1
    db.commit()
    
    return {"message": "View tracked", "total_views": book.view_count}

@router.post("/books/{book_id}/track-download")
def track_book_download(book_id: int, db: Session = Depends(get_db)):
    """Track when someone downloads a book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.download_count = (book.download_count or 0) + 1
    db.commit()
    
    return {"message": "Download tracked", "total_downloads": book.download_count}

@router.patch("/books/{book_id}/feature")
def toggle_featured_status(book_id: int, featured: bool, db: Session = Depends(get_db)):
    """Toggle featured status of a book (admin function)"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.is_featured = featured
    book.updated_at = func.now()
    db.commit()
    
    return {"message": f"Book {'featured' if featured else 'unfeatured'} successfully"}

@router.patch("/books/{book_id}/visibility")
def toggle_book_visibility(book_id: int, is_public: bool, db: Session = Depends(get_db)):
    """Toggle visibility of a book (admin function)"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.is_public = is_public
    book.updated_at = func.now()
    db.commit()
    
    return {"message": f"Book {'published' if is_public else 'hidden'} successfully"}