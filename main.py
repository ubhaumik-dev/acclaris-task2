from fastapi import FastAPI 
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

app = FastAPI()

DATABASE_URL = "sqlite:///./notes.db"

engine = create_engine(
    DATABASE_URL,
    connect_args = {"check_same_thread" : False}
)

SessionLocal = sessionmaker(bind = engine)

Base = declarative_base()

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key = True, index = True)
    title = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default = datetime.utcnow)
    updated_at = Column(
        DateTime,
        default = datetime.utcnow,
        onupdate = datetime.utcnow
    )

Base.metadata.create_all(bind=engine)


#REQUEST BODY

class NoteRequest(BaseModel):
    title: str
    content: str

class UpdateNoteRequest(BaseModel):
    id: int
    title: str
    content: str

class DeleteNoteRequest(BaseModel):
    id: int

#CREATE NOTES API

@app.post("/create-notes")
def create_note(note: NoteRequest):
    db = SessionLocal()

    new_note = Note(
        title = note.title,
        content = note.content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    db.close()

    return{
        "message": "note created successfully",
        "note":{
            "id" : new_note.id,
            "title" : new_note.title,
            "content" : new_note.content
        }
    }

#GET NOTES API
@app.get("/get-notes")
def get_notes():
    db = SessionLocal()

    notes = db.query(Note).order_by(
        Note.updated_at.desc()
    ).all()

    db.close()
    result = []

    for note in notes:
        result.append({
            "id" : note.id,
            "title" : note.title,
            "content": note.content,
            "created_at": note.created_at,
            "updated_at": note.updated_at
        })

    return result


#UPDATE NOTES api

@app.put("/update-notes")
def update_note(note:UpdateNoteRequest):
    db = SessionLocal()

    existing_note = db.query(Note).filter(
        Note.id == note.id
    )