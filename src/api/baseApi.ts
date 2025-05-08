import axios from 'axios';

import {ENDPOINT_URL, TENANT} from "../utils/constants";

export const apiPublic = axios.create({
    baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
    headers: {
        'Content-Type': "application/json",
    },
});




const apiTenant = axios.create({
  baseURL: `${ENDPOINT_URL}/tenant/${TENANT}/tenant`,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

apiTenant.interceptors.request.use(
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

export default apiTenant;



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

