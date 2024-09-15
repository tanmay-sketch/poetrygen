import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";  // Shadcn UI button

function App() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/generate");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-black text-white flex justify-between items-center p-4">
        <span className="text-xl font-bold">Verseform</span>
      </nav>

      {/* Centered Text Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-white">
        <h1 className="text-6xl font-bold text-black mb-4">Verseform</h1>
        <p className="text-2xl text-gray-700 mb-8">Read in a higher dimension</p>
        <Button className="px-6 py-3" onClick={handleGetStarted}>
          Get Started
        </Button>
      </section>
    </div>
  );
}

export default App;