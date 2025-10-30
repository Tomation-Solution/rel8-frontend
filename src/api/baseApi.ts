import axios from 'axios';

import {ENDPOINT_URL, TENANT} from "../utils/constants";

export const apiPublic = axios.create({
    // baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
    baseURL: `${ENDPOINT_URL}/api/`,
    headers: {
        'Content-Type': "application/json",
    },
});




const apiTenant = axios.create({
  // baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
  baseURL: `${ENDPOINT_URL}/`,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});


apiTenant.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401 && !window.location.href.includes('login')) {
      localStorage.removeItem('rel8User');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


apiTenant.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const user = JSON.parse(localStorage.getItem('rel8User') || "null");
    console.log(user)
    // If a token is available, set the 'Authorization' header
    if (user) {
      config.headers['Authorization'] = `Bearer ${user['token']}`;
      const orgId = user['orgId']
      if (orgId && !config.params) {
        config.params = { orgId };
      } else if (orgId && config.params) {
        config.params.orgId = orgId;
      }
    }


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);







export const apiTenantAxiosForm = axios.create({
  baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

apiTenantAxiosForm.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const user = localStorage.getItem('rel8User');
    
    // If a token is available, set the 'Authorization' header
    if (user) {
      config.headers['Authorization'] = `Token ${JSON.parse(user)['token']}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchFileForDownload = async (fileUrl: string) => {
    const response = await axios.get(fileUrl, {
        method: 'GET',
        responseType: 'blob'
    });

    return response.data;
}


export default apiTenant;
