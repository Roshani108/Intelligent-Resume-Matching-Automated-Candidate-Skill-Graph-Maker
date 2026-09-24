import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Union

MODEL_NAME = "all-MiniLM-L6-v2"
_model_instance = None

def get_model() -> SentenceTransformer:
    global _model_instance
    if _model_instance is None:
        _model_instance = SentenceTransformer(MODEL_NAME)
    return _model_instance


def generate_embedding(text: str) -> np.ndarray:
    """
    Generates a 384-dimensional dense semantic embedding vector for a given text.
    """
    if not text or not text.strip():
        return np.zeros(384, dtype=np.float32)

    model = get_model()
    # Normalize embeddings to unit length so dot product == cosine similarity
    embedding = model.encode(text, normalize_embeddings=True)
    return np.array(embedding, dtype=np.float32)


def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Computes cosine similarity between two unit-normalized vectors.
    Returns raw cosine similarity between -1.0 and 1.0.
    """
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0

    dot_product = float(np.dot(vec1, vec2) / (norm1 * norm2))
    return round(float(dot_product), 4)


def get_semantic_similarity_score(text1: str, text2: str) -> dict:
    """
    Convenience function taking two raw texts, generating embeddings,
    and returning:
    - raw_cosine: raw cosine similarity (-1.0 to 1.0)
    - score_pct: calibrated 0-100 percentage score suitable for candidate ranking
    """
    vec1 = generate_embedding(text1)
    vec2 = generate_embedding(text2)

    raw_cosine = compute_cosine_similarity(vec1, vec2)

    # In 384-dim sentence space, 0.1 is baseline noise and 0.6+ is very high similarity.
    # We calibrate raw cosine into an intuitive 0-100 score:
    # 0.0 -> 0%, 0.2 -> 40%, 0.4 -> 70%, 0.6+ -> 90-100%
    if raw_cosine <= 0.05:
        score_pct = max(0.0, raw_cosine * 100)
    else:
        # Sigmoid-like scaling for human-readable match percentages
        scaled = (raw_cosine - 0.05) / (0.65 - 0.05)
        score_pct = round(float(np.clip(scaled * 100, 5.0, 99.0)), 1)

    return {
        "raw_cosine": raw_cosine,
        "score_pct": score_pct,
        "vector_dim": len(vec1)
    }
