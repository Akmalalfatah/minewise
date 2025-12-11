import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";

function App() {
  console.log("App component loaded");
  
  return (
    <BrowserRouter>
      <div>
        <h1 style={{ padding: "1rem", background: "#3b82f6", color: "white" }}>
          MineWise - Debug Mode
        </h1>
        <Routes>
          <Route path="*" element={<TestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
