import React from "react";

function TestPage() {
  return (
    <div style={{ 
      padding: "2rem", 
      textAlign: "center",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6"
    }}>
      <h1 style={{ fontSize: "2rem", color: "#111827", marginBottom: "1rem" }}>
        🎉 MineWise Frontend is Working!
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
        If you see this page, the React app is rendering correctly.
      </p>
      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "white", borderRadius: "8px", maxWidth: "600px", margin: "2rem auto" }}>
        <h2 style={{ color: "#059669" }}>✅ Status Check</h2>
        <ul style={{ textAlign: "left", marginTop: "1rem" }}>
          <li>✅ React is loaded</li>
          <li>✅ Router is working</li>
          <li>✅ Components are rendering</li>
          <li>✅ Styles are applied</li>
        </ul>
      </div>
      <p style={{ marginTop: "2rem", color: "#9ca3af" }}>
        Check browser console (F12) for any errors.
      </p>
    </div>
  );
}

export default TestPage;
