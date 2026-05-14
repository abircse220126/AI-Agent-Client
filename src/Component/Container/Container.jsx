import React, { useRef, useState } from "react";
import Preview from "../Preview/Preview";
// import { GoogleGenAI } from "@google/genai";
// import { API_KEY } from "../helper";

const cardStyles = [
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-indigo-500/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60`,

  `relative rounded-xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-slate-900/60`,

  `relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-pink-500/20 bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-slate-900/60`,

  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:rotate-[1deg] hover:shadow-cyan-500/20 bg-gradient-to-br from-cyan-900/40 via-blue-900/30 to-slate-900/60`,
  // Indigo Purple
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-indigo-500/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60`,

  // Blue Indigo
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-500/20 bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900/60`,

  // Pink Violet
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-pink-500/20 bg-gradient-to-br from-pink-900/40 via-violet-900/30 to-slate-900/60`,

  // Cyan Blue
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/20 bg-gradient-to-br from-cyan-900/40 via-blue-900/30 to-slate-900/60`,

  // Emerald Teal
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/20 bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-slate-900/60`,

  // Orange Red
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-orange-500/20 bg-gradient-to-br from-orange-900/40 via-red-900/30 to-slate-900/60`,

  // Yellow Amber
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-yellow-500/20 bg-gradient-to-br from-yellow-800/40 via-amber-900/30 to-slate-900/60`,

  // Sky Indigo
  `relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-sky-500/20 bg-gradient-to-br from-sky-900/40 via-indigo-900/30 to-slate-900/60`,
];

// const ai = new GoogleGenAI({ apiKey: API_KEY });

let usedIndexes = [];
const Container = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aicode, Setaicode] = useState("");
  const previewRef = useRef(null);
  const [conversionScore, setConversionScore] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [intentState, setIntentState] = useState("");
  const [showPreviewTop, setShowPreviewTop] = useState(false);

  // 🔥 UNIQUE RANDOM STYLE FUNCTION

  function getUniqueStyle(cardStyles) {
    if (usedIndexes.length === cardStyles.length) {
      usedIndexes = [];
    }

    let index;
    do {
      index = Math.floor(Math.random() * cardStyles.length);
    } while (usedIndexes.includes(index));

    usedIndexes.push(index);
    return cardStyles[index];
  }

  function generateHeroImage(intent) {
    const counts = {
      casino: 10,
      gambling: 10,
      crypto: 8,
      loan: 9,
      finance: 12,
      insurance: 11,
      travel: 7,
      dating: 9,
      health: 9,
    };

    const safeIntent = (intent || "general").toLowerCase();

    const total = counts[safeIntent] || counts.general;

    const random = Math.floor(Math.random() * total) + 1;

    return `http://localhost:5173/images/${safeIntent}/${random}.png`; // ← 1.png, 2.png, ..., 10.png
  }

  async function getResponse() {
    setLoading(true);
    setShowPreviewTop(true);
    setIntentState("");
    setConversionScore("");
    Setaicode("");

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const intent = data.intent;
    setIntentState(intent);
    setConversionScore(data.score);
    setAnalysis(data.analysis);

    let html = data.html;

    if (!data.html) {
      console.error("No HTML returned", data);
      return;
    }

    // if (!html || typeof html !== "string") {
    //   console.error("Invalid HTML");
    //   setLoading(false);
    //   return;
    // }

    // ❌ remove bad backgrounds
    html = html.replace(/bg-(black|slate-\d+|gray-\d+|neutral-\d+)/g, "");

    // ❌ remove inline background
    html = html.replace(/background[^;"]+;?/gi, "");

    // ✅ ONLY apply gradient to card (NOT all div)
    html = html.replace(
      /<div([^>]*)class="([^"]*card[^"]*)"/g,
      (match, divPart, classPart) => {
        return `<div${divPart}class="${classPart} ${getUniqueStyle(cardStyles)}"`;
      },
    );

    // If AI forgot image → inject it
    if (!html.includes("{{HERO_IMAGE}}")) {
      html = html.replace(
        /<section[^>]*>/i,
        (match) => `
      ${match}
      <div class="w-full h-[400px] md:h-[400px] lg:h-[460px] ">
        <img 
          src="{{HERO_IMAGE}}" 
          class="w-full h-full object-contain rounded-xl" 
          loading="lazy"
        />
      </div>
    `,
      );
    }

    const heroImage = generateHeroImage(intent || "general");

    const htmlWithHeroImage = html.replaceAll("{{HERO_IMAGE}}", heroImage);

    const wrappedHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-950 text-white antialiased">
  <div class="space-y-8">

    ${htmlWithHeroImage.replace(/<div class="card">/g, () => {
      const randomStyle =
        cardStyles[Math.floor(Math.random() * cardStyles.length)];
      return `<div class="card ${randomStyle}">`;
    })}

  </div>
  </body>
  </html>
  `;

    Setaicode(wrappedHTML);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);

    setLoading(false);
  }

  return (
    <>
      <div className="bg-black">
        {showPreviewTop && (
          <div ref={previewRef}>
            <Preview aicode={aicode} loading={loading} />
          </div>
        )}

        {conversionScore && (
          <div className="w-full max-w-3xl mx-auto mt-6 px-4">
            <div className="flex items-center justify-between bg-slate-900 border border-white/10 rounded-xl px-5 py-3 shadow-md">
              <div className="text-sm text-gray-300">
                🎯 Intent:
                <span className="text-indigo-400 font-semibold ml-1">
                  {intentState}
                </span>
              </div>

              <div className="text-sm text-gray-300">
                ⚡ Score:
                <span className="text-green-400 font-semibold ml-1">
                  {conversionScore}/100
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full pt-10 flex flex-col justify-center items-center bg-black px-4">
          <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative">
            <textarea
              id="ai-command"
              disabled={loading}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your command here... e.g., Create a modern portfolio website with dark theme"
              className="w-full h-30 sm:h-38 p-4 pr-14 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow shadow-sm hover:shadow-md"
            ></textarea>

            {prompt && (
              <button
                onClick={getResponse}
                disabled={loading}
                className={`absolute bottom-6 right-6 w-10 h-10 flex items-center justify-center rounded-full 
              bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg
              transition-all duration-300
              ${loading ? "cursor-not-allowed opacity-70" : "hover:scale-110"}`}
              >
                {loading ? (
                  // Spinner icon
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  // Arrow icon
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
                )}
              </button>
            )}
          </div>
        </div>


        {/* <div ref={previewRef}>
          <Preview aicode={aicode} loading={loading}></Preview>
        </div> */}

        {!showPreviewTop && (
          <div ref={previewRef}>
            <Preview aicode={aicode} loading={loading} />
          </div>
        )}
      </div>
    </>
  );
};

export default Container;
