from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.graph_service import generate_candidate_skill_graph

router = APIRouter(prefix="/api/graph", tags=["Skill Graph"])


class GraphRequest(BaseModel):
    candidate_skills: List[str]
    required_skills: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []


@router.post("/candidate")
def get_candidate_skill_graph(request: GraphRequest):
    """
    Returns a Node/Edge graph for visual representation of a candidate's skills,
    ecosystem relationships, and comparison against job requirements.
    """
    graph = generate_candidate_skill_graph(
        candidate_skills=request.candidate_skills,
        required_skills=request.required_skills,
        preferred_skills=request.preferred_skills
    )
    return graph
