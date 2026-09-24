from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.job_service import analyze_job_description

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

class JobAnalyzeRequest(BaseModel):
    title: str = Field(default="Software Engineer", description="Job Title")
    description: str = Field(..., min_length=10, description="Full job description text")

@router.post("/analyze")
def analyze_job(request: JobAnalyzeRequest):
    """
    Analyzes a job description to extract required skills, preferred skills,
    and experience requirements using the canonical skill taxonomy.
    """
    if not request.description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty."
        )

    analysis = analyze_job_description(
        title=request.title,
        description=request.description
    )

    return analysis
