# app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas

def create_book(db: Session, book_in: schemas.BookCreate, s3_key: str, filename: str):
    db_book = models.Book(
        title=book_in.title,
        author=book_in.author,
        description=book_in.description,
        s3_key=s3_key,
        filename=filename,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book
