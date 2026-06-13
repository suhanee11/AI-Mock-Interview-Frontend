import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// ─── ATS ──────────────────────────────────────────────────────
export const checkAts = (resumeFile, jobDescription, sessionId) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);
  if (sessionId) formData.append("sessionId", sessionId);
  return axios.post(`${BASE_URL}/ats/check`, formData);
};

// ─── Interview ────────────────────────────────────────────────
export const generateQuestions = (jobRole) =>
  axios.post(`${BASE_URL}/interview/questions`, { jobRole });

export const generateQuestionsFromResume = (jobRole, resumeFile) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobRole", jobRole);
  return axios.post(`${BASE_URL}/interview/questions-from-resume`, formData);
};

export const getFeedback = (sessionId, jobRole, question, userAnswer, questionNumber, timedOut) =>
  axios.post(`${BASE_URL}/interview/feedback`, {
    sessionId, jobRole, question, userAnswer, questionNumber, timedOut,
  });