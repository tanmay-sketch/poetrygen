// src/api/index.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Define the testBackendConnection function
export const testBackendConnection = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.get<{ message: string }>(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    throw error;
  }
};