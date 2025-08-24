// Use a relative URL when in development mode, otherwise use the production URL
const API_BASE_URL = import.meta.env.DEV 
    ? "/api/v1" 
    : "https://job-portal-2-rrsg.onrender.com/api/v1";

// CORS proxy fallback if backend CORS still doesn't work
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const API_BASE_URL_WITH_PROXY = CORS_PROXY + "https://job-portal-2-rrsg.onrender.com/api/v1";

// Use proxy only if needed - uncomment the line below if CORS still fails
// const API_BASE_URL = import.meta.env.DEV ? "/api/v1" : API_BASE_URL_WITH_PROXY;

export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/company`;