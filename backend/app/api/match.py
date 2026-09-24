from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.services.pdf_service import extract_text_from_pdf
from app.services.cleaner_service import clean_text
from app.services.info_extractor import extract_candidate_profile
from app.services.job_service import analyze_job_description
from app.services.matching_engine import calculate_match

router = APIRouter(prefix="/api/match", tags=["Matching & Ranking"])


@router.post("")
async def match_resumes_to_job(
    job_title: str = Form(default="Software Engineer"),
    job_description: str = Form(..., min_length=10),
    resumes: List[UploadFile] = File(...)
):
    """
    Accepts a Job Description along with MULTIPLE PDF resumes.
    Parses, cleans, extracts skills/timeline, scores each candidate,
    and returns a sorted, ranked leaderboard of candidates.
    """
    if not job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty."
        )

    if not resumes or len(resumes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one PDF resume must be uploaded."
        )

    # 1. Analyze the Job Description once
    job_analysis = analyze_job_description(title=job_title, description=job_description)

    scored_candidates = []

    # 2. Process each resume sequentially
    for file in resumes:
        # File extension check
        if not file.filename.lower().endswith(".pdf"):
            continue

        try:
            file_bytes = await file.read()
            if len(file_bytes) == 0:
                continue

            # Extract & Clean
            extracted = extract_text_from_pdf(file_bytes)
            cleaned = clean_text(extracted["text"])

            # Extract Profile (Name, Email, Phone, Normalized Skills, Timeline)
            profile = extract_candidate_profile(cleaned)
            profile["raw_text"] = cleaned

            # Compute Match Score
            match_report = calculate_match(profile, job_analysis)

            # Package candidate result
            candidate_card = {
                "candidate_name": profile.get("name", file.filename),
                "email": profile.get("email"),
                "phone": profile.get("phone"),
                "filename": file.filename,
                "overall_score": match_report["overall_score"],
                "score_breakdown": match_report["breakdown"],
                "matched_required_skills": match_report["skills_analysis"]["matched_required"],
                "missing_required_skills": match_report["skills_analysis"]["missing_required"],
                "matched_preferred_skills": match_report["skills_analysis"]["matched_preferred"],
                "missing_preferred_skills": match_report["skills_analysis"]["missing_preferred"],
                "experience_summary": match_report["experience_analysis"]["summary"],
                "profile": profile
            }
            scored_candidates.append(candidate_card)

        except Exception as e:
            print(f"Warning: Failed to process resume {file.filename}: {str(e)}")
            continue

    if not scored_candidates:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No valid readable text could be extracted from the uploaded PDF resumes."
        )

    # 3. Deterministic Sorting: Highest Overall Score First
    scored_candidates.sort(key=lambda c: c["overall_score"], reverse=True)

    # 4. Assign Leaderboard Rank (1-indexed)
    for idx, cand in enumerate(scored_candidates, start=1):
        cand["rank"] = idx

    return {
        "job": job_analysis,
        "total_candidates": len(scored_candidates),
        "ranked_candidates": scored_candidates
    }
