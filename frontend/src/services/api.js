import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health', { timeout: 3000 });
    return response.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};

/**
 * Analyze Job Description
 */
export const analyzeJobDescription = async (title, description) => {
  const response = await apiClient.post('/api/jobs/analyze', {
    title: title || 'Software Engineer',
    description: description,
  });
  return response.data;
};

/**
 * Upload single resume
 */
export const uploadSingleResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Match and rank multiple resumes against a Job Description
 */
export const matchResumes = async (jobTitle, jobDescription, files) => {
  const formData = new FormData();
  formData.append('job_title', jobTitle || 'Software Engineer');
  formData.append('job_description', jobDescription);

  for (let i = 0; i < files.length; i++) {
    formData.append('resumes', files[i]);
  }

  const response = await apiClient.post('/api/match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Fetch candidate skill graph
 */
export const getCandidateSkillGraph = async (candidateSkills, requiredSkills, preferredSkills) => {
  const response = await apiClient.post('/api/graph/candidate', {
    candidate_skills: candidateSkills || [],
    required_skills: requiredSkills || [],
    preferred_skills: preferredSkills || [],
  });
  return response.data;
};

/**
 * Fetch bundled sample resumes for 1-click test drive
 */
export const fetchSampleResumes = async () => {
  const sampleList = [
    { name: "Sarah_Connor_Senior_Backend.pdf", path: "/sample_resumes/Sarah_Connor_Senior_Backend.pdf" },
    { name: "John_Smith_Frontend_Dev.pdf", path: "/sample_resumes/John_Smith_Frontend_Dev.pdf" },
    { name: "Gordon_Ramsay_Executive_Chef.pdf", path: "/sample_resumes/Gordon_Ramsay_Executive_Chef.pdf" },
  ];

  const loadedFiles = [];
  for (const item of sampleList) {
    try {
      const res = await fetch(item.path);
      if (!res.ok) continue;
      const blob = await res.blob();
      const file = new File([blob], item.name, { type: "application/pdf" });
      loadedFiles.push(file);
    } catch (e) {
      console.warn("Could not load sample resume:", item.name, e);
    }
  }
  return loadedFiles;
};

export default apiClient;
