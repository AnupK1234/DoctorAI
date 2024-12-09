import axios from "axios";
import { API_URL } from "../constants/keys";
import Cookie from "js-cookie"

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Read the token from the cookie
  const token = Cookie.get("token");
  
  if (token) {
    // Modify the request body to include the token
    config.data = {
      ...(config.data || {}), // Keep existing request body data
      token, // Add token to the body
    };
  }

  return config;
}, (error) => {
  // Handle the error
  return Promise.reject(error);
});

export default axiosInstance;
