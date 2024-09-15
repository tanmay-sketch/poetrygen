import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn UI button
import axios from "axios";

// Define Poem interface
interface Poem {
  id: number;
  name: string;
  poem: string;
}

// Define Pivot interface
interface PivotData {
  next_poem_id: number;
  pivot_lines: number[];
}

// Fetch random poem from the backend API
const getRandomPoem = async (): Promise<Poem> => {
  try {
    const response = await axios.get<Poem>("http://localhost:8000/api/poem/random");
    return response.data;
  } catch (error) {
    console.error("Error fetching random poem:", error);
    throw error;
  }
};

// Fetch pivots for a given poem from the backend API
const getPivots = async (poemId: number): Promise<PivotData> => {
  try {
    const response = await axios.get<PivotData>(`http://localhost:8000/api/pivots/${poemId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pivots:", error);
    throw error;
  }
};

// Helper function to parse and display the poem line by line, including clickable pivot lines
const parsePoem = (
  poem: string,
  pivots: number[],
  onPivotClick: (pivotLine: number) => void
) => {
  return poem.split("\n").map((line: string, index: number) => (
    <p
      key={index}
      className={pivots.includes(index) ? "cursor-pointer text-blue-500" : ""}
      onClick={() => pivots.includes(index) && onPivotClick(index)}
    >
      {line}
    </p>
  ));
};

const GeneratePage = () => {
    const [poem, setPoem] = useState<Poem | null>(null);
    const [pivots, setPivots] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animate, setAnimate] = useState(false);
  
    const handleGeneratePoem = async () => {
      setAnimate(true);
      setLoading(true);
      setError(null);
      
      try {
        const poemData = await getRandomPoem();
        const pivotData = await getPivots(poemData.id);
        
        setTimeout(() => {
          setPoem(poemData);
          setPivots(pivotData.pivot_lines);
          setAnimate(false);
        }, 300);
      } catch (error) {
        setError("Failed to fetch poem. Please try again.");
        setAnimate(false);
      } finally {
        setLoading(false);
      }
    };
  
    const handlePivotClick = async (pivotLine: number) => {
      if (!poem) return;
      setAnimate(true);
      
      try {
        const nextPoem = await getRandomPoem();
        const remainingLines = nextPoem.poem.split("\n").slice(pivotLine);
        
        setTimeout(() => {
          setPoem((prevPoem) => {
            if (prevPoem) {
              return {
                ...prevPoem,
                name: nextPoem.name,
                poem: [...prevPoem.poem.split("\n").slice(0, pivotLine + 1), ...remainingLines].join("\n"),
              };
            }
            return null;
          });
          setAnimate(false);
        }, 300);
      } catch (error) {
        console.error("Failed to load the next poem", error);
        setAnimate(false);
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Poem Generator</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p>Loading...</p>}
        
        <div className={`mt-4 transition-all duration-300 ease-in-out ${
          animate ? 'opacity-0 blur-lg scale-95' : 'opacity-100 blur-0 scale-100'
        }`}>
          {poem && (
            <>
              <h2 className="text-2xl font-bold mb-2">{poem.name}</h2>
              <div className="text-lg">
                {parsePoem(poem.poem, pivots, handlePivotClick)}
              </div>
            </>
          )}
        </div>
        
        <Button className="mt-6" onClick={handleGeneratePoem} disabled={loading}>
          {loading ? "Generating..." : "Generate Poem"}
        </Button>
      </div>
    );
  };
  
  export default GeneratePage;