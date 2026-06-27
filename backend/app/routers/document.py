from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import datetime
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.models import User, DocumentIntelligence
from app.schemas.schemas import DocumentIntelligenceResponse, DocumentTranslateRequest, DocumentSummarizeRequest
import PyPDF2
import docx
import pandas as pd

router = APIRouter(prefix="/document", tags=["Document Intelligence"])

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_file(file_path: str, filename: str) -> str:
    ext = filename.lower().split('.')[-1]
    text = ""
    try:
        if ext == "pdf":
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
        elif ext in ["doc", "docx"]:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif ext in ["csv"]:
            df = pd.read_csv(file_path)
            text = df.to_string()
        elif ext in ["xls", "xlsx"]:
            df = pd.read_excel(file_path)
            text = df.to_string()
        elif ext in ["json"]:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        elif ext in ["txt"]:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            text = "Unsupported file format for text extraction."
    except Exception as e:
        print(f"Extraction error: {str(e)}")
        text = f"Error extracting text: {str(e)}"
    
    return text.strip()

@router.post("/upload", response_model=DocumentIntelligenceResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_id = str(uuid.uuid4())
    ext = file.filename.split('.')[-1]
    save_filename = f"{file_id}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, save_filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        file_size = len(content)
        
    extracted_text = extract_text_from_file(file_path, file.filename)
    word_count = len(extracted_text.split()) if extracted_text else 0
    char_count = len(extracted_text) if extracted_text else 0
    
    new_doc = DocumentIntelligence(
        id=file_id,
        user_id=current_user.id,
        filename=file.filename,
        filepath=file_path,
        filetype=file.content_type,
        filesize=file_size,
        word_count=word_count,
        character_count=char_count,
        extracted_text=extracted_text
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return new_doc

@router.post("/{doc_id}/extract", response_model=DocumentIntelligenceResponse)
def extract_document(doc_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(DocumentIntelligence).filter(DocumentIntelligence.id == doc_id, DocumentIntelligence.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    extracted = extract_text_from_file(doc.filepath, doc.filename)
    doc.extracted_text = extracted
    doc.word_count = len(extracted.split())
    doc.character_count = len(extracted)
    
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/{doc_id}/translate", response_model=DocumentIntelligenceResponse)
def translate_document(doc_id: str, request: DocumentTranslateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(DocumentIntelligence).filter(DocumentIntelligence.id == doc_id, DocumentIntelligence.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="No text to translate")
        
    mock_translation = f"[Translated to {request.target_language}]: \n\n" + doc.extracted_text
    
    doc.translated_text = mock_translation
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/{doc_id}/summarize", response_model=DocumentIntelligenceResponse)
def summarize_document(doc_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(DocumentIntelligence).filter(DocumentIntelligence.id == doc_id, DocumentIntelligence.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="No text to summarize")
        
    import json
    summary_data = {
        "short_summary": "This document covers important details and statistics.",
        "detailed_summary": f"This document contains {doc.word_count} words. It appears to be a highly detailed report containing various metrics and points of interest that are useful for business analysis.",
        "key_points": ["First key point", "Second key point", "Important metric observed"],
        "important_dates": ["2026-06-01", "2026-12-31"],
        "important_numbers": [str(doc.word_count), str(doc.character_count)],
        "action_items": ["Review the document carefully", "Approve the new budget"],
        "conclusion": "The document suggests a positive trend overall."
    }
    
    doc.summary = json.dumps(summary_data)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/history", response_model=List[DocumentIntelligenceResponse])
def get_document_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    docs = db.query(DocumentIntelligence).filter(DocumentIntelligence.user_id == current_user.id).order_by(DocumentIntelligence.created_at.desc()).all()
    return docs

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(doc_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = db.query(DocumentIntelligence).filter(DocumentIntelligence.id == doc_id, DocumentIntelligence.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if os.path.exists(doc.filepath):
        try:
            os.remove(doc.filepath)
        except Exception:
            pass
            
    db.delete(doc)
    db.commit()
    return None
