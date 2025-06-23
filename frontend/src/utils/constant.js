// Use a relative URL when in development mode, otherwise use the production URL
const API_BASE_URL = import.meta.env.DEV 
    ? "/api/v1" 
    : "https://job-portal-2-rrsg.onrender.com/api/v1";

export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/company`;