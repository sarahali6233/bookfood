// LogoutHandler.js
import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutHandler = ({ onLogout }) => {
  const navigate = useNavigate();

  // Calling the onLogout function and navigating to login
  const performLogout = () => {
    onLogout(); // Perform any pre-logout actions here
    navigate("/login");
  };

  // Automatically call the performLogout function when this component is rendered
  React.useEffect(() => {
    performLogout();
  }, []); // Empty dependency array ensures this runs once on mount

  return null; // This component doesn't render anything
};

export default LogoutHandler;
