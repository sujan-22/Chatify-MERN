import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginSignup from "../components/LoginSignup";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <LoginSignup />
    </div>
  );
};

export default HomePage;
