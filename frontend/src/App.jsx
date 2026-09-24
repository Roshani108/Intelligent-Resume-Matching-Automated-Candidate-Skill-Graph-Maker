import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setResult(null);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
            padding: "12px 18px",
          },
          success: {
            iconTheme: { primary: "#0D9488", secondary: "#FFFFFF" },
          },
          error: {
            iconTheme: { primary: "#DC2626", secondary: "#FFFFFF" },
          },
        }}
      />
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : !result ? (
        <UploadPage onDone={setResult} user={user} onLogout={handleLogout} />
      ) : (
        <ResultsPage result={result} onReset={() => setResult(null)} user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
