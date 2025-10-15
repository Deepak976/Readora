# backend/app/schemas.py - COMPLETE VERSION WITH COVER SUPPORT
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BookCreate(BaseModel):
    title: str
    author: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None  # ← ADDED FOR COVERS

class BookOut(BaseModel):
    # Core fields
    id: int
    title: str
    author: Optional[str] = None
    description: Optional[str] = None
    filename: Optional[str] = None
    created_at: Optional[datetime] = None
    
    # ========== NEW: COVER IMAGE FIELD ==========
    cover_url: Optional[str] = None  # ← ADDED FOR BOOK COVERS
    
    # Enhanced metadata fields
    copyright_status: Optional[str] = None
    license: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    legal_notes: Optional[str] = None
    attribution_required: Optional[bool] = None
    commercial_use_allowed: Optional[bool] = None
    language: Optional[str] = None
    publication_year: Optional[int] = None
    genre: Optional[str] = None
    tags: Optional[List[str]] = None
    file_size: Optional[int] = None
    page_count: Optional[int] = None
    is_public: Optional[bool] = None
    is_featured: Optional[bool] = None
    download_count: Optional[int] = None
    view_count: Optional[int] = None
    updated_at: Optional[datetime] = None
    verification_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None  # ← ADDED FOR COVERS
    copyright_status: Optional[str] = None
    license: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    legal_notes: Optional[str] = None
    attribution_required: Optional[bool] = None
    commercial_use_allowed: Optional[bool] = None
    language: Optional[str] = None
    publication_year: Optional[int] = None
    genre: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    is_featured: Optional[bool] = None

class ContentSourceOut(BaseModel):
    id: int
    name: str
    base_url: Optional[str] = None
    api_endpoint: Optional[str] = None
    is_trusted: bool = True
    default_license: Optional[str] = None
    requires_attribution: bool = False
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True