import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from 'framer-motion';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Define Poem interface
interface Poem {
  id: number;
  name: string;
  poem: string;
}

// Define Pivot interface
interface Pivot {
  nextPoemId: number;
  nextLineStart: number;
}

interface PivotsResponse {
  [lineNumber: string]: Pivot[];
}

const MAX_PIVOTS_PER_LINE = 3;
const MAX_TOTAL_PIVOTS = 10;

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

const processPivots = (pivots: PivotsResponse): PivotsResponse => {
  let totalPivots = 0;
  const processedPivots: PivotsResponse = {};

  Object.entries(pivots).forEach(([lineNumber, linePivots]) => {
    if (linePivots.length > MAX_PIVOTS_PER_LINE) {
      processedPivots[lineNumber] = linePivots
        .sort(() => 0.5 - Math.random())
        .slice(0, MAX_PIVOTS_PER_LINE);
    } else {
      processedPivots[lineNumber] = linePivots;
    }
    totalPivots += processedPivots[lineNumber].length;
  });

  if (totalPivots > MAX_TOTAL_PIVOTS) {
    const lineNumbers = Object.keys(processedPivots);
    while (totalPivots > MAX_TOTAL_PIVOTS) {
      const randomLineIndex = Math.floor(Math.random() * lineNumbers.length);
      const randomLine = lineNumbers[randomLineIndex];
      if (processedPivots[randomLine].length > 0) {
        processedPivots[randomLine].pop();
        totalPivots--;
      }
      if (processedPivots[randomLine].length === 0) {
        delete processedPivots[randomLine];
        lineNumbers.splice(randomLineIndex, 1);
      }
    }
  }

  return processedPivots;
};

// Fetch pivots for a given poem from the backend API
const getPivots = async (poemId: number): Promise<PivotsResponse> => {
  try {
    const response = await axios.get<PivotsResponse>(`http://localhost:8000/api/pivots/${poemId}`);
    return processPivots(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`No pivots found for poem ${poemId}`);
      return {}; // Return an empty object if no pivots are found
    }
    console.error("Error fetching pivots:", error);
    throw error;
  }
};

