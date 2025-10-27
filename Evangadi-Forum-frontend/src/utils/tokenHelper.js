// src/utils/tokenHelper.js
export const getToken = () => {
    return localStorage.getItem('auth-token') || localStorage.getItem('token');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('token', token); // Keep both for compatibility
  };
  
  export const removeToken = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('token');
  };