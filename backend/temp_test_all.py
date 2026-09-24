import io
import json
from fastapi.testclient import TestClient
from pypdf import PdfWriter
from app.main import app

# Initialize test client
client = TestClient(app)

def run_all_checks():
    print("=" * 60)
    print("     INTELLIGENT RESUME MATCHER - ENDPOINT VERIFICATION")
    print("=" * 60)

    # ----------------------------------------------------
    # TEST 1: GET / (Root Endpoint)
    # ----------------------------------------------------
    print("\n[TEST 1] Testing Root Endpoint (GET /)...")
    res_root = client.get("/")
    assert res_root.status_code == 200, f"Expected 200, got {res_root.status_code}"
    print(f"  --> Status: {res_root.status_code} OK")
    print(f"  --> Response: {res_root.json()}")

    # ----------------------------------------------------
    # TEST 2: GET /health (Health Check)
    # ----------------------------------------------------
    print("\n[TEST 2] Testing Health Check (GET /health)...")
    res_health = client.get("/health")
    assert res_health.status_code == 200, f"Expected 200, got {res_health.status_code}"
    assert res_health.json() == {"status": "ok"}, "Health status mismatch"
    print(f"  --> Status: {res_health.status_code} OK")
    print(f"  --> Response: {res_health.json()}")

    # ----------------------------------------------------
    # TEST 3: POST /api/resumes/upload - Validation Rejections
    # ----------------------------------------------------
    print("\n[TEST 3] Testing File Validation Rejections...")
    
    # Non-PDF rejection
    res_txt = client.post(
        "/api/resumes/upload",
        files={"file": ("notes.txt", b"plain text", "text/plain")}
    )
    assert res_txt.status_code == 400, f"Expected 400 for txt, got {res_txt.status_code}"
    print(f"  --> Non-PDF rejected with 400 Bad Request: {res_txt.json()['detail']}")

    # Empty file rejection
    res_empty = client.post(
        "/api/resumes/upload",
        files={"file": ("empty.pdf", b"", "application/pdf")}
    )
    assert res_empty.status_code == 400, f"Expected 400 for empty, got {res_empty.status_code}"
    print(f"  --> Empty PDF rejected with 400 Bad Request: {res_empty.json()['detail']}")

    # ----------------------------------------------------
    # TEST 4: Direct Pipeline End-to-End Test (Cleaner, Skills, Timeline)
    # ----------------------------------------------------
    print("\n[TEST 4] Testing Full Resume Parsing Pipeline...")

    sample_resume_text = """
    Sarah Connor
    sarah.connor@cyberdyne.io | +1 (555) 987-6543 | Los Angeles, CA

    Professional Experience
    Lead Software Engineer at Tech Corp | 2022 - Present
    - Architected high-throughput REST APIs using Python, FastAPI, and PostgreSQL.
    - Containerized microservices using Docker and orchestrated via Kubernetes (k8s).
    - Built reactive frontend dashboards using react.js and TypeScript.

    Backend Developer at Startup Labs | Jan 2020 - Dec 2021
    - Developed backend systems with NodeJS and MongoDB.
    - Automated deployment pipelines on AWS with CI/CD.

    Education
    Bachelor of Science in Computer Science - University of California, 2019

    Skills
    Python, FastAPI, react.js, NodeJS, Postgres, Docker, Kubernetes, AWS, SQL
    """

    from app.services.cleaner_service import clean_text
    from app.services.info_extractor import extract_candidate_profile

    # 1. Clean
    cleaned = clean_text(sample_resume_text)
    assert "Sarah Connor" in cleaned

    # 2. Extract Full Profile
    profile = extract_candidate_profile(cleaned)

    print("\n  [SUCCESS] Extracted Profile Summary:")
    print(f"  - Name:             {profile['name']}")
    print(f"  - Email:            {profile['email']}")
    print(f"  - Phone:            {profile['phone']}")
    print(f"  - Total Skills:     {profile['total_skills']}")
    print(f"  - Canonical Skills: {profile['skills']}")
    print(f"  - Total Jobs:       {profile['total_roles']}")

    print("\n  [SUCCESS] Work Timeline Milestones:")
    for idx, role in enumerate(profile["timeline"], 1):
        status_label = "CURRENT" if role["is_current"] else "PAST"
        print(f"    {idx}. {role['role']} at {role['company']} ({role['start_date']} -> {role['end_date']}) [{status_label}]")

    # Assertions on pipeline accuracy
    assert profile["name"] == "Sarah Connor", f"Name failed: {profile['name']}"
    assert profile["email"] == "sarah.connor@cyberdyne.io", f"Email failed: {profile['email']}"
    assert profile["phone"] == "+1 (555) 987-6543", f"Phone failed: {profile['phone']}"
    assert "FastAPI" in profile["skills"], "FastAPI missing"
    assert "React" in profile["skills"], "React normalization failed"
    assert "PostgreSQL" in profile["skills"], "Postgres normalization failed"
    assert "Node.js" in profile["skills"], "NodeJS normalization failed"
    assert profile["total_roles"] == 2, f"Expected 2 timeline roles, got {profile['total_roles']}"

    print("\n" + "=" * 60)
    print("  >>> ALL CHECKS PASSED WITH 100% SUCCESS! <<<")
    print("=" * 60)

if __name__ == "__main__":
    run_all_checks()