const parsePoem = (displayedLines, pivots, onPivotClick) => {
  return (
    <AnimatePresence initial={false}>
      {displayedLines.map((line, index) => (
        <motion.p
          key={line.key}
          className={`text-center ${
            pivots[index.toString()] && !line.isOld && !line.isRemoving
              ? "cursor-pointer text-verseform-purple hover:text-verseform-blue transition-colors duration-200"
              : "text-gray-800"
          }`}
          onClick={() =>
            !line.isOld &&
            !line.isRemoving &&
            pivots[index.toString()] &&
            onPivotClick(index)
          }
          initial={line.isOld ? {} : { opacity: 0, y: 10 }}
          animate={
            line.isOld
              ? {
                  opacity: 0, // Fix this=
                  scale: 0.95,
                  filter: "blur(4px)",
                  position: "absolute",
                  top: "40%",
                  height: "50%",

                }
              : { opacity: 1, y: 0 }
          }
          exit={
            line.isRemoving
              ? {
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                  filter: "blur(4px)",
                  transition: { duration: 0.5 },
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          {line.text}
        </motion.p>
      ))}
    </AnimatePresence>
  );
};



const GeneratePage = () => {
  const [displayedLines, setDisplayedLines] = useState<
  { text: string; key: string; isOld: boolean }[]
>([]);

  const [poem, setPoem] = useState<Poem | null>(null);
  const [pivots, setPivots] = useState<PivotsResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poemHistory, setPoemHistory] = useState<Poem[]>([]);

  // Remove the animate state and related useEffect
  const handleGeneratePoem = async () => {
    setLoading(true);
    setError(null);
    setPoem(null);
    setPoemHistory([]);
  
    try {
      const poemData = await getRandomPoem();
      const pivotData = await getPivots(poemData.id);
  
      setPoem(poemData);
      setPivots(pivotData);
      setPoemHistory([poemData]);
  
      // Set displayedLines with new poem lines
      const newLines = poemData.poem.split("\n").map((line, index) => ({
        text: line,
        key: `${poemData.id}-${index}`,
        isOld: false,
      }));
      setDisplayedLines(newLines);
    } catch (error) {
      setError("Failed to fetch poem. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handlePivotClick = async (pivotLine: number) => {
    if (!poem || !pivots[pivotLine.toString()]) return;
  
    const possiblePivots = pivots[pivotLine.toString()];
    const randomPivot =
      possiblePivots[Math.floor(Math.random() * possiblePivots.length)];
  
    try {
      const nextPoem = await axios.get<Poem>(
        `http://localhost:8000/api/poem/${randomPivot.nextPoemId}`
      );
      const remainingLines = nextPoem.data.poem
        .split("\n")
        .slice(randomPivot.nextLineStart);
  
      const newPoem = {
        ...nextPoem.data,
        poem: [
          ...poem.poem.split("\n").slice(0, pivotLine + 1),
          ...remainingLines,
        ].join("\n"),
      };
  
      setPoem(newPoem);
      setPoemHistory((prevHistory) => [...prevHistory, newPoem]);
  
      const newPivots = await getPivots(newPoem.id);
      setPivots(newPivots);
  
      // Update displayedLines
      setDisplayedLines((prevLines) => {
        // Keep lines up to the pivot line as is
        const keptLines = prevLines.slice(0, pivotLine + 1);
        // Mark lines after the pivot line for exit animation
        const linesToRemove = prevLines.slice(pivotLine + 1).map((line) => ({
          ...line,
          isRemoving: true, // Add a flag to trigger exit animation
        }));
        // Create new lines starting from the pivot line + 1
        
        prevLines.slice(pivotLine + 1).forEach((line) => {
          line.isOld = true; // Mark the old lines
        });
        const newLines = newPoem.poem
          .split("\n")
          .slice(pivotLine + 1)
          .map((lineText, index) => ({
            text: lineText,
            key: `${newPoem.id}-${pivotLine + 1 + index}`,
            isOld: false,
          }));
        // Combine the kept lines, lines to remove, and new lines
        return [...keptLines, ...linesToRemove, ...newLines];
      });
      
    } catch (error) {
      console.error("Failed to load the next poem", error);
      setError("Failed to load the next poem. Please try again.");
    }
  };
  

  const handleBreadcrumbClick = (index: number) => {
    if (index < poemHistory.length - 1) {
      const selectedPoem = poemHistory[index];
      setPoem(selectedPoem);
      setPoemHistory((prevHistory) => prevHistory.slice(0, index + 1));
      getPivots(selectedPoem.id).then(setPivots);

      // Update displayedLines to match the selected poem
      const newLines = selectedPoem.poem.split("\n").map((line, idx) => ({
        text: line,
        key: `${selectedPoem.id}-${idx}`,
        isOld: false,
      }));
      setDisplayedLines(newLines);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar isLandingPage={false} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {!poem && !loading && (
            <>
              <div className="mb-6">
                <div className="inline-block bg-verseform-purple bg-opacity-10 rounded-full p-4">
                  <BookOpen className="w-12 h-12 text-verseform-purple" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 text-verseform-purple">
                Click on the highlighted verses
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Explore AI-matched poetry that evolves with every read and
                unveil your own poetic journey.
              </p>
            </>
          )}

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {loading && (
            <p className="text-gray-600 mb-4 text-center">
              Finding your perfect poem match...
            </p>
          )}

          {!poem && !loading && (
            <Button
              onClick={handleGeneratePoem}
              className="bg-verseform-purple hover:bg-verseform-blue text-white transition-colors duration-200 text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg"
            >
              Find Poem
            </Button>
          )}

          {poem && (
            <>
              {poemHistory.length > 0 && (
                <Breadcrumb className="mb-6">
                  <BreadcrumbList>
                    {poemHistory.map((historyPoem, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {index === poemHistory.length - 1 ? (
                            <span>{historyPoem.name}</span>
                          ) : (
                            <BreadcrumbLink
                              onClick={() => handleBreadcrumbClick(index)}
                              className="hover:cursor-pointer hover:underline"
                            >
                              {historyPoem.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
              <div>
                <h2 className="text-4xl font-semibold mb-6 text-center text-verseform-purple">
                  {poem.name}
                </h2>
                <div className="text-xl space-y-3 mb-8 px-4">
                  {parsePoem(displayedLines, pivots, handlePivotClick)}
                </div>
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleGeneratePoem}
                    className="bg-verseform-purple hover:bg-verseform-blue text-white transition-colors duration-200 text-lg px-6 py-2 rounded-full"
                  >
                    Find New Poem
                  </Button>
                </div>
                {Object.keys(pivots).length > 0 ? (
                  <p className="mt-6 text-gray-600 text-center text-sm">
                    Click on the highlighted lines to explore new paths in the
                    poem.
                  </p>
                ) : (
                  <p className="mt-6 text-gray-600 text-center text-sm">
                    This poem doesn't have any interactive elements.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
