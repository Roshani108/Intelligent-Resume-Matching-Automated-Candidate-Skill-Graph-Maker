import spacy
from spacy.matcher import PhraseMatcher
from typing import Dict, List, Set

# 1. Load spaCy model with automatic download fallback for cloud deployment
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# 2. Canonical Skill Knowledge Base categorized by domain
SKILL_TAXONOMY = {
    "Languages": [
        "Python", "JavaScript", "TypeScript", "Go", "Java", "C++", "C#", "C",
        "Ruby", "PHP", "SQL", "Rust", "Swift", "Kotlin", "HTML", "CSS", "R"
    ],
    "Frameworks & Libraries": [
        "FastAPI", "Django", "Flask", "React", "Next.js", "Vue", "Angular",
        "Node.js", "Express.js", "Spring Boot", "ASP.NET", "Tailwind CSS",
        "Bootstrap", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy"
    ],
    "Databases": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Elasticsearch",
        "Cassandra", "DynamoDB", "Firebase", "Oracle", "MariaDB"
    ],
    "DevOps & Cloud": [
        "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Git", "GitHub",
        "Linux", "Terraform", "Ansible", "Jenkins", "Nginx", "Apache"
    ],
    "Concepts & Methodologies": [
        "REST APIs", "GraphQL", "Microservices", "Machine Learning", "Deep Learning",
        "Natural Language Processing", "Computer Vision", "Agile", "Scrum", "TDD"
    ]
}

# 3. Controlled Synonyms / Aliases -> Canonical Normalization Map
SKILL_SYNONYMS = {
    # React variations
    "react.js": "React",
    "reactjs": "React",
    "react js": "React",
    # Node variations
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "node js": "Node.js",
    # Express variations
    "express": "Express.js",
    "express.js": "Express.js",
    "expressjs": "Express.js",
    # Vue variations
    "vue.js": "Vue",
    "vuejs": "Vue",
    # Next variations
    "next.js": "Next.js",
    "nextjs": "Next.js",
    # Database variations
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "psql": "PostgreSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "ms sql": "SQL",
    "mysql": "MySQL",
    # Cloud & DevOps variations
    "k8s": "Kubernetes",
    "amazon web services": "AWS",
    "amazon aws": "AWS",
    "google cloud": "GCP",
    "google cloud platform": "GCP",
    "microsoft azure": "Azure",
    "ci / cd": "CI/CD",
    "cicd": "CI/CD",
    "continuous integration": "CI/CD",
    # API variations
    "rest": "REST APIs",
    "rest api": "REST APIs",
    "rest apis": "REST APIs",
    "restful": "REST APIs",
    "restful api": "REST APIs",
    "restful apis": "REST APIs",
    # Machine Learning / AI variations
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "nlp": "Natural Language Processing",
    "sklearn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",
    "fastapi": "FastAPI",
    "fast api": "FastAPI",
    "django": "Django",
    "flask": "Flask",
    "git": "Git",
    "github": "GitHub",
    "docker": "Docker",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS"
}

# Create a reverse index: canonical skill -> category
CANONICAL_TO_CATEGORY: Dict[str, str] = {}
for category, skills in SKILL_TAXONOMY.items():
    for skill in skills:
        CANONICAL_TO_CATEGORY[skill] = category

# Initialize spaCy PhraseMatcher
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

# Build patterns for all canonical skills and their synonyms
pattern_to_canonical: Dict[str, str] = {}

# Add canonical names
for category, skills in SKILL_TAXONOMY.items():
    for skill in skills:
        pattern_to_canonical[skill.lower()] = skill

# Add synonyms
for synonym, canonical in SKILL_SYNONYMS.items():
    pattern_to_canonical[synonym.lower()] = canonical

# Register all patterns into spaCy PhraseMatcher
patterns = [nlp.make_doc(text) for text in pattern_to_canonical.keys()]
matcher.add("SKILLS", patterns)


def extract_skills(text: str) -> dict:
    """
    Extracts and normalizes skills from text using spaCy PhraseMatcher.
    Returns:
    - skills: list of unique canonical skills found
    - categories: dictionary grouping found skills by category
    """
    if not text:
        return {"skills": [], "categories": {}}

    doc = nlp(text)
    matches = matcher(doc)

    extracted_canonical: Set[str] = set()

    for match_id, start, end in matches:
        span = doc[start:end]
        matched_text = span.text.lower()
        if matched_text in pattern_to_canonical:
            canonical_skill = pattern_to_canonical[matched_text]
            extracted_canonical.add(canonical_skill)

    # Sort skills deterministically for consistency
    sorted_skills = sorted(list(extracted_canonical))

    # Group extracted skills by category
    grouped_categories: Dict[str, List[str]] = {}
    for skill in sorted_skills:
        cat = CANONICAL_TO_CATEGORY.get(skill, "Other")
        if cat not in grouped_categories:
            grouped_categories[cat] = []
        grouped_categories[cat].append(skill)

    return {
        "skills": sorted_skills,
        "categories": grouped_categories,
        "total_skills_found": len(sorted_skills)
    }
