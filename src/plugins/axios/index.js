// lib/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // from .env
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // only needed if using cookies/sessions
});

export default API;