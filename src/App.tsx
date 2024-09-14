// src/App.tsx
import React, { useEffect, useState } from "react";
import { testBackendConnection } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    testBackendConnection()
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("Error connecting to backend");
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