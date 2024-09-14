// src/App.tsx
import React, { useEffect, useState } from "react";
import { testBackendConnection } from "./api/index";  // Corrected import path

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    testBackendConnection()
      .then((data) => {
        setMessage(data.message);  // Set the message from backend response
      })
      .catch(() => {
        setMessage("Error connecting to backend");  // Show error message if request fails
      });
  }, []);

  return (
    <div>
      <h1>Frontend-Backend Connection Test</h1>
      <p>{message || "Loading..."}</p>
    </div>
  );
}

export default App;