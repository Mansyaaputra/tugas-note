// Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../context/utils";
import "../NoteList.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/register`,
        { email, username, password },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );
      
      if (response.data.msg) {
        alert(response.data.msg);
        navigate("/login");
      }
    } catch (err) {
      // Network or timeout error
      if (!err.response) {
        console.error("Network Error:", err);
        alert("Connection failed. Please check your internet connection.");
        return;
      }

      // Server error
      if (err.response.status === 500) {
        console.error("Server Error:", err.response.data);
        alert("Server error occurred. Please try again later.");
        return;
      }

      // Other errors
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.msg || 
                      "Registration failed. Please try again.";
      console.error("Register Error:", {
        status: err.response?.status,
        data: err.response?.data,
        error: err
      });
      alert(errorMsg);
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
