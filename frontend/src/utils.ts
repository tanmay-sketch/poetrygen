// utils.ts
import { PivotsResponse, ParsedPoemLine } from "./types";

const MAX_PIVOTS_PER_LINE = 3;
const MAX_TOTAL_PIVOTS = 10;

export const processPivots = (pivots: PivotsResponse): PivotsResponse => {
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

export const parsePoem = (
  poem: string,
  pivots: PivotsResponse
): ParsedPoemLine[] => {
  return poem.split("\n").map((line: string, index: number) => ({
    line,
    index,
    hasPivot: !!pivots[index.toString()],
  }));
};