import React from "react";
import chat from "../assets/chat2.svg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 font-serif">
      {/* Header Section */}
      <header className="bg-white shadow-lg border-b-2 border-gray-300 py-6">
        <div className="container mx-auto flex justify-between items-center px-12">
          <h1 className="text-4xl text-gray-800">ChatHub</h1>
          <nav className="flex space-x-8 text-gray-700"></nav>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="py-20 bg-beige text-center">
        <div className="container mx-auto px-8">
          <h2 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Stay Connected, Stay Efficient
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            ChatHub brings you a sleek, secure platform designed for seamless
            communication. Whether for work or fun, stay in touch effortlessly.
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate("/register")}
              className="bg-gray-300 text-gray-700 px-10 py-4 rounded-md shadow-md hover:bg-gray-400 transition duration-300"
            >
              Register
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-gray-300 text-gray-700 px-10 py-4 rounded-md shadow-md hover:bg-gray-400 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
