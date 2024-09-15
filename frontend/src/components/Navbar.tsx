import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isLandingPage?: boolean;
}


const Navbar: React.FC<NavbarProps> = ({ isLandingPage = false }) => {
    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate("/");
    };
    return (
    <nav className={`w-full bg-transparent flex justify-between items-center p-6 ${isLandingPage ? 'text-white' : 'text-black'}`}>
        <span className="text-2xl font-bold">Verseform</span>
        {/* Uncomment the following Button if you want to add an About button later
        
        */}
        <Button variant="ghost" 
        className={`hover:text-gray-200 ${isLandingPage ? 'text-white' : 'text-black'}`}
        onClick={handleHomeClick}
        >
            Home
        </Button>
    </nav>
    );
};

export default Navbar;