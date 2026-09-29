import React, { useRef, useState, useEffect } from "react";
import Preview from "../Preview/Preview";
import EditorTools from "../../EditorTools/EditorTools";
// import LandingPageChart from "../LandingPageChart/LandingPageChart";

import {
  Eye,
  Link2,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Edit3,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_BASE_URL || window.location.origin;
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
let usedIndexes = [];
const Container = () => {
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem("affilai_prompt") || "";
  });
  const [loading, setLoading] = useState(false);
  const [aicode, Setaicode] = useState(() => {
    return localStorage.getItem("affilai_aicode") || "";
  });
  const previewRef = useRef(null);
  const [conversionScore, setConversionScore] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [intentState, setIntentState] = useState("");
  const [showPreviewTop, setShowPreviewTop] = useState(() => {
    return localStorage.getItem("affilai_show_preview") === "true";
  });
  const [isEditing, setIsEditing] = useState(false);

  const [landingPages, setLandingPages] = useState([]);

  const userEmail = "demo@gmail.com";


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

    // return `http://localhost:5173/images/${safeIntent}/${random}.png`; // ← 1.png, 2.png, ..., 10.png

    return `${ASSET_BASE_URL}/images/${safeIntent}/${random}.png`; // ← 1.png, 2.png, ..., 10.png
  }

  async function getResponse() {
    setLoading(true);
    setShowPreviewTop(true);
    setIntentState("");
    setConversionScore("");
    Setaicode("");

    // const res = await fetch("http://localhost:5000/generate", {

    const res = await fetch(`${API_BASE_URL}/generate`, {
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
      // console.error("No HTML returned", data);
      return;
    }

    // ❌ remove bad backgrounds
    html = html.replace(/bg-(black|slate-\d+|gray-\d+|neutral-\d+)/g, "");

    // ❌ remove inline background
    // html = html.replace(/background[^;"]+;?/gi, "");

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

  // =====================================================
  // FORMAT DATE
  // =====================================================
  function formatRelativeTime(dateValue) {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString();
  }

  // =====================================================
  // GET PAGE TITLE
  // =====================================================
  function getPageTitle(page) {
    if (page?.name?.trim()) {
      return page.name;
    }

    if (page?.title?.trim()) {
      return page.title;
    }

    return "Untitled Landing Page";
  }

  // =====================================================
  // GET PAGE URL
  // =====================================================
  function getLandingPageUrl(page) {
    if (!page?.slug) return null;
    return `${API_BASE_URL}/${page.slug}`;
  }

  useEffect(() => {
    if (aicode) {
      localStorage.setItem("affilai_aicode", aicode);
    }
  }, [aicode]);

  useEffect(() => {
    if (prompt) {
      localStorage.setItem("affilai_prompt", prompt);
    }
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem("affilai_show_preview", String(showPreviewTop));
  }, [showPreviewTop]);

  useEffect(() => {
    const fetchLandingPages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/landing-pages`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch landing pages");
        }

        const allPages = data.pages || [];

        const matchedPages = allPages.filter(
          (page) =>
            page.email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        setLandingPages(matchedPages);

        console.log("Fetched landing pages:", matchedPages);
      } catch (error) {
        console.error("Failed to fetch landing pages:", error);
      }
    };

    fetchLandingPages();
  }, [userEmail]);

  return (
    <>
      <div className="bg-black">
        {showPreviewTop && (
          <div
            ref={previewRef}
            className=" w-full max-w-[1450px] mx-auto mt-16 px-4 "
          >
            {" "}
            <div
              className={` flex flex-col xl:flex-row items-start gap-5 transition-all duration-500 `}
            >
              {" "}
              <div
                className={` transition-all duration-500 ease-in-out w-full ${isEditing ? "xl:w-[70%]" : "xl:w-full"} `}
              >
                {" "}
                <Preview
                  aicode={aicode}
                  loading={loading}
                  onEdit={() => setIsEditing(true)}
                  intent={intentState}
                  email={userEmail}
                />{" "}
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
                <div className="w-full flex flex-col justify-center items-center bg-black px-4">
                  <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative">
                    <textarea
                      id="ai-command"
                      disabled={loading}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();

                          if (prompt.trim() && !loading) {
                            getResponse();
                          }
                        }
                      }}
                      placeholder="Type your command here... e.g., Create a modern portfolio website with dark theme"
                      className="w-full h-10 sm:h-18 p-4 pr-14 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow shadow-sm hover:shadow-md"
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
              </div>{" "}
              {isEditing && (
                <div className=" w-full xl:w-[30%] xl:sticky xl:top-5 transition-all duration-500 animate-[fadeIn_.3s_ease-in-out] ">
                  {" "}
                  <EditorTools
                    code={aicode}
                    setCode={Setaicode}
                    onClose={() => setIsEditing(false)}
                  />{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>
        )}

        {!showPreviewTop && (
          <div
            ref={previewRef}
            className=" w-full max-w-[1450px] mx-auto mt-16 px-4 "
          >
            {" "}
            <div className=" flex flex-col xl:flex-row items-start gap-5 ">
              {" "}
              <div
                className={` w-full transition-all duration-500 ${isEditing ? "xl:w-[70%]" : "xl:w-full"} `}
              >
                <div className="w-full flex flex-col justify-center items-center bg-black px-4">
                  <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative">
                    <textarea
                      id="ai-command"
                      disabled={loading}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();

                          if (prompt.trim() && !loading) {
                            getResponse();
                          }
                        }
                      }}
                      placeholder="Type your command here... e.g., Create a modern portfolio website with dark theme"
                      className="w-full h-10 sm:h-18 p-4 pr-14 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow shadow-sm hover:shadow-md"
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
                <Preview
                  aicode={aicode}
                  loading={loading}
                  onEdit={() => setIsEditing(true)}
                  intent={intentState}
                  email={userEmail}
                />{" "}
              </div>{" "}
              {/* EDITOR */}{" "}
              {isEditing && (
                <div className=" w-full xl:w-[30%] xl:sticky xl:top-5 ">
                  {" "}
                  <EditorTools
                    code={aicode}
                    setCode={Setaicode}
                    onClose={() => setIsEditing(false)}
                  />{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>
        )}

        {/* =====================================================
    GENERATED LANDING PAGES
===================================================== */}

        {landingPages.length > 0 && (
          <section className="w-full max-w-[1450px] mx-auto px-4 md:px-6 mt-16 pb-20">
            {/* =================================================
        SECTION HEADER
    ================================================= */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Your Landing Pages
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {landingPages.length} generated landing page
                  {landingPages.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="text-sm text-gray-400">Recently created</div>
            </div>

            {/* =================================================
        LANDING PAGE GRID
    ================================================= */}
            <div
              className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-5
      "
            >
              {landingPages.map((page) => {
                const pageUrl = getLandingPageUrl(page);

                return (
                  <div
                    key={page.id || page._id || page.slug}
                    className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#0b0b0f]
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-500/40
              hover:shadow-indigo-500/10
            "
                  >
                    {/* =================================================
                PREVIEW AREA
            ================================================= */}
                    <div
                      className="
                relative
                w-full
                h-[190px]
                bg-slate-950
                overflow-hidden
                border-b
                border-white/10
              "
                    >
                      {/* Status */}
                      <div
                        className="
                  absolute
                  top-3
                  left-3
                  z-10
                  px-2.5
                  py-1
                  rounded-full
                  text-[10px]
                  font-semibold
                  bg-green-500/20
                  text-green-400
                  border
                  border-green-500/30
                  backdrop-blur-md
                "
                      >
                        {page.status === "published" ? "Published" : "Draft"}
                      </div>

                      {/* Actual landing page preview */}
                      {/* {page.html ? (
                        <iframe
                          title={getPageTitle(page)}
                          srcDoc={page.html}
                          className="
                    absolute
                    top-0
                    left-0
                    w-full
                    h-[190px]
                    border-0
                    bg-white
                    pointer-events-none
                  "
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <div
                          className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    text-sm
                  "
                        >
                          No Preview
                        </div>
                      )} */}

                      {page.html ? (
                        <div
                          className="
      relative
      w-full
      h-full
      overflow-hidden
      bg-white
    "
                        >
                          <iframe
                            title={getPageTitle(page)}
                            srcDoc={page.html}
                            sandbox="allow-scripts"
                            className="
        absolute
        top-0
        left-0
        border-0
        bg-white
        pointer-events-none
      "
                            style={{
                              width: "400%",
                              height: "760px",
                              transform: "scale(0.25)",
                              transformOrigin: "top left",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="
      w-full
      h-full
      flex
      items-center
      justify-center
      text-gray-500
      text-sm
    "
                        >
                          No Preview
                        </div>
                      )}

                      {/* Dark overlay */}
                      <div
                        className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/30
                  via-transparent
                  to-transparent
                  pointer-events-none
                "
                      />
                    </div>

                    {/* =================================================
                CARD CONTENT
            ================================================= */}
                    <div className="p-4">
                      {/* Title */}
                      <h3
                        className="
                  text-white
                  font-semibold
                  text-base
                  truncate
                "
                        title={getPageTitle(page)}
                      >
                        {getPageTitle(page)}
                      </h3>

                      {/* Generated time */}
                      <p className="text-xs text-gray-500 mt-1">
                        Generated{" "}
                        {formatRelativeTime(page.createdAt || page.updatedAt)}
                      </p>

                      {/* =================================================
                  BOTTOM ACTIONS
              ================================================= */}
                      <div
                        className="
                  flex
                  items-center
                  justify-between
                  mt-4
                  pt-3
                  border-t
                  border-white/10
                "
                      >
                        {/* Views */}
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Eye size={16} />

                          <span className="text-xs">{page.views || 0}</span>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                          {/* Open page */}
                          {pageUrl && (
                            <button
                              type="button"
                              title="Open Landing Page"
                              onClick={() => {
                                window.open(
                                  pageUrl,
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }}
                              className="
                        w-8
                        h-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        hover:text-white
                        hover:bg-white/10
                        transition
                      "
                            >
                              <Link2 size={16} />
                            </button>
                          )}

                          {/* More button */}
                          <button
                            type="button"
                            title="More"
                            className="
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-gray-400
                      hover:text-white
                      hover:bg-white/10
                      transition
                    "
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
export default Container;
