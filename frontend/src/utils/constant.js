const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:8000/api/v1"
  : "https://job-portal-hle1.onrender.com/api/v1";

export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/company`;
