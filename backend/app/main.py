import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.resumes import router as resumes_router
from app.api.jobs import router as jobs_router
from app.api.match import router as match_router
from app.api.graph import router as graph_router

# 1. Instantiate FastAPI application
app = FastAPI(
    title="Intelligent Resume Matching & Skill Graph API",
    version="1.0.0",
    description="Backend API for parsing resumes, extracting skills, and semantic matching.",
)

# 2. Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Register all API routers
app.include_router(resumes_router)
app.include_router(jobs_router)
app.include_router(match_router)
app.include_router(graph_router)

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }

# 4. Resolve frontend dist directory for single-link fullstack serving
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
frontend_dist_candidates = [
    os.path.abspath(os.path.join(BASE_DIR, "..", "frontend_dist")),
    os.path.abspath(os.path.join(BASE_DIR, "..", "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend_dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend", "dist")),
]

frontend_dist = None
for candidate in frontend_dist_candidates:
    if os.path.exists(candidate) and os.path.isfile(os.path.join(candidate, "index.html")):
        frontend_dist = candidate
        break

if frontend_dist:
    # Mount assets folder
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Mount sample resumes
    sample_resumes_dir = os.path.join(frontend_dist, "sample_resumes")
    if os.path.exists(sample_resumes_dir):
        app.mount("/sample_resumes", StaticFiles(directory=sample_resumes_dir), name="sample_resumes")

    # SPA catch-all handler for root and client routes
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't hijack /api, /docs, /openapi.json or /health
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path in ["openapi.json", "health"]:
            return {"error": "Not Found"}

        requested_file = os.path.join(frontend_dist, full_path)
        if os.path.isfile(requested_file):
            return FileResponse(requested_file)

        index_file = os.path.join(frontend_dist, "index.html")
        return FileResponse(index_file)
else:
    @app.get("/")
    def read_root():
        return {
            "message": "Welcome to Intelligent Resume Matching & Skill Graph API",
            "docs_url": "/docs"
        }
