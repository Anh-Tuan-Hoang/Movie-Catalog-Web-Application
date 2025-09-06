import React from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirects to the main page
  };

  return (
    <div className="error-page">
      <h1>Oops! Looks like something went wrong.</h1>
      <button onClick={handleGoHome}>Return to Home Page</button>
    </div>
  );
}

export default ErrorPage;
