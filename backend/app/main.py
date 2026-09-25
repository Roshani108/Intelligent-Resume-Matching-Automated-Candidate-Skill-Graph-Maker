import os
import sys
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
    title="meetMux Resume Intelligence API",
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
    return {"status": "ok", "service": "meetMux Resume Intelligence API"}

# 4. Serve frontend static files if built dist exists
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
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    sample_resumes_dir = os.path.join(frontend_dist, "sample_resumes")
    if os.path.exists(sample_resumes_dir):
        app.mount("/sample_resumes", StaticFiles(directory=sample_resumes_dir), name="sample_resumes")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path in ["openapi.json", "health"]:
            return {"error": "Not Found"}
        requested_file = os.path.join(frontend_dist, full_path)
        if os.path.isfile(requested_file):
            return FileResponse(requested_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {
            "message": "meetMux Resume Intelligence API",
            "docs": "/docs",
            "health": "/health"
        }

# 5. Allow running directly: python -m app.main
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
