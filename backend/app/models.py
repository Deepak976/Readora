# backend/app/models.py - COMPLETE VERSION WITH COVER SUPPORT
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, BigInteger
from sqlalchemy.sql import func
from app.db import Base

class Book(Base):
    __tablename__ = "books"

    # Core fields
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    author = Column(String, index=True, nullable=True)
    description = Column(Text, nullable=True)
    filename = Column(String, nullable=True)
    s3_key = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # ========== NEW: COVER IMAGE FIELD ==========
    cover_url = Column(String, nullable=True)  # ← ADDED FOR BOOK COVERS
    
    # Legal compliance fields
    copyright_status = Column(String, default="unknown", nullable=True)
    license = Column(String, nullable=True)
    source = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    verification_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)
    legal_notes = Column(Text, nullable=True)
    attribution_required = Column(Boolean, default=False, nullable=True)
    commercial_use_allowed = Column(Boolean, default=True, nullable=True)
    
    # Content metadata
    language = Column(String, default="en", nullable=True)
    publication_year = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    file_size = Column(BigInteger, nullable=True)
    page_count = Column(Integer, nullable=True)
    
    # Status and visibility
    is_public = Column(Boolean, default=True, nullable=True)
    is_featured = Column(Boolean, default=False, nullable=True)
    download_count = Column(Integer, default=0, nullable=True)
    view_count = Column(Integer, default=0, nullable=True)
    
    # Updated timestamp
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

class ContentSource(Base):
    __tablename__ = "content_sources"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    base_url = Column(String)
    api_endpoint = Column(String)
    is_trusted = Column(Boolean, default=True)
    default_license = Column(String)
    requires_attribution = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())