// src/Routes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";  // Ensure this path is correct
import GeneratePage from "./pages/GeneratePage";  // Ensure this path is correct

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/generate" element={<GeneratePage />} />
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;