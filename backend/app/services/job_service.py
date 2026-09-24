import re
from typing import Dict, List, Optional
from app.services.cleaner_service import clean_text
from app.services.skill_extractor import extract_skills

# Regex to detect years of experience (e.g., "3+ years", "5-7 years", "at least 4 years")
EXPERIENCE_YEARS_REGEX = r'(?:at least\s+)?(\d+)(?:\s*(?:-|to|\+)\s*\d+)?\s*(?:\+)?\s*years?'

PREFERRED_KEYWORDS = [
    "nice to have", "preferred", "bonus", "plus", "good to have",
    "desired", "optional", "advantages"
]

REQUIRED_KEYWORDS = [
    "requirements", "required", "must have", "qualifications",
    "minimum qualifications", "what you need", "responsibilities"
]


def extract_experience_requirement(text: str) -> Dict[str, any]:
    """
    Extracts the minimum years of experience requested and the context sentences.
    """
    matches = []
    min_years = 0
    
    for sentence in re.split(r'[.\n]', text):
        cleaned_sentence = sentence.strip()
        match = re.search(EXPERIENCE_YEARS_REGEX, cleaned_sentence, re.IGNORECASE)
        if match:
            matches.append(cleaned_sentence)
            years_found = int(match.group(1))
            if years_found > min_years:
                min_years = years_found

    return {
        "min_years": min_years,
        "statements": matches
    }


def analyze_job_description(title: str, description: str) -> dict:
    """
    Analyzes a job description to extract:
    - title
    - required_skills
    - preferred_skills
    - experience_requirements
    - skill categories
    """
    cleaned_desc = clean_text(description)
    full_text = f"{title}\n{cleaned_desc}"

    # 1. Extract all canonical skills from the JD
    extracted_skills_data = extract_skills(full_text)
    all_skills = extracted_skills_data["skills"]

    # 2. Segment text into Required vs Preferred blocks
    lines = cleaned_desc.splitlines()
    required_text = []
    preferred_text = []
    
    current_mode = "required"  # default to required

    for line in lines:
        lower = line.lower()
        if any(kw in lower for kw in PREFERRED_KEYWORDS):
            current_mode = "preferred"
        elif any(kw in lower for kw in REQUIRED_KEYWORDS):
            current_mode = "required"

        if current_mode == "preferred":
            preferred_text.append(line)
        else:
            required_text.append(line)

    # 3. Categorize extracted skills into required vs preferred
    preferred_blob = " ".join(preferred_text)
    preferred_skills_data = extract_skills(preferred_blob)["skills"] if preferred_blob else []

    preferred_set = set(preferred_skills_data)
    required_skills = [s for s in all_skills if s not in preferred_set]
    preferred_skills = [s for s in all_skills if s in preferred_set]

    # If everything got classified as preferred (rare edge case), make all skills required
    if not required_skills and all_skills:
        required_skills = all_skills
        preferred_skills = []

    # 4. Extract experience requirements
    exp_info = extract_experience_requirement(cleaned_desc)

    return {
        "title": title.strip() if title else "Job Position",
        "total_skills_required": len(required_skills),
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "all_skills": all_skills,
        "skill_categories": extracted_skills_data["categories"],
        "min_experience_years": exp_info["min_years"],
        "experience_requirements": exp_info["statements"]
    }
