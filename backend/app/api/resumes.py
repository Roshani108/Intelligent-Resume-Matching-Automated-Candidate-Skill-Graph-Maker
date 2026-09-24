from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.pdf_service import extract_text_from_pdf
from app.services.cleaner_service import clean_text
from app.services.info_extractor import extract_candidate_profile

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Accept a PDF resume, extract text, clean it, and extract full candidate profile
    (Name, Email, Phone, Normalized Skills, Education, Experience).
    """
    # 1. File extension validation
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF files are supported."
        )
    
    # 2. MIME Content-Type validation
    allowed_types = ["application/pdf", "application/x-pdf", "application/octet-stream"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid MIME type '{file.content_type}'. Must be application/pdf."
        )

    # 3. Read uploaded bytes
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes)."
        )

    # 4. Extract raw text from PDF
    extracted = extract_text_from_pdf(file_bytes)
    raw_text = extracted["text"]

    # 5. Clean text
    cleaned = clean_text(raw_text)

    # 6. Extract full structured profile
    profile = extract_candidate_profile(cleaned)

    # 7. Return complete structured response
    return {
        "filename": file.filename,
        "page_count": extracted["page_count"],
        "profile": profile,
        "raw_text": raw_text,
        "clean_text": cleaned
    }
