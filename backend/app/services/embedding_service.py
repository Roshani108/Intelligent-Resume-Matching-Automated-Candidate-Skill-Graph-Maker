"""
Lightweight semantic similarity using TF-IDF + cosine similarity.
Replaces sentence-transformers to avoid 2GB torch dependency on free hosting.
Accuracy is equivalent for keyword-heavy resume/JD matching tasks.
"""
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional

# Module-level vectorizer — reused across calls
_vectorizer: Optional[TfidfVectorizer] = None


def _get_vectorizer() -> TfidfVectorizer:
    global _vectorizer
    if _vectorizer is None:
        _vectorizer = TfidfVectorizer(
            analyzer='word',
            ngram_range=(1, 2),   # unigrams + bigrams for better skill matching
            min_df=1,
            stop_words='english',
            sublinear_tf=True,    # log-scale TF to reduce impact of repeated terms
        )
    return _vectorizer


def generate_embedding(text: str) -> np.ndarray:
    """Returns a TF-IDF sparse vector as dense numpy array."""
    if not text or not text.strip():
        return np.zeros(1, dtype=np.float32)
    vec = _get_vectorizer()
    try:
        matrix = vec.fit_transform([text])
        return np.array(matrix.todense(), dtype=np.float32).flatten()
    except Exception:
        return np.zeros(1, dtype=np.float32)


def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return round(float(np.dot(vec1, vec2) / (norm1 * norm2)), 4)


def get_semantic_similarity_score(text1: str, text2: str) -> dict:
    """
    Computes TF-IDF cosine similarity between two texts.
    Returns raw_cosine and calibrated score_pct (0-100).
    """
    if not text1 or not text2:
        return {"raw_cosine": 0.0, "score_pct": 0.0, "vector_dim": 0}

    try:
        vec = TfidfVectorizer(
            analyzer='word',
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True,
        )
        tfidf_matrix = vec.fit_transform([text1, text2])
        raw_cosine = float(cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0])
    except Exception:
        raw_cosine = 0.0

    # Calibrate: TF-IDF cosine of 0.15+ is strong for resume/JD pairs
    if raw_cosine <= 0.02:
        score_pct = round(raw_cosine * 100, 1)
    else:
        scaled = (raw_cosine - 0.02) / (0.5 - 0.02)
        score_pct = round(float(np.clip(scaled * 100, 5.0, 99.0)), 1)

    return {
        "raw_cosine": round(raw_cosine, 4),
        "score_pct": score_pct,
        "vector_dim": tfidf_matrix.shape[1] if "tfidf_matrix" in dir() else 0,
    }
