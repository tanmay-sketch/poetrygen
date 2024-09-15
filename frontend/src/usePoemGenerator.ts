// usePoemGenerator.ts
import { useState, useCallback } from "react";
import { Poem, PivotsResponse } from "./types";
import { getRandomPoem, getPivots } from "./api";
import { processPivots } from "./utils";

export const usePoemGenerator = () => {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [pivots, setPivots] = useState<PivotsResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poemHistory, setPoemHistory] = useState<Poem[]>([]);

  const generatePoem = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPoem(null);
    setPoemHistory([]);
    
    try {
      const poemData = await getRandomPoem();
      const pivotData = await getPivots(poemData.id);
      
      setPoem(poemData);
      setPivots(processPivots(pivotData));
      setPoemHistory([poemData]);
    } catch (error) {
      setError("Failed to fetch poem. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePivotClick = useCallback(async (pivotLine: number) => {
    if (!poem || !pivots[pivotLine.toString()]) return;

    const possiblePivots = pivots[pivotLine.toString()];
    const randomPivot = possiblePivots[Math.floor(Math.random() * possiblePivots.length)];

    try {
      const nextPoem = await getRandomPoem();
      const remainingLines = nextPoem.poem.split("\n").slice(randomPivot.nextLineStart);
      
      const newPoem = {
        ...nextPoem,
        poem: [...poem.poem.split("\n").slice(0, pivotLine + 1), ...remainingLines].join("\n"),
      };

      setPoem(newPoem);
      setPoemHistory(prevHistory => [...prevHistory, newPoem]);
      
      const newPivots = await getPivots(newPoem.id);
      setPivots(processPivots(newPivots));
    } catch (error) {
      setError("Failed to load the next poem. Please try again.");
    }
  }, [poem, pivots]);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index < poemHistory.length - 1) {
      const selectedPoem = poemHistory[index];
      setPoem(selectedPoem);
      setPoemHistory(prevHistory => prevHistory.slice(0, index + 1));
      getPivots(selectedPoem.id).then(pivotData => setPivots(processPivots(pivotData)));
    }
  }, [poemHistory]);

  return {
    poem,
    pivots,
    loading,
    error,
    poemHistory,
    generatePoem,
    handlePivotClick,
    handleBreadcrumbClick,
  };
};