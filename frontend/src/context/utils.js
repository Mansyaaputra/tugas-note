export const BASE_URL = "https://notes-backend-mansya-663618957788.us-central1.run.app";

export const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json"
  }
});
