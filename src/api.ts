// src/api.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";  // Base URL for the FastAPI backend

export const testBackendConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    throw error;
  }
};