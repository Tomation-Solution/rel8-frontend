import axios from "axios";
import { ENDPOINT_URL, TENANT } from "../utils/constants";

// Public API instance (no auth required)
export const apiPublic = axios.create({
  baseURL: `${ENDPOINT_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Main API instance with JSON content type
const apiTenant = axios.create({
  baseURL: `${ENDPOINT_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for main API instance
apiTenant.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Optional: Redirect to login if no token found
      // window.location.href = '/login';
      console.warn("No authentication token found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/errors
apiTenant.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (token expired/invalid)
      localStorage.removeItem("token");
      // window.location.href = '/login';
      console.error("Session expired, please login again");
    }
    return Promise.reject(error);
  }
);

// API instance for form data submissions
export const apiTenantAxiosForm = axios.create({
  baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// Request interceptor for form API instance
apiTenantAxiosForm.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for form API instance
apiTenantAxiosForm.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      console.error("Form submission failed: Session expired");
    }
    return Promise.reject(error);
  }
);

export default apiTenant;
