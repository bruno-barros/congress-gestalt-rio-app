import axios from "axios";
import AuthToken from "../../src/http/auth-token";

export const httpApi = axios.create({
  baseURL: process.env.apiUrl,
  /* other custom settings */
});

// Set the AUTH token for any request
httpApi.interceptors.request.use(function (config) {
  const auth = AuthToken.factory();
  const token = AuthToken.getToken();
   config.headers.Authorization =  auth.isValid ? `Bearer ${token}` : '';
  return config;
});

export const httpServiceXYZ = axios.create({
  baseURL: '//www.omdbapi.com',
  /* other custom settings */
});

