// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://favorite-movies-kia6.onrender.com/api/",
  withCredentials: true,
});

export default api;
