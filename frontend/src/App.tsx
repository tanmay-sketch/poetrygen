import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function App() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/generate");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 to-blue-500">
      {/* Navbar */}
      <nav className="w-full bg-transparent text-white flex justify-between items-center p-6">
        <span className="text-2xl font-bold">Verseform</span>
        {/* <Button variant="ghost" className="text-white hover:text-gray-200">
          About
        </Button> */}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-7xl font-extrabold mb-4 text-center">
          Verseform
        </h1>
        <p className="text-3xl font-light mb-8 text-center">
          Read in a higher dimension
        </p>
        <p className="text-xl mb-12 max-w-2xl text-center">
          Experience poetry like never before. Verseform uses AI to generate
          unique poems and allows you to explore different paths within each verse.
        </p>
        <Button 
          className="px-8 py-6 text-xl bg-white text-purple-600 hover:bg-gray-100 transition-colors duration-300"
          onClick={handleGetStarted}
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="w-full text-white text-center p-4">
        <p>&copy; 2024 Verseform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;