import re
import spacy
from typing import Dict, List, Optional
from app.services.skill_extractor import nlp, extract_skills
from app.services.timeline_extractor import extract_work_timeline

# Regex for standard email formats
EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'

# Regex for phone numbers (supports +1, (555) 000-0000, 555-000-0000, etc.)
PHONE_REGEX = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'

# Common Section Headers
SECTION_HEADERS = {
    "experience": [
        "work experience", "professional experience", "experience",
        "employment history", "work history", "career history"
    ],
    "education": [
        "education", "educational background", "academic qualifications",
        "academic background", "degrees"
    ],
    "projects": [
        "projects", "academic projects", "key projects", "personal projects"
    ],
    "skills": [
        "skills", "technical skills", "core competencies", "technologies"
    ]
}


def extract_email(text: str) -> Optional[str]:
    """Finds the first valid email address in the text."""
    matches = re.findall(EMAIL_REGEX, text)
    return matches[0].strip() if matches else None


def extract_phone(text: str) -> Optional[str]:
    """Finds the first valid phone number in the text."""
    matches = re.findall(PHONE_REGEX, text)
    return matches[0].strip() if matches else None


def extract_name(text: str) -> str:
    """
    Extracts the candidate's name using spaCy NER + fallback heuristic.
    """
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    first_few_lines = lines[:6] if len(lines) >= 6 else lines

    header_chunk = "\n".join(first_few_lines)
    doc = nlp(header_chunk)
    
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            cleaned_name = ent.text.strip().replace("\n", " ")
            if not re.search(r'[@\d]', cleaned_name) and len(cleaned_name.split()) <= 4:
                return cleaned_name

    for line in first_few_lines:
        lower_line = line.lower()
        if any(h in lower_line for sublist in SECTION_HEADERS.values() for h in sublist):
            continue
        if re.search(r'[@\d]', line):
            continue
        words = line.split()
        if 1 <= len(words) <= 4:
            return line

    return "Candidate"


def split_into_sections(text: str) -> Dict[str, List[str]]:
    """
    Splits resume into logical sections: experience, education, projects, skills.
    """
    lines = text.splitlines()
    sections: Dict[str, List[str]] = {
        "experience": [],
        "education": [],
        "projects": [],
        "other": []
    }
    
    current_section = "other"

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        lower = stripped.lower().strip(": -#")
        matched_section = None
        for sec, keywords in SECTION_HEADERS.items():
            if lower in keywords:
                matched_section = sec
                break

        if matched_section:
            current_section = matched_section
        else:
            if current_section in sections:
                sections[current_section].append(stripped)
            else:
                sections["other"].append(stripped)

    return sections


def extract_candidate_profile(text: str) -> dict:
    """
    Full extraction pipeline returning the structured candidate profile
    including parsed work timeline.
    """
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    skills_data = extract_skills(text)
    sections = split_into_sections(text)

    # Extract structured work timeline
    raw_exp_lines = sections.get("experience", [])
    timeline = extract_work_timeline(raw_exp_lines)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills_data["skills"],
        "skill_categories": skills_data["categories"],
        "total_skills": skills_data["total_skills_found"],
        "timeline": timeline,
        "total_roles": len(timeline),
        "education": sections.get("education", []),
        "projects": sections.get("projects", []),
        "raw_experience_lines": raw_exp_lines
    }
