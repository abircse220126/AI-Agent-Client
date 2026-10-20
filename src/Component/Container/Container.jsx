import React, { useRef, useState, useEffect } from "react";
import Preview from "../Preview/Preview";
import EditorTools from "../../EditorTools/EditorTools";
import DeleteLandingPageModal from "../DeleteLandingPageModal/DeleteLandingPageModal";
// import LandingPageChart from "../LandingPageChart/LandingPageChart";

import { Eye, Link2, Trash2, Edit3, Copy, Check } from "lucide-react";

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

  const [selectedPage, setSelectedPage] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState(56);
  const ITEMS_PER_PAGE = 8;

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
      insurance: 20,
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
    html = html.replace(
      /<div([^>]*)class="([^"]*card[^"]*)"/g,
      (match, divPart, classPart) => {
        return `<div${divPart}class="${classPart} ${getUniqueStyle(cardStyles)}"`;
      },
    );

    // If AI forgot image → inject it

    // if (!html.includes("{{HERO_IMAGE}}")) {
    //   html = html.replace(
    //     /<section[^>]*>/i,
    //     (match) => `
    //   ${match}
    //   <div class="w-full h-[400px] md:h-[400px] lg:h-[460px] ">
    //     <img
    //       src="{{HERO_IMAGE}}"
    //       class="w-full h-full object-cover rounded-xl"
    //       loading="lazy"
    //     />
    //   </div>
    // `,
    //   );
    // }

    if (!html.includes("{{HERO_IMAGE}}")) {
      html = html.replace(
        /<section[^>]*>/i,
        (match) => `
      ${match}
      <div class="w-full h-[400px] md:h-[400px] lg:h-[460px] overflow-hidden">
        <img
          src="{{HERO_IMAGE}}"
          class="block w-full h-auto object-cover rounded-xl" 
          loading="lazy"
          alt="Not Found Relavent Image"
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

    setPrompt("");

    setTextareaHeight(56);

    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      textareaRef.current.scrollTop = 0;
    }

    // localStorage.removeItem("affilai_prompt");

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

  function handleShowUrl(page) {
    setSelectedPage(page);
    setCopied(false);
    setShowUrlModal(true);
  }

  async function handleCopyUrl() {
    const url = getLandingPageUrl(selectedPage);

    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  }

  // =====================================================
  // EDIT EXISTING LANDING PAGE
  // =====================================================
  function handleEditPage(page) {
    if (!page?.html) {
      alert("Landing page HTML not found!");
      return;
    }

    // Load selected page HTML into main Preview
    Setaicode(page.html);

    // Restore page information
    setIntentState(page.intent || "");
    setConversionScore(null);

    // Open main Preview and Editor
    setShowPreviewTop(true);
    setIsEditing(true);

    // Remember which page is being edited
    setSelectedPage(page);

    // Scroll to the main Preview
    setTimeout(() => {
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  }

  // Open delete confirmation modal
  function handleDeleteClick(page) {
    setDeleteTarget(page);
  }

  // Delete page after confirmation
  async function confirmDeletePage() {
    if (!deleteTarget?.slug || deleting) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/landing-pages/${encodeURIComponent(deleteTarget.slug)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete landing page");
      }

      // Remove the deleted page from the UI
      setLandingPages((previousPages) =>
        previousPages.filter((page) => page.slug !== deleteTarget.slug),
      );

      setCurrentPage((previousPage) =>
        Math.min(
          previousPage,
          Math.max(1, Math.ceil((landingPages.length - 1) / ITEMS_PER_PAGE)),
        ),
      );

      // Clear the selected page if it was the one deleted
      setSelectedPage((currentPage) =>
        currentPage?.slug === deleteTarget.slug ? null : currentPage,
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete landing page error:", error);
      alert(error.message || "Failed to delete landing page.");
    } finally {
      setDeleting(false);
    }
  }

  // Add or update a landing page immediately after deployment

  async function handleDeploymentSuccess(deployedPage) {
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to refresh landing pages");
      }

      const matchedPages = (data.pages || []).filter(
        (page) =>
          page.email?.trim().toLowerCase() === userEmail.trim().toLowerCase(),
      );

      setLandingPages(matchedPages);

      // If a new page was added, show the page containing it
      const deployedSlug = deployedPage?.slug;

      if (deployedSlug) {
        const deployedIndex = matchedPages.findIndex(
          (page) => page.slug === deployedSlug,
        );

        if (deployedIndex !== -1) {
          setCurrentPage(Math.floor(deployedIndex / ITEMS_PER_PAGE) + 1);
        }
      }
    } catch (error) {
      console.error("Failed to refresh landing pages:", error);
    }
  }
  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(landingPages.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentLandingPages = landingPages.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (aicode) {
      localStorage.setItem("affilai_aicode", aicode);
    }
  }, [aicode]);

  useEffect(() => {
    if (prompt) {
      localStorage.setItem("affilai_prompt", prompt);
    } else {
      localStorage.removeItem("affilai_prompt");
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
                  selectedPage={selectedPage}
                  onDeploymentSuccess={handleDeploymentSuccess}
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
                      ref={textareaRef}
                      value={prompt}
                      disabled={loading}
                      rows={1}
                      onChange={(e) => {
                        setPrompt(e.target.value);

                        // Automatically adjust textarea height
                        e.target.style.height = "56px";
                        const nextHeight = Math.min(e.target.scrollHeight, 200);
                        e.target.style.height = `${nextHeight}px`;
                        setTextareaHeight(nextHeight);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();

                          if (prompt.trim() && !loading) {
                            getResponse();
                          }
                        }
                      }}
                      placeholder="Type your command here..."
                      className="
      block w-full min-h-[56px] max-h-[200px]
      overflow-y-auto
      p-4 pr-16
      rounded-2xl
      bg-gray-900 border border-gray-700
      text-gray-200 placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      resize-none transition-all duration-150
      shadow-sm hover:shadow-md
    "
                      style={{ height: `${textareaHeight}px` }}
                    />

                    {/* Always visible arrow button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (prompt.trim() && !loading) {
                          getResponse();
                        }
                      }}
                      disabled={!prompt.trim() || loading}
                      aria-label="Send prompt"
                      className={`
      absolute bottom-2 right-6
      w-10 h-10
      flex items-center justify-center
      rounded-full
      bg-gradient-to-r from-indigo-500 to-purple-600
      text-white shadow-lg
      transition-all duration-200
      ${
        !prompt.trim() || loading
          ? "opacity-40 cursor-not-allowed"
          : "hover:scale-110 cursor-pointer"
      }
    `}
                    >
                      {loading ? (
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
                      ref={textareaRef}
                      value={prompt}
                      disabled={loading}
                      rows={1}
                      onChange={(e) => {
                        setPrompt(e.target.value);

                        // Automatically adjust textarea height
                        e.target.style.height = "56px";
                        const nextHeight = Math.min(e.target.scrollHeight, 200);
                        e.target.style.height = `${nextHeight}px`;
                        setTextareaHeight(nextHeight);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();

                          if (prompt.trim() && !loading) {
                            getResponse();
                          }
                        }
                      }}
                      placeholder="Type your command here..."
                      className="
      block w-full min-h-[56px] max-h-[200px]
      overflow-y-auto
      p-4 pr-16
      rounded-2xl
      bg-gray-900 border border-gray-700
      text-gray-200 placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      resize-none transition-all duration-150
      shadow-sm hover:shadow-md
    "
                      style={{ height: `${textareaHeight}px` }}
                    />

                    {/* Always visible arrow button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (prompt.trim() && !loading) {
                          getResponse();
                        }
                      }}
                      disabled={!prompt.trim() || loading}
                      aria-label="Send prompt"
                      className={`
      absolute bottom-2 right-6
      w-10 h-10
      flex items-center justify-center
      rounded-full
      bg-gradient-to-r from-indigo-500 to-purple-600
      text-white shadow-lg
      transition-all duration-200
      ${
        !prompt.trim() || loading
          ? "opacity-40 cursor-not-allowed"
          : "hover:scale-110 cursor-pointer"
      }
    `}
                    >
                      {loading ? (
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
                  </div>
                </div>
                <Preview
                  aicode={aicode}
                  loading={loading}
                  onEdit={() => setIsEditing(true)}
                  intent={intentState}
                  email={userEmail}
                  selectedPage={selectedPage}
                  onDeploymentSuccess={handleDeploymentSuccess}
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
                {/* <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Your Landing Pages
                </h2> */}

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Your{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Landing Pages
                  </span>
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
              {/* {landingPages.map((page) => { */}
              {currentLandingPages.map((page) => {
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

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                          {/* Edit */}

                          <button
                            type="button"
                            title="Edit Landing Page"
                            onClick={() => handleEditPage(page)}
                            className="
    w-8 h-8
    rounded-lg
    flex items-center justify-center
    text-gray-400
    hover:text-indigo-400
    hover:bg-indigo-500/10
    transition
  "
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete Landing Page"
                            onClick={() => handleDeleteClick(page)}
                            className="
      w-8
      h-8
      rounded-lg
      flex
      items-center
      justify-center
      text-gray-400
      hover:text-red-400
      hover:bg-red-500/10
      transition
    "
                          >
                            <Trash2 size={16} />
                          </button>

                          {/* Link */}
                          {pageUrl && (
                            <button
                              type="button"
                              title="Show Landing Page URL"
                              onClick={() => handleShowUrl(page)}
                              className="
        w-8
        h-8
        rounded-lg
        flex
        items-center
        justify-center
        text-gray-400
        hover:text-green-400
        hover:bg-green-500/10
        transition
      "
                            >
                              <Link2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page information */}
                <p className="text-sm text-gray-400">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + ITEMS_PER_PAGE, landingPages.length)}{" "}
                  of {landingPages.length} landing pages
                </p>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((previous) => Math.max(1, previous - 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((previous) =>
                        Math.min(totalPages, previous + 1),
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =====================================================
    URL MODAL
===================================================== */}

        {showUrlModal && selectedPage && (
          <div
            className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      px-4
    "
            onClick={() => setShowUrlModal(false)}
          >
            <div
              className="
        w-full
        max-w-lg
        rounded-2xl
        border
        border-white/10
        bg-[#111116]
        shadow-2xl
        p-6
      "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Landing Page URL
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Share this landing page with others
                  </p>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
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
                  ×
                </button>
              </div>

              {/* URL */}
              <div
                className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-white/10
          bg-black/40
          p-2
        "
              >
                <input
                  type="text"
                  readOnly
                  value={getLandingPageUrl(selectedPage) || ""}
                  className="
            flex-1
            min-w-0
            bg-transparent
            px-3
            py-2
            text-sm
            text-gray-300
            outline-none
          "
                  onFocus={(e) => e.target.select()}
                />

                <button
                  type="button"
                  onClick={handleCopyUrl}
                  title={copied ? "Copied" : "Copy URL"}
                  className="
    shrink-0
    w-10
    h-10
    rounded-lg
    flex
    items-center
    justify-center
    border
    border-white/10
    bg-transparent
    text-gray-400
    hover:text-white
    hover:bg-white/5
    transition-all
  "
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <DeleteLandingPageModal
          page={deleteTarget}
          deleting={deleting}
          onClose={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={confirmDeletePage}
        />
      </div>
    </>
  );
};
export default Container;
