import re
from typing import Dict, List, Any
from app.services.embedding_service import get_semantic_similarity_score

# Configurable matching weights (clearly labeled design choice)
WEIGHT_SKILLS = 0.50
WEIGHT_SEMANTIC = 0.35
WEIGHT_EXPERIENCE = 0.15


def estimate_candidate_experience_years(timeline: List[dict], raw_text: str = "") -> int:
    """
    Estimates total years of experience from timeline entries and text heuristics.
    """
    years_found = set()
    for item in timeline:
        # Search for 4-digit years (e.g. 2019, 2024)
        s_years = re.findall(r'\b(19\d{2}|20\d{2})\b', item.get("start_date", ""))
        e_years = re.findall(r'\b(19\d{2}|20\d{2})\b', item.get("end_date", ""))
        
        for y in s_years + e_years:
            years_found.add(int(y))

    if years_found:
        min_y = min(years_found)
        max_y = max(years_found)
        span = max_y - min_y
        return max(1, span + 1)

    # Fallback: Check text for explicit patterns like "5 years of experience"
    match = re.search(r'(\d+)\+?\s*years?\s+(?:of\s+)?experience', raw_text, re.IGNORECASE)
    if match:
        return int(match.group(1))

    # Default baseline if timeline is brief
    return len(timeline) * 2 if timeline else 1


def calculate_match(candidate_profile: dict, job_analysis: dict) -> dict:
    """
    Computes a comprehensive match breakdown between candidate and job description.
    """
    candidate_skills = set(candidate_profile.get("skills", []))
    required_skills = set(job_analysis.get("required_skills", []))
    preferred_skills = set(job_analysis.get("preferred_skills", []))

    # 1. Calculate Skill Match
    matched_req = sorted(list(candidate_skills.intersection(required_skills)))
    missing_req = sorted(list(required_skills - candidate_skills))
    
    matched_pref = sorted(list(candidate_skills.intersection(preferred_skills)))
    missing_pref = sorted(list(preferred_skills - candidate_skills))

    # Required skills score (0 to 100)
    req_score = (len(matched_req) / len(required_skills) * 100) if required_skills else 100.0

    # Preferred skills bonus score (0 to 100)
    pref_score = (len(matched_pref) / len(preferred_skills) * 100) if preferred_skills else 100.0

    # Composite skill score (80% required + 20% preferred)
    if preferred_skills:
        skill_score = (req_score * 0.80) + (pref_score * 0.20)
    else:
        skill_score = req_score

    skill_score = round(min(100.0, max(0.0, skill_score)), 1)

    # 2. Calculate Semantic Similarity
    # Build a combined text blob of the candidate's skills, roles, and descriptions
    candidate_blob = f"{candidate_profile.get('name', '')}\nSkills: {', '.join(candidate_skills)}\n"
    for role in candidate_profile.get("timeline", []):
        candidate_blob += f"{role.get('role', '')} at {role.get('company', '')}: {role.get('description', '')}\n"
    
    # Fallback if timeline is empty
    if not candidate_profile.get("timeline"):
        candidate_blob += " ".join(candidate_profile.get("experience", []))

    job_blob = f"{job_analysis.get('title', '')}\n{job_analysis.get('description', '')}\nRequired Skills: {', '.join(required_skills)}"

    semantic_res = get_semantic_similarity_score(candidate_blob, job_blob)
    semantic_score = semantic_res["score_pct"]

    # 3. Calculate Experience Score
    timeline = candidate_profile.get("timeline", [])
    raw_text = candidate_profile.get("raw_text", "")
    cand_exp_years = estimate_candidate_experience_years(timeline, raw_text)
    req_exp_years = job_analysis.get("min_experience_years", 0)

    if req_exp_years <= 0:
        exp_score = 100.0
        exp_summary = "No minimum experience requirement specified."
    elif cand_exp_years >= req_exp_years:
        exp_score = 100.0
        exp_summary = f"Meets experience criteria ({cand_exp_years} yrs estimated vs {req_exp_years} yrs required)."
    else:
        # Partial credit based on percentage of required years
        exp_score = round((cand_exp_years / req_exp_years) * 100.0, 1)
        exp_summary = f"Partial experience ({cand_exp_years} yrs estimated vs {req_exp_years} yrs required)."

    # 4. Final Weighted Composite Score
    overall_score = round(
        (skill_score * WEIGHT_SKILLS) +
        (semantic_score * WEIGHT_SEMANTIC) +
        (exp_score * WEIGHT_EXPERIENCE),
        1
    )

    return {
        "candidate_name": candidate_profile.get("name", "Candidate"),
        "overall_score": overall_score,
        "breakdown": {
            "skill_score": skill_score,
            "semantic_score": semantic_score,
            "experience_score": exp_score,
            "weights_used": {
                "skills": f"{int(WEIGHT_SKILLS * 100)}%",
                "semantic": f"{int(WEIGHT_SEMANTIC * 100)}%",
                "experience": f"{int(WEIGHT_EXPERIENCE * 100)}%"
            }
        },
        "skills_analysis": {
            "matched_required": matched_req,
            "missing_required": missing_req,
            "matched_preferred": matched_pref,
            "missing_preferred": missing_pref,
            "total_candidate_skills": len(candidate_skills)
        },
        "experience_analysis": {
            "estimated_years": cand_exp_years,
            "required_years": req_exp_years,
            "summary": exp_summary
        },
        "semantic_raw_cosine": semantic_res["raw_cosine"]
    }
