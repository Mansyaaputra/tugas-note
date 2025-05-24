export const BASE_URL = "https://notes-backend-mansya-663618957788.us-central1.run.app/";

export const apiConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  // Don't send credentials to work with wildcard CORS
  withCredentials: false
};

export const getAuthHeader = () => ({
  headers: {
    ...apiConfig.headers,
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  },
  withCredentials: false
});
