import React, { useState } from "react";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-black px-4 mt-30">
      {/* Hero Heading */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-lg">
        Build Your Website With AI
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-gray-300 text-center text-lg sm:text-xl max-w-xl">
        Create stunning, responsive websites effortlessly using AI-powered
        tools. No coding required!
      </p>

      {/* Textarea Wrapper */}
      <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative">
        <textarea
          id="ai-command"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your command here... e.g., Create a modern portfolio website with dark theme"
          className="w-full h-40 sm:h-48 p-4 pr-14 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow shadow-sm hover:shadow-md"
        ></textarea>

        {/* Button inside textarea */}
        <button
          className="absolute bottom-4 right-8 w-10 h-10 flex items-center justify-center rounded-full
          bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg
          transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Home;
