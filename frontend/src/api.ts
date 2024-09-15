// src/api.ts
import axios from "axios";
import { Poem, PivotsResponse } from "./types";

const API_URL = "http://localhost:8000/api";  // Base URL for the FastAPI backend

export const getRandomPoem = async (): Promise<Poem> => {
  const response = await axios.get<Poem>(`${API_URL}/poem/random`);
  return response.data;
};

export const getPivots = async (poemId: number): Promise<PivotsResponse> => {
  try {
    const response = await axios.get<PivotsResponse>(`${API_URL}/pivots/${poemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("No pivots found");
    }
    throw error;
  }
};

export const getPoem = async (poemId: number): Promise<Poem> => {
  const response = await axios.get<Poem>(`${API_URL}/poem/${poemId}`);
  return response.data;
};