// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/'   // ← 여기에만 옵션 객체 작성
});

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;
