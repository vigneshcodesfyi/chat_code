import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const Navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (data.password !== data.cpassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/auth/user/register",
        data
      );

      if (response.status === 201) {
        return setError(response.data.message);
      }
      if (response.status === 202) {
        return setError(response.data);
      }

      setSuccess(response.data.message);
      setTimeout(() => {
        Navigate("/verify-OTP");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 min-h-screen flex justify-center items-center">
      <div className="w-full sm:w-96 p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-lg mt-2">Join us today!</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={data.name}
              onChange={handleChange}
              name="name"
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              name="email"
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              name="password"
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={data.cpassword}
              onChange={handleChange}
              name="cpassword"
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full p-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all"
          >
            Register
          </button>

          {/* Error / Success Messages */}
          {error && (
            <p className="text-red-500 text-center font-semibold mt-4">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-center font-semibold mt-4">
              {success}
            </p>
          )}
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => Navigate("/login")}
              className="text-teal-600 cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
