from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Intelligent Resume Matching & Skill Graph API",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }
