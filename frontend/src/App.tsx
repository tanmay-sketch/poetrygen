import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";  // Shadcn Card Component

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-black text-white flex justify-between items-center p-4">
        <span className="text-xl font-bold">Verseform</span>
      </nav>

      {/* Centered Text Section */}
      <section className="flex-1 flex items-center justify-center bg-white">
        <Card className="bg-transparent text-center">
          <CardHeader className="text-6xl font-extrabold mb-4 text-black">Verseform</CardHeader>
          <CardContent>
            <p className="text-2xl text-black">Read in a higher dimension</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default App;