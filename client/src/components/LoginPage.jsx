import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert("Please fill out all fields.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data && res.data.token) {
        console.log(res.data.token);
      }

      if (res.status === 200) {
        setAlert("Logged in successfully");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/Chatboard");
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        setAlert(
          error.response.data.message || "Login failed. Please try again."
        );
      } else if (error.request) {
        setAlert("No response from server. Please try again later.");
      } else {
        setAlert("Something went wrong. Please try again.");
      }
      console.log(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen flex justify-center items-center">
      <div className="w-full sm:w-96 p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Login to Your Account
          </h2>
          <p className="text-gray-600 text-lg mt-2">Welcome back!</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAlert("");
              }}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAlert("");
              }}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-300 transition-all"
          >
            Login
          </button>

          {/* Error / Success Messages */}
          {alert && (
            <p className="text-red-500 text-center font-semibold mt-4">
              {alert}
            </p>
          )}
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            New user?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Forgot password?{" "}
            <span
              onClick={() => navigate("/ForgetPassword")}
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Reset Password
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
