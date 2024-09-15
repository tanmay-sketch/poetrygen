// src/usePoemGenerator.ts
import { useState, useCallback } from "react";
import { Poem, PivotsResponse } from "./types";
import { getRandomPoem, getPivots, getPoem } from "./api";

export const usePoemGenerator = () => {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [pivots, setPivots] = useState<PivotsResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poemHistory, setPoemHistory] = useState<Poem[]>([]);

  const generatePoem = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const poemData = await getRandomPoem();
      setPoem(poemData);
      setPoemHistory([poemData]);
      try {
        const pivotData = await getPivots(poemData.id);
        setPivots(pivotData);
      } catch (pivotError) {
        // If no pivots are found, just set an empty object
        setPivots({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePivotClick = useCallback(async (pivotLine: number) => {
    if (!poem || !pivots[pivotLine]) return;
    setLoading(true);
    setError(null);
    try {
      const possiblePivots = pivots[pivotLine];
      const randomPivot = possiblePivots[Math.floor(Math.random() * possiblePivots.length)];
      
      const nextPoem = await getPoem(randomPivot.nextPoemId);
      const remainingLines = nextPoem.poem.split("\n").slice(randomPivot.nextLineStart);
      
      const newPoem = {
        ...nextPoem,
        poem: [...poem.poem.split("\n").slice(0, pivotLine + 1), ...remainingLines].join("\n"),
      };
      setPoem(newPoem);
      setPoemHistory(prevHistory => [...prevHistory, newPoem]);
      
      try {
        const newPivots = await getPivots(newPoem.id);
        setPivots(newPivots);
      } catch (pivotError) {
        setPivots({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the next poem. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [poem, pivots]);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index < poemHistory.length) {
      const selectedPoem = poemHistory[index];
      setPoem(selectedPoem);
      setPoemHistory(prevHistory => prevHistory.slice(0, index + 1));
      getPivots(selectedPoem.id)
        .then(setPivots)
        .catch(() => {
          setPivots({});
        });
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