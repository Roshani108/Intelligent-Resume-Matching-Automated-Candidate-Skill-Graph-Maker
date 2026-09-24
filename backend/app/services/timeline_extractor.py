import re
from typing import List, Dict, Optional

# Regex pattern to match various date ranges:
# e.g., "2021 - 2023", "Jan 2020 - Present", "05/2019 - 11/2021", "2022 – Current"
MONTHS = r'(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'
YEAR = r'(?:19|20)\d{2}'
PRESENT = r'(?:Present|Current|Now|Ongoing)'

DATE_RANGE_REGEX = rf'(?:({MONTHS}\s+)?({YEAR})|(\d{{1,2}}/\d{{4}}))\s*(?:–|-|to)\s*(?:({MONTHS}\s+)?({YEAR})|(\d{{1,2}}/\d{{4}})|({PRESENT}))'

COMMON_ROLE_KEYWORDS = [
    "developer", "engineer", "architect", "lead", "manager", "consultant",
    "specialist", "intern", "associate", "analyst", "administrator", "scientist"
]


def extract_date_range(line: str) -> Optional[Dict[str, str]]:
    """
    Finds a date range in a string (e.g. 'Jan 2022 - Present').
    """
    match = re.search(DATE_RANGE_REGEX, line, re.IGNORECASE)
    if not match:
        # Fallback: simple year range like '2021 - 2024'
        simple_match = re.search(r'((?:19|20)\d{2})\s*(?:–|-|to)\s*((?:19|20)\d{2}|Present|Current)', line, re.IGNORECASE)
        if simple_match:
            return {
                "raw": simple_match.group(0),
                "start": simple_match.group(1),
                "end": simple_match.group(2)
            }
        return None

    raw_match = match.group(0).strip()
    parts = re.split(r'\s*(?:–|-|to)\s*', raw_match, flags=re.IGNORECASE)
    start_str = parts[0].strip() if len(parts) > 0 else ""
    end_str = parts[1].strip() if len(parts) > 1 else "Present"

    return {
        "raw": raw_match,
        "start": start_str,
        "end": end_str
    }


def parse_role_and_company(line: str, date_raw: str = "") -> Dict[str, str]:
    """
    Splits a header line into role and company.
    Example: 'Senior Software Engineer at ABC Tech | 2022 - Present'
             'ABC Tech - Full-stack Developer'
    """
    # Remove the date portion from the text
    cleaned_line = line
    if date_raw:
        cleaned_line = cleaned_line.replace(date_raw, "")
    
    cleaned_line = cleaned_line.strip(" |-•\t\n")

    # If format contains ' at ' (e.g., 'Backend Engineer at Google')
    if " at " in cleaned_line:
        parts = cleaned_line.split(" at ", 1)
        return {"role": parts[0].strip(), "company": parts[1].strip()}

    # If format contains ' - ' (e.g., 'Google - Backend Engineer' or vice-versa)
    if " - " in cleaned_line:
        parts = cleaned_line.split(" - ", 1)
        p1, p2 = parts[0].strip(), parts[1].strip()
        # Heuristic: whichever has role keyword is the role
        if any(kw in p1.lower() for kw in COMMON_ROLE_KEYWORDS):
            return {"role": p1, "company": p2}
        else:
            return {"role": p2, "company": p1}

    # If format contains ' | '
    if "|" in cleaned_line:
        parts = cleaned_line.split("|", 1)
        return {"role": parts[0].strip(), "company": parts[1].strip()}

    # Default fallback
    return {"role": cleaned_line, "company": "Company"}


def extract_work_timeline(experience_lines: List[str]) -> List[dict]:
    """
    Takes the extracted experience lines and parses them into structured timeline items.
    """
    timeline: List[dict] = []
    current_entry: Optional[dict] = None

    for line in experience_lines:
        stripped = line.strip()
        if not stripped:
            continue

        date_info = extract_date_range(stripped)

        if date_info:
            # We found a new job milestone!
            if current_entry:
                timeline.append(current_entry)

            role_comp = parse_role_and_company(stripped, date_info["raw"])
            is_current = bool(re.search(r'present|current|now', date_info["end"], re.IGNORECASE))

            current_entry = {
                "role": role_comp["role"],
                "company": role_comp["company"],
                "start_date": date_info["start"],
                "end_date": date_info["end"],
                "is_current": is_current,
                "description": []
            }
        else:
            # It's a bullet point or description line for the current job
            if current_entry:
                clean_bullet = stripped.lstrip("-•* ").strip()
                if clean_bullet:
                    current_entry["description"].append(clean_bullet)
            else:
                # If no date was detected yet, treat this as a potential initial role header
                if any(kw in stripped.lower() for kw in COMMON_ROLE_KEYWORDS):
                    current_entry = {
                        "role": stripped,
                        "company": "Company",
                        "start_date": "N/A",
                        "end_date": "N/A",
                        "is_current": False,
                        "description": []
                    }

    if current_entry:
        timeline.append(current_entry)

    # Convert descriptions from list of lines into a unified string
    for item in timeline:
        item["description"] = " ".join(item["description"])

    return timeline
