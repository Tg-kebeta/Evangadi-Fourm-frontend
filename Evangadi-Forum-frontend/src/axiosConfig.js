// src/axiosConfig.js
import axios from "axios";
import { getToken, removeToken } from "./utils/tokenHelper";

const axiosBase = axios.create({
  // baseURL:"http://localhost:2025",
  // baseURL: "https://forumevangadibackend.natesirak.com",
  // baseURL: "https://evangadiba.solomonhunegnaw.com",
  baseURL:"https://evangadiforum.ekhlasabdulmelik.com/"
});

// Add token to all requests automatically
axiosBase.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration globally
axiosBase.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosBase;
