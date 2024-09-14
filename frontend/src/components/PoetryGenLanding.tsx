import React from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          <span className="font-bold text-xl text-gray-800">PoetryGen</span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <div className="px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
          Unleash Your Inner Poet
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl">
          Generate beautiful, unique poems with the power of AI. 
          Inspire, create, and share your poetic masterpieces.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Button className="w-full sm:w-auto">Get Started</Button>
        </div>
      </div>
    </div>
);

export default function PoetryGenLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
    </div>
  );
}