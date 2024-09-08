import axios, { AxiosRequestConfig } from "axios";
import AuthToken from "../../src/http/auth-token";

/**
 * API legada do WordPress
 */
export const httpApi = axios.create({
  baseURL: process.env.apiUrl+'/cms',
  /* other custom settings */
});

/**
 * WP Rest API
 */
export const restApi = axios.create({
  baseURL: process.env.apiUrl+'/wp-json',
  /* other custom settings */
});



// Set the AUTH token for any request
httpApi.interceptors.request.use(defaultApiInterceptor);
restApi.interceptors.request.use(defaultApiInterceptor);

function defaultApiInterceptor(config: AxiosRequestConfig){
  const auth = AuthToken.factory();
  const token = AuthToken.getToken();

   config.headers.Authorization =  auth.isValid ? `Bearer ${token}` : '';
  return config;
}

export const httpServiceXYZ = axios.create({
  baseURL: '//www.omdbapi.com',
  /* other custom settings */
});

