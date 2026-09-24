from typing import List, Dict, Set

# Skill Relationship Knowledge Base (Ecosystem dependencies)
SKILL_RELATIONSHIPS = [
    # Python Ecosystem
    {"source": "Python", "target": "FastAPI", "relation": "framework"},
    {"source": "Python", "target": "Django", "relation": "framework"},
    {"source": "Python", "target": "Flask", "relation": "framework"},
    {"source": "Python", "target": "Pandas", "relation": "library"},
    {"source": "Python", "target": "NumPy", "relation": "library"},
    {"source": "Python", "target": "PyTorch", "relation": "library"},
    {"source": "Python", "target": "TensorFlow", "relation": "library"},
    {"source": "Python", "target": "Scikit-Learn", "relation": "library"},
    # JavaScript/TypeScript Ecosystem
    {"source": "JavaScript", "target": "React", "relation": "framework"},
    {"source": "JavaScript", "target": "Node.js", "relation": "runtime"},
    {"source": "JavaScript", "target": "Vue", "relation": "framework"},
    {"source": "JavaScript", "target": "Angular", "relation": "framework"},
    {"source": "TypeScript", "target": "React", "relation": "framework"},
    {"source": "TypeScript", "target": "Next.js", "relation": "framework"},
    {"source": "Node.js", "target": "Express.js", "relation": "framework"},
    # Database Ecosystem
    {"source": "SQL", "target": "PostgreSQL", "relation": "implementation"},
    {"source": "SQL", "target": "MySQL", "relation": "implementation"},
    {"source": "SQL", "target": "SQLite", "relation": "implementation"},
    # DevOps & Cloud Ecosystem
    {"source": "Docker", "target": "Kubernetes", "relation": "orchestration"},
    {"source": "AWS", "target": "Docker", "relation": "deployment"},
    {"source": "GCP", "target": "Kubernetes", "relation": "deployment"},
    {"source": "CI/CD", "target": "Docker", "relation": "automation"},
    {"source": "Git", "target": "GitHub", "relation": "platform"},
    # AI / Concepts
    {"source": "Machine Learning", "target": "Deep Learning", "relation": "specialization"},
    {"source": "Machine Learning", "target": "Natural Language Processing", "relation": "domain"},
    {"source": "REST APIs", "target": "FastAPI", "relation": "implementation"},
    {"source": "REST APIs", "target": "Express.js", "relation": "implementation"}
]


def generate_candidate_skill_graph(
    candidate_skills: List[str],
    required_skills: List[str] = None,
    preferred_skills: List[str] = None
) -> dict:
    """
    Generates a visual Node-Edge graph structure for a candidate,
    highlighting matched, extra, and missing skills.
    """
    cand_set = set(candidate_skills or [])
    req_set = set(required_skills or [])
    pref_set = set(preferred_skills or [])

    all_relevant_skills: Set[str] = cand_set.union(req_set).union(pref_set)

    # 1. Build Nodes
    nodes = []
    for skill in sorted(list(all_relevant_skills)):
        if skill in cand_set and skill in req_set:
            status = "matched_required"  # Green
        elif skill in cand_set and skill in pref_set:
            status = "matched_preferred"  # Light Green / Cyan
        elif skill in cand_set:
            status = "candidate_extra"   # Blue
        elif skill in req_set:
            status = "missing_required"  # Red / Warning
        elif skill in pref_set:
            status = "missing_preferred" # Amber
        else:
            status = "neutral"

        nodes.append({
            "id": skill.lower().replace(" ", "_").replace(".", "_"),
            "label": skill,
            "status": status,
            "in_candidate": skill in cand_set,
            "in_job_required": skill in req_set,
            "in_job_preferred": skill in pref_set
        })

    # 2. Build Edges (only where both skills exist in the graph)
    edges = []
    skill_names = {node["label"] for node in nodes}

    for rel in SKILL_RELATIONSHIPS:
        src = rel["source"]
        tgt = rel["target"]
        if src in skill_names and tgt in skill_names:
            edges.append({
                "source": src.lower().replace(" ", "_").replace(".", "_"),
                "target": tgt.lower().replace(" ", "_").replace(".", "_"),
                "relation": rel["relation"],
                "label": rel["relation"]
            })

    return {
        "nodes": nodes,
        "edges": edges,
        "total_nodes": len(nodes),
        "total_edges": len(edges)
    }
