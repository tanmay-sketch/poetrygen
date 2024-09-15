import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
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
import { usePoemGenerator } from "../usePoemGenerator";
import { Poem, ParsedPoemLine } from "../types";

interface DisplayedLine extends ParsedPoemLine {
  key: string;
  isNew?: boolean;
}

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

  const [displayedLines, setDisplayedLines] = useState<DisplayedLine[]>([]);

  const updateDisplayedLines = useCallback((newPoem: Poem, isNewPoem: boolean = false) => {
    const newLines = newPoem.poem.split("\n").map((line, index) => ({
      line,
      index,
      hasPivot: !!pivots[index],
      key: `${newPoem.id}-${index}`,
      isNew: isNewPoem,
    }));
    setDisplayedLines(newLines);
  }, [pivots]);

  useEffect(() => {
    if (poem) {
      updateDisplayedLines(poem);
    }
  }, [poem, updateDisplayedLines]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5 
      },
    },
  };

  const pivotLineVariants = {
    ...lineVariants,
    hover: {
      scale: 1.05,
      color: "#8B5CF6",
      transition: { duration: 0.2 }
    }
  };

  const renderPoemLines = (lines: DisplayedLine[]) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-4"
      >
        {lines.map((line) => (
          <motion.p
            key={line.key}
            variants={line.hasPivot ? pivotLineVariants : lineVariants}
            className={`text-center ${
              line.hasPivot
                ? "cursor-pointer text-verseform-purple hover:text-verseform-blue transition-colors duration-200"
                : "text-gray-800"
            }`}
            onClick={() => line.hasPivot && handlePivotClick(line.index)}
            whileHover={line.hasPivot ? "hover" : undefined}
          >
            {line.line}
          </motion.p>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar isLandingPage={false} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {!poem && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="mb-6">
                <div className="inline-block bg-verseform-purple bg-opacity-10 rounded-full p-4">
                  <BookOpen className="w-12 h-12 text-verseform-purple" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 text-verseform-purple">Click on the highlighted verses</h1>
              <p className="text-xl text-gray-700 mb-8">
                Explore AI-matched poetry that evolves with every read and unveil your own poetic journey.
              </p>
            </motion.div>
          )}
          
          {error && <p className="text-red-500 mb-4 text-center" role="alert">{error}</p>}
          {loading && <p className="text-gray-600 mb-4 text-center" aria-live="polite">Finding your perfect poem match...</p>}
          
          {!poem && !loading && (
            <Button 
              onClick={generatePoem} 
              className="bg-verseform-purple hover:bg-verseform-blue text-white transition-colors duration-200 text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg"
            >
              Find Poem
            </Button>
          )}
          
          {poem && (
            <AnimatePresence mode="wait">
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
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
                <motion.h2 
                  className="text-4xl font-semibold mb-6 text-center text-verseform-purple"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {poem.name}
                </motion.h2>
                <div className="text-xl mb-8 px-4">
                  {renderPoemLines(displayedLines)}
                </div>
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={generatePoem} 
                    className="bg-verseform-purple hover:bg-verseform-blue text-white transition-colors duration-200 text-lg px-6 py-2 rounded-full"
                  >
                    Find New Poem
                  </Button>
                </div>
                {Object.keys(pivots).length === 0 && (
                  <p className="mt-6 text-gray-600 text-center text-sm">
                    This poem doesn't have any interactive elements.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;