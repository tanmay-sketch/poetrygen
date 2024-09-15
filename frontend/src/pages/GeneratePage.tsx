// GeneratePage.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePoemGenerator } from "../usePoemGenerator";
import { parsePoem } from "../utils";
import { ParsedPoemLine } from "../types";

const GeneratePage: React.FC = () => {
  const {
    poem,
    pivots,
    loading,
    error,
    poemHistory,
    generatePoem,
    handlePivotClick,
    handleBreadcrumbClick,
  } = usePoemGenerator();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const handleGeneratePoem = () => {
    setAnimate(true);
    generatePoem();
  };

  const handlePivotClickWithAnimation = (index: number) => {
    setAnimate(true);
    handlePivotClick(index);
  };

  const renderPoemLines = (parsedLines: ParsedPoemLine[]) => {
    return parsedLines.map(({ line, index, hasPivot }) => (
      <p
        key={index}
        className={`text-center ${
          hasPivot
            ? "cursor-pointer text-verseform-purple hover:text-verseform-blue transition-colors duration-200"
            : "text-gray-800"
        }`}
        onClick={() => hasPivot && handlePivotClickWithAnimation(index)}
        role={hasPivot ? "button" : undefined}
        tabIndex={hasPivot ? 0 : undefined}
        onKeyPress={(e) => {
          if (hasPivot && (e.key === 'Enter' || e.key === ' ')) {
            handlePivotClickWithAnimation(index);
          }
        }}
      >
        {line}
      </p>
    ));
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
              <h1 className="text-5xl font-bold mb-6 text-verseform-purple">Click on the highlighted verses</h1>
              <p className="text-xl text-gray-700 mb-8">
                Explore AI-matched poetry that evolves with every read and unveil your own poetic journey.
              </p>
            </>
          )}
          
          {error && <p className="text-red-500 mb-4 text-center" role="alert">{error}</p>}
          {loading && <p className="text-gray-600 mb-4 text-center" aria-live="polite">Finding your perfect poem match...</p>}
          
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
                            <BreadcrumbPage>{historyPoem.name}</BreadcrumbPage>
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
              <div className={`transition-all duration-200 ease-in-out ${
                animate ? 'opacity-0 blur-sm scale-98' : 'opacity-100 blur-0 scale-100'
              }`}>
                <h2 className="text-4xl font-semibold mb-6 text-center text-verseform-purple">{poem.name}</h2>
                <div className="text-xl space-y-3 mb-8 px-4">
                  {renderPoemLines(parsePoem(poem.poem, pivots))}
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
                    Click on the highlighted lines to explore new paths in the poem.
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