import axios from "axios";

// Base URL for your API
axios.defaults.baseURL = "http://127.0.0.1:8000/api";

// Request interceptor to attach token
axios.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("token");           // Admin token
    const studentToken = localStorage.getItem("student_token"); // Student token

    // Priority: use student token first, otherwise admin token
    if (studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired/invalid tokens
axios.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn("Token expired or unauthorized, logging out...");

      // Remove both tokens
      localStorage.removeItem("token");
      localStorage.removeItem("student_token");

      // Optional: reload page or redirect
      window.location.reload(); // will reload page to login
    }
    return Promise.reject(error);
  }
);

export default axios;
