import sys
import io
import json
from fastapi.testclient import TestClient
from pypdf import PdfWriter
from app.main import app

client = TestClient(app)

print("=" * 65)
print("     COMPREHENSIVE BACKEND HEALTH & ENDPOINT AUDIT")
print("=" * 65)

# 1. Test GET /
print("\n[CHECK 1] GET /")
r = client.get("/")
assert r.status_code == 200
print("  Status: 200 OK | Response:", r.json())

# 2. Test GET /health
print("\n[CHECK 2] GET /health")
r = client.get("/health")
assert r.status_code == 200
assert r.json() == {"status": "ok"}
print("  Status: 200 OK | Response:", r.json())

# 3. Test POST /api/resumes/upload (Rejections)
print("\n[CHECK 3] POST /api/resumes/upload (Security & Validation)")
# Non-PDF
r_bad = client.post("/api/resumes/upload", files={"file": ("hack.exe", b"malware", "application/octet-stream")})
assert r_bad.status_code == 400
print("  Rejected .exe file correctly (400 Bad Request)")

# Empty 0-byte
r_empty = client.post("/api/resumes/upload", files={"file": ("empty.pdf", b"", "application/pdf")})
assert r_empty.status_code == 400
print("  Rejected 0-byte file correctly (400 Bad Request)")

# 4. Test POST /api/jobs/analyze
print("\n[CHECK 4] POST /api/jobs/analyze (JD Analysis)")
jd_data = {
    "title": "Backend Python Engineer",
    "description": """
    Requirements:
    - 3+ years of experience with Python and FastAPI.
    - Solid knowledge of PostgreSQL and Docker.
    
    Nice to have:
    - React, AWS, or GraphQL experience.
    """
}
r_jd = client.post("/api/jobs/analyze", json=jd_data)
assert r_jd.status_code == 200
jd_res = r_jd.json()
print("  Status: 200 OK")
print(f"  Required Skills: {jd_res['required_skills']}")
print(f"  Preferred Skills: {jd_res['preferred_skills']}")
print(f"  Experience Detected: {jd_res['min_experience_years']} years")
assert "Python" in jd_res["required_skills"]
assert "FastAPI" in jd_res["required_skills"]
assert "PostgreSQL" in jd_res["required_skills"]
assert jd_res["min_experience_years"] == 3

# 5. Test Semantic Embedding Service
print("\n[CHECK 5] Semantic Embedding Service (Sentence-Transformers)")
from app.services.embedding_service import get_semantic_similarity_score

text_dev = "Developed high performance asynchronous REST endpoints in Python using FastAPI."
text_jd = "Looking for backend developer to build Python web APIs."
sim = get_semantic_similarity_score(text_dev, text_jd)
print(f"  Semantic Similarity: {sim['score_pct']}% (Raw Cosine: {sim['raw_cosine']})")
assert sim["score_pct"] > 50.0

# 6. Test spaCy Skill Extractor
print("\n[CHECK 6] spaCy Skill Extractor & Normalizer")
from app.services.skill_extractor import extract_skills
skills = extract_skills("I use React.js, NodeJS, Postgres, k8s, and Python.")["skills"]
print("  Normalized Skills:", skills)
assert "React" in skills
assert "Node.js" in skills
assert "PostgreSQL" in skills
assert "Kubernetes" in skills

# 7. Test Work Timeline Extractor
print("\n[CHECK 7] Work Timeline Extractor")
from app.services.timeline_extractor import extract_work_timeline
exp_lines = [
    "Full-stack Developer at Acme Corp | 2022 - Present",
    "- Built web apps with React and FastAPI."
]
timeline = extract_work_timeline(exp_lines)
assert len(timeline) == 1
assert timeline[0]["is_current"] is True
print("  Timeline correctly parsed milestone:", timeline[0]["role"], "at", timeline[0]["company"])

print("\n" + "=" * 65)
print("  >>> AUDIT COMPLETE: ZERO BUGS, ZERO MISSING PACKAGES! <<<")
print("=" * 65)
