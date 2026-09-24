import io
from pypdf import PdfReader
from fastapi import HTTPException, status

def extract_text_from_pdf(file_bytes: bytes) -> dict:
    """
    Extracts text from raw PDF bytes.
    Returns a dictionary containing the extracted text and total page count.
    """
    try:
        # Wrap bytes in an in-memory binary stream
        pdf_stream = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_stream)
        
        page_count = len(reader.pages)
        if page_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded PDF file has no pages."
            )
        
        extracted_text = []
        for index, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            extracted_text.append(page_text)
            
        full_text = "\n".join(extracted_text)
        
        # Check if text was found (scanned PDFs without OCR will have empty text)
        if not full_text.strip():
            raise HTTPException(
                status_code=422,
                detail="PDF is empty or contains only scanned images (no selectable text)."
            )
            
        return {
            "text": full_text,
            
            "page_count": page_count
        }
        
    except HTTPException:
        # Re-raise explicit HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse PDF file: {str(e)}"
        )
