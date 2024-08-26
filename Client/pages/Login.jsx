import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setSuccessMessage("Login Successful");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Login error", error);
      setErrorMessage("Login error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" onClick={handleLogin} />
      </form>
      <div style={{ marginTop: "1rem" }}>
        <p>Demo account</p>
        <p>Email : hello7@gmail.com</p>
        <p>Password : hello</p>
      </div>
      {errorMessage && <p className="login-message error">{errorMessage}</p>}
      {successMessage && (
        <p className="login-message success">{successMessage}</p>
      )}
    </div>
  );
};

export default Login;
