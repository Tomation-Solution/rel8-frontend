import axios from 'axios';
import { ENDPOINT_URL, TENANT } from "../utils/constants";

// Public auth routes that don't require authentication
const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/setup-new-password",
  "/enter-code",
];

// Helper function to check if current route is public
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route));
};

// Public API instance (no auth required)
export const apiPublic = axios.create({
  baseURL: `${ENDPOINT_URL}/api/`,
  headers: {
    'Content-Type': "application/json",
  },
});

// Tenant API instance (requires auth for protected routes)
const apiTenant = axios.create({
  baseURL: `${ENDPOINT_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - handles 401 errors
apiTenant.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login if:
    // 1. Response is 401 (Unauthorized)
    // 2. Not already on a public auth route
    // 3. Not already on login page
    if (
      error.response && 
      error.response.status === 401 && 
      !isPublicRoute(window.location.pathname)
    ) {
      localStorage.removeItem('rel8User');
      
      // Preserve the intended destination for redirect after login
      const intendedPath = window.location.pathname + window.location.search;
      if (intendedPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', intendedPath);
      }
      
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Request interceptor - adds auth token for protected routes
apiTenant.interceptors.request.use(
  (config) => {
    const currentPath = window.location.pathname;
    
    // Only add auth headers if NOT on a public route
    if (!isPublicRoute(currentPath)) {
      try {
        const user = JSON.parse(localStorage.getItem('rel8User') || "null");
        
        // If a token is available, set the 'Authorization' header
        if (user && user.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
          
          const orgId = user.orgId;
          if (orgId) {
            if (!config.params) {
              config.params = { orgId };
            } else {
              config.params.orgId = orgId;
            }
          }
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('rel8User');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Form data API instance
export const apiTenantAxiosForm = axios.create({
  baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

apiTenantAxiosForm.interceptors.request.use(
  (config) => {
    const currentPath = window.location.pathname;
    
    // Only add auth headers if NOT on a public route
    if (!isPublicRoute(currentPath)) {
      try {
        const userString = localStorage.getItem('rel8User');
        
        if (userString) {
          const user = JSON.parse(userString);
          
          if (user && user.token) {
            config.headers['Authorization'] = `Token ${user.token}`;
          }
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('rel8User');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility function to download files
export const fetchFileForDownload = async (fileUrl: string) => {
  const response = await axios.get(fileUrl, {
    method: 'GET',
    responseType: 'blob'
  });

  return response.data;
};

// Export public routes constant for use in other parts of the app
export { PUBLIC_AUTH_ROUTES, isPublicRoute };

export default apiTenant;