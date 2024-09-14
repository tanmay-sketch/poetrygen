// src/api/poem.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Define types for the responses
interface Poem {
  id: number;
  name: string;
  poem: string;
}

// Fetch a specific poem by ID
export const getPoem = async (id: number): Promise<Poem> => {
  try {
    const response = await axios.get<Poem>(`${API_URL}/poem/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching poem with ID ${id}:`, error);
    throw error;
  }
};

// Fetch all poems
export const getAllPoems = async (): Promise<Poem[]> => {
  try {
    const response = await axios.get<Poem[]>(`${API_URL}/poems`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poems:", error);
    throw error;
  }
};