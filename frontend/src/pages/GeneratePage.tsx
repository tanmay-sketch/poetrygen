import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
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
        className={`text-center ${
          pivots.includes(index)
            ? "cursor-pointer text-verseform-purple hover:text-verseform-blue transition-colors duration-200"
            : "text-gray-800"
        }`}
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
  
    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => setAnimate(false), 300);
        return () => clearTimeout(timer);
      }
    }, [animate]);
  
    const handleGeneratePoem = async () => {
      setAnimate(true);
      setLoading(true);
      setError(null);
      setPoem(null);
      
      try {
        const poemData = await getRandomPoem();
        const pivotData = await getPivots(poemData.id);
        
        setPoem(poemData);
        setPivots(pivotData.pivot_lines);
      } catch (error) {
        setError("Failed to fetch poem. Please try again.");
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
      } catch (error) {
        console.error("Failed to load the next poem", error);
      }
    };
  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
          <div className="max-w-2xl w-full text-center">
            {!poem && !loading && (
              <div className="mb-6">
                <div className="inline-block bg-verseform-purple bg-opacity-10 rounded-full p-4">
                  <BookOpen className="w-12 h-12 text-verseform-purple" />
                </div>
              </div>
            )}
            
            <h1 className="text-6xl font-bold mb-6 text-verseform-purple">Verseform</h1>
            
            {!poem && !loading && (
              <p className="text-xl text-gray-700 mb-8">
                Explore AI-matched poetry that evolves with every read. 
                Click on highlighted verses to shape the poem's journey.
              </p>
            )}
            
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading && <p className="text-gray-600 mb-4 text-center">Finding your perfect poem match...</p>}
            
            {!poem && !loading && (
              <Button 
                onClick={handleGeneratePoem} 
                className="bg-verseform-purple hover:bg-verseform-blue text-white transition-colors duration-200 text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg"
              >
                Find Poem
              </Button>
            )}
            
            {poem && (
              <div className={`transition-all duration-200 ease-in-out ${
                animate ? 'opacity-0 blur-sm scale-98' : 'opacity-100 blur-0 scale-100'
              }`}>
                <h2 className="text-3xl font-semibold mb-6 text-center text-verseform-blue">{poem.name}</h2>
                <div className="text-xl space-y-3 mb-8 px-4">
                  {parsePoem(poem.poem, pivots, handlePivotClick)}
                </div>
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={handleGeneratePoem} 
                    className="bg-verseform-purple hover:bg-verseform-blue text-white transition-colors duration-200 text-lg px-6 py-2 rounded-full"
                  >
                    Find New Poem
                  </Button>
                </div>
                <p className="mt-6 text-gray-600 text-center text-sm">
                  Click on the highlighted lines to explore new paths in the poem.
                </p>
              </div>
            )}
          </div>
        </div>
      );
  };
  
  export default GeneratePage;