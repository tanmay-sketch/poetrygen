// src/api/poem.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Define types for the responses
interface PoemResponse {
  poem: string;
}

interface PoemsResponse {
  poems: string[];
}

export const getPoem = async (): Promise<PoemResponse> => {
  try {
    const response = await axios.get<PoemResponse>(`${API_URL}/poem`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poem:", error);
    throw error;
  }
};

export const getAllPoems = async (): Promise<PoemsResponse> => {
  try {
    const response = await axios.get<PoemsResponse>(`${API_URL}/poems`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poems:", error);
    throw error;
  }
};