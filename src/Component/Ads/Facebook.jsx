import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";
import ReactMarkdown from "react-markdown";
import { getIcon } from "../../utils/iconMatcher";
import AdsRenderer from "../AdsRenderer/AdsRenderer";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useMemo } from "react";

const RenderAnalysis = ({ data, level = 1 }) => {
  if (data === null || data === undefined) return null;

  // Primitive values
  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return (
      <p className="text-[17px] leading-8 text-gray-200 whitespace-pre-wrap ml-7">
        {String(data)}
      </p>
    );
  }

  // Array
  if (Array.isArray(data)) {
    return (
      // <ul className="list-disc ml-6 space-y-2">
      <ul className="list-disc ml-10 space-y-3 text-[17px] text-gray-200">
        {data.map((item, index) => (
          <li key={index}>
            <RenderAnalysis data={item} level={level} />
          </li>
        ))}
      </ul>
    );
  }

  // Object
  return (
    <div className="space-y-7">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          {level === 1 && (
            // <h1 className="text-4xl font-bold mt-8 mb-3 capitalize">
            //   {key.replace(/([A-Z])/g, " $1")}
            // </h1>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white mt-8 mb-3 capitalize">
              <span>{getIcon(key)}</span>
              {key.replace(/([A-Z])/g, " $1")}
            </h1>
          )}

          {level === 2 && (
            // <h2 className="text-3xl font-bold mt-6 mb-2 capitalize">
            //   {key.replace(/([A-Z])/g, " $1")}
            // </h2>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-300 mt-6 mb-2 capitalize">
              <span>{getIcon(key)}</span>
              {key.replace(/([A-Z])/g, " $1")}
            </h2>
          )}

          {level >= 3 && (
            // <h3 className="text-2xl font-bold mt-4 mb-2 capitalize">
            //   {key.replace(/([A-Z])/g, " $1")}
            // </h3>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-100 mt-4 mb-2 capitalize">
              <span>{getIcon(key)}</span>
              {key.replace(/([A-Z])/g, " $1")}
            </h3>
          )}

          <RenderAnalysis data={value} level={level + 1} />
        </div>
      ))}
    </div>
  );
};

const Facebook = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [hasAIResponse, setHasAIResponse] = useState(false);
  const [variations, setVariations] = useState([]);
  const [variationLoading, setVariationLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showTools, setShowTools] = useState(false);
  const [competitorMode, setCompetitorMode] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const { loadHistory, selectedChat } = useOutletContext();
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [popupPosition, setPopupPosition] = useState("bottom");
  const [isTyping, setIsTyping] = useState(false);
  const [adsLoading, setAdsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [adsResult, setAdsResult] = useState(null);
  const [agentMode, setAgentMode] = useState(null);
  const [country, setCountry] = useState([]);

  const [generatedAds, setGeneratedAds] = useState({
    meta: null,
    google: null,
    tiktok: null,
  });
  const [activeAdType, setActiveAdType] = useState(null);
  const countryOptions = useMemo(() => countryList().getData(), []);

  // const customSelectStyles = {
  //   control: (base) => ({
  //     ...base,
  //     backgroundColor: "#1f2937",
  //     borderColor: "#374151",
  //     boxShadow: "none",
  //     minHeight: "50px",
  //   }),

  //   menu: (base) => ({
  //     ...base,
  //     backgroundColor: "#111827",
  //   }),

  //   option: (base, state) => ({
  //     ...base,
  //     backgroundColor: state.isFocused ? "#374151" : "#111827",
  //     color: "#fff",
  //     cursor: "pointer",
  //   }),

  //   singleValue: (base) => ({
  //     ...base,
  //     color: "#fff",
  //   }),

  //   input: (base) => ({
  //     ...base,
  //     color: "#fff",
  //   }),

  //   placeholder: (base) => ({
  //     ...base,
  //     color: "#9ca3af",
  //   }),
  // };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: "#374151",
      boxShadow: "none",
      minHeight: "50px",
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#111827",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#374151" : "#111827",
      color: "#fff",
      cursor: "pointer",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),

    input: (base) => ({
      ...base,
      color: "#fff",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),

    // 👇 এগুলো নতুন add করো
    multiValue: (base) => ({
      ...base,
      backgroundColor: "transparent",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
      backgroundColor: "transparent",
      padding: 0,
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "#9ca3af",
      backgroundColor: "transparent",
      ":hover": {
        backgroundColor: "transparent",
        color: "#fff",
      },
    }),
  };

  const inputRef = useRef(null);
  const toolsRef = useRef(null);
  const textareaRef = useRef(null);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!selectedChat) return;

    setMessages(selectedChat.messages || []);

    setConversationId(selectedChat._id);
  }, [selectedChat]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];

    if (lastMsg?.role === "ai" && lastMsg?.type === "analysis") {
      setHasAIResponse(true);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (competitorMode === "link") {
      setCompetitorUrl("");
      setUrlError("");
    }
  }, [competitorMode]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleGenerate = async () => {
    setHasAIResponse(false);
    setShowVariations(false);
    setVariations([]);
    setSelectedAd(null);

    if (loading) return;

    if (!prompt.trim() && !competitorUrl.trim()) return;

    if (competitorMode === "link") {
      if (!competitorUrl.trim() && !prompt.trim()) {
        setUrlError("Please provide URL or prompt");
        return;
      }

      // URL exists but invalid → block
      if (competitorUrl.trim() && !isValidUrl(competitorUrl)) {
        setUrlError("Please enter a valid URL");
        return;
      }
    }

    const currentPrompt = prompt;

    const currentUrl = competitorUrl;

    setPrompt("");
    setCompetitorUrl("");

    const userMessage = {
      role: "user",
      content: currentPrompt || currentUrl || "",
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/generate-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          url: currentUrl,
          mode: agentMode,
          conversationId,
          country: country.map((item) => item.label),
        }),
      });

      const data = await res.json();

      setAnalysisData(data.data);

      console.log("Response from server:", data.data);
      console.log("Response type:", data.type);

      if (!res.ok) {
        throw new Error(data.message || "Server Error");
      }

      if (data.conversationId) {
        console.log("Received ID =", data.conversationId);
        setConversationId(data.conversationId);
      }

      console.log("conversion id", conversationId);

      await loadHistory();

      if (data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "chat",
            content: data.data?.reply || "",
          },
        ]);
      } else if (data.type === "analysis") {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "analysis",
            content: data.data,
          },
        ]);
        setHasAIResponse(true);
      } else if (data.type === "error") {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "error",
            content: data.message,
          },
        ]);
      }
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          type: "error",
          content: "❌ Server error",
        },
      ]);
    } finally {
      setIsTyping(false);
      setLoading(false);
      setPrompt("");
      setCompetitorUrl("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "0px";
      }
    }
  };

  const handleGenerateVariation = async () => {
    try {
      setVariationLoading(true);
      setHasAIResponse(false);

      if (!analysisData) return;

      const res = await fetch("http://localhost:5000/generate-variations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: analysisData,
          activeAdType: activeAdType,
        }),
      });

      if (!res.ok) {
        throw new Error("Variation API Failed");
      }

      const data = await res.json();

      console.log("Variation Response:", data);

      // ✅ SAFE ARRAY CHECK
      const safeVariations = Array.isArray(data.variations)
        ? data.variations
        : [];

      setVariations(safeVariations);
      setShowVariations(true);
    } catch (err) {
      console.log(err);
      setVariations([]);
    } finally {
      setVariationLoading(false);
    }
  };

  const handleGenerateMetaAds = async () => {
    try {
      setAdsLoading(true);

      if (!analysisData) return;

      const res = await fetch(
        "http://localhost:5000/generate-socialmedia-ads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ad: analysisData,
            conversationId,
            addType: "meta_ads",
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Server Error Try again later.");
      }

      const data = await res.json();

      console.log("Meta Ads Response:", data);

      setGeneratedAds((prev) => ({
        ...prev,
        meta: data.data,
      }));

      setActiveAdType("meta");

      // Automatically open sidebar
      setSelectedAd(data.data);
    } catch (err) {
      console.log(err);
      setAdsResult({
        role: "ai",
        type: "error",
        content: "❌ Failed to generate Meta Ads. Try again later.",
      });
    } finally {
      setAdsLoading(false);
    }
  };

  const handleGenerateGoogleAds = async () => {
    try {
      setAdsLoading(true);

      if (!analysisData) return;

      const res = await fetch(
        "http://localhost:5000/generate-socialmedia-ads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ad: analysisData,
            conversationId,
            addType: "google_ad",
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Google Ads API Failed");
      }

      const data = await res.json();

      console.log("Google Ads Response:", data);

      setGeneratedAds((prev) => ({
        ...prev,
        google: data.data,
      }));

      setActiveAdType("google");

      setSelectedAd(data.data);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          type: "error",
          content: "❌ Failed to generate Google Ads. Try again later.",
        },
      ]);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleGenerateTiktokAds = async () => {
    try {
      setAdsLoading(true);

      if (!analysisData) return;

      const res = await fetch(
        "http://localhost:5000/generate-socialmedia-ads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ad: analysisData,
            conversationId,
            addType: "tiktok_ads",
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Tiktok Ads API Failed");
      }

      const data = await res.json();

      console.log("Tiktok Ads Response:", data);

      setGeneratedAds((prev) => ({
        ...prev,
        tiktok: data.data,
      }));

      setActiveAdType("tiktok");

      setSelectedAd(data.data);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          type: "error",
          content: "❌ Failed to generate Tiktok Ads. Try again later.",
        },
      ]);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleToggleTools = () => {
    setShowTools((prev) => {
      const next = !prev;

      if (!prev && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;

        if (spaceBelow < 200) {
          setPopupPosition("top");
        } else {
          setPopupPosition("bottom");
        }
      }

      return next;
    });
  };

  const seeDetails = (ad) => {
    setSelectedAd(ad);
  };

  return (
    <div className="h-full bg-black flex overflow-hidden ">
      {/* MAIN SECTION */}
      <div
        className={`transition-all duration-500 ease-in-out flex ${
          selectedAd ? "w-2/3 justify-start px-6" : "w-full justify-center px-4"
        }`}
      >
        {/* <div className="w-full max-w-4xl h-screen flex flex-col"> */}
        <div className="w-full max-w-4xl h-full flex flex-col">
          {messages.length === 0 && (
            <div className="flex flex-col items-center mt-32 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
                🚀 Generate Your Ads Creative
              </h1>

              <p className="text-gray-300 text-center mb-8 max-w-xl mx-auto">
                Create stunning ad creatives effortlessly.
              </p>
            </div>
          )}

          {/* <div className="flex-1 flex flex-col overflow-hidden "> */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {messages.length > 0 && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* <div className="flex-1 mt-8 space-y-4 overflow-y-auto pr-2"> */}
                <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`w-full flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
    break-all
    whitespace-pre-wrap

    ${
      msg.role === "user"
        ? "max-w-[70%] p-4 rounded-2xl bg-gray-800 text-white border border-gray-700"
        : "w-full text-gray-200 leading-relaxed"
    }
  `}
                      >
                        {/* ================= USER ================= */}
                        {msg.role === "user" ? (
                          <p>{msg.content}</p>
                        ) : (
                          <>
                            {/* ================= ERROR ================= */}
                            {msg.type === "error" && (
                              <p className="text-red-400">{msg.content}</p>
                            )}

                            {/* ================= CHAT ================= */}

                            {msg.type === "chat" && (
                              <div className="text-white text-xl">
                                <ReactMarkdown
                                  components={{
                                    h1: ({ children }) => (
                                      <h1 className="text-4xl font-bold mt-4 mb-1">
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2 className="text-3xl font-bold mt-3 mb-1">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }) => (
                                      <h3 className="text-2xl font-bold mt-2 mb-1">
                                        {children}
                                      </h3>
                                    ),
                                    p: ({ children }) => (
                                      <p className="mb-2">{children}</p>
                                    ),
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            )}

                            {/* ================= ANALYSIS ================= */}

                            {msg.type === "analysis" && msg.content && (
                              <div className="text-white text-xl">
                                {msg.content.reply ? (
                                  <ReactMarkdown>
                                    {msg.content.reply}
                                  </ReactMarkdown>
                                ) : (
                                  <RenderAnalysis data={msg.content} />
                                )}
                              </div>
                            )}

                            {/* SCORE CARD */}

                            {msg.score && (
                              <div className="bg-green-900 p-4 rounded-xl border border-green-600">
                                <h3 className="text-lg font-bold text-green-300 mb-3">
                                  📊 Landing Page Score
                                </h3>

                                <p>
                                  <b>Overall Score:</b> {msg.score.overallScore}
                                  /100
                                </p>
                              </div>
                            )}

                            {/* RECOMMENDATIONS */}

                            {msg.recommendations?.length > 0 && (
                              <div className="bg-gray-900 p-4 rounded-xl border border-yellow-600">
                                <h3 className="text-lg font-bold text-yellow-400 mb-3">
                                  💡 Recommendations
                                </h3>

                                <ul className="list-disc ml-5 space-y-2">
                                  {msg.recommendations.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {msg.competitorScore && (
                              <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-3">
                                  🏆 Competitor Score
                                </h3>

                                {/* <pre className="text-sm whitespace-pre-wrap"> */}
                                <pre className="text-sm whitespace-pre-wrap break-all overflow-x-auto">
                                  {JSON.stringify(msg.competitorScore, null, 2)}
                                </pre>
                              </div>
                            )}

                            {msg.agentData && (
                              <div className="bg-gray-900 p-4 rounded-xl border border-blue-600">
                                <h3 className="text-lg font-bold text-blue-400 mb-3">
                                  🤖 AI Agent Analysis
                                </h3>

                                {/* <pre className="text-sm whitespace-pre-wrap"> */}
                                <pre className="text-sm whitespace-pre-wrap break-all overflow-hidden">
                                  {JSON.stringify(msg.agentData, null, 2)}
                                </pre>
                              </div>
                            )}

                            {msg.similarCompetitors?.length > 0 && (
                              <div className="bg-gray-900 p-4 rounded-xl border border-pink-600">
                                <h3 className="text-lg font-bold text-pink-400 mb-3">
                                  🔍 Similar Competitors
                                </h3>

                                {msg.similarCompetitors.map((comp, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-700 rounded p-3 mb-2"
                                  >
                                    <p>
                                      <b>Product:</b> {comp.whatTheySell}
                                    </p>

                                    <p>
                                      <b>Audience:</b> {comp.targetAudience}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {variationLoading ? (
                              <div className="flex justify-center mt-4">
                                <div className="bg-gray-800 p-4 rounded-2xl text-white">
                                  Generating variations...
                                </div>
                              </div>
                            ) : (
                              showVariations && (
                                <div className="mt-10 w-full">
                                  <h2 className="text-xl text-white mb-4">
                                    Facebook Ad Variations
                                  </h2>

                                  <div
                                    className={`grid gap-4 ${
                                      selectedAd
                                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                                    }`}
                                  >
                                    {/* ✅ SAFE MAP */}
                                    {Array.isArray(variations) &&
                                    variations.length > 0 ? (
                                      variations.map((ad, i) => (
                                        <div
                                          key={i}
                                          className="bg-gray-900 p-4 rounded-xl border border-gray-700"
                                        >
                                          <span className="text-xs bg-gray-700 px-2 py-1 rounded text-white">
                                            {ad.type || "Variation"}
                                          </span>

                                          <p className="text-white mt-3">
                                            <b>🚀 Headline:</b> {ad.headline}
                                          </p>

                                          <button
                                            onClick={() => seeDetails(ad)}
                                            className="mt-4 text-xs px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                                          >
                                            See Details
                                          </button>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-gray-400">
                                        No variations found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-900 border border-gray-700 px-4 py-3 rounded-2xl flex gap-1 items-center">
                        <span className="text-gray-300 text-sm">
                          AI is typing
                        </span>

                        <span className="flex gap-1 ml-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef}></div>
                </div>

                {/* GENERATE VARIATIONS BUTTON */}
                {/* {hasAIResponse && !variationLoading && (
                  <div className="mt-4 flex justify-start">
                    <button
                      onClick={handleGenerateVariation}
                      className="
        flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm
      "
                    >
                      <span>✨</span>
                      <span>Generate ad variations</span>
                    </button>
                  </div>
                )} */}

                {hasAIResponse && !adsLoading && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {!generatedAds.meta ? (
                      <button
                        onClick={handleGenerateMetaAds}
                        className="flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm"
                      >
                        ✨ Generate Meta Ads
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateVariation}
                        className="flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm"
                      >
                        ✨ Generate Ad Variations
                      </button>
                    )}

                    {!generatedAds.google ? (
                      <button
                        onClick={handleGenerateGoogleAds}
                        className="flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm"
                      >
                        ✨ Generate Google Ads
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateVariation}
                        className="flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm"
                      >
                        ✨ Generate Ad Variations
                      </button>
                    )}

                    {!generatedAds.tiktok ? (
                      <button
                        onClick={handleGenerateTiktokAds}
                        className="flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm"
                      >
                        ✨ Generate Tiktok Ads
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateVariation}
                        className="flex items-center gap-2
        px-4 py-2
        rounded-full
        border border-gray-700
        bg-[#1f1f1f]
        text-gray-200
        text-sm"
                      >
                        ✨ Generate Ad Variations
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Input Box */}
            <div
              ref={inputRef}
              className="
  shrink-0
  w-full
  bg-gray-900
  rounded-2xl
  p-3
  flex
  flex-col
  relative
"
            >
              {/* TOOLS */}
              {showTools && (
                <div
                  ref={toolsRef}
                  className={`absolute left-0 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-visible ${
                    popupPosition === "bottom"
                      ? "top-full mt-1 translate-y-[-12px]"
                      : "bottom-full mb-1 translate-y-[12px]"
                  }`}
                >
                  <div className="relative group">
                    <button className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition border-b border-gray-700 flex justify-between items-center">
                      <span>🔍 Competitor intelligence</span>
                    </button>

                    <div className="absolute left-full top-0 ml-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <button
                        onClick={() => {
                          // setCompetitorMode("link");
                          setAgentMode("link");
                          setCompetitorUrl(""); // Clear previous URL
                          setUrlError(""); // Clear old error
                          setShowTools(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 border-b border-gray-700"
                      >
                        🔗 From URL
                      </button>

                      <button
                        onClick={() => {
                          // setCompetitorMode("addCopy");
                          setAgentMode("addCopy");
                          setShowTools(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-gray-800"
                      >
                        📝 From Ad Copy
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAgentMode("Trending_offers");
                      setCountry("");
                      setShowTools(false);
                    }}
                    className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition border-b border-gray-700 flex justify-between items-center"
                  >
                    <span>🔥Trending Offers</span>
                  </button>
                </div>
              )}

              {agentMode === "link" && (
                <>
                  <input
                    type="text"
                    placeholder="Paste competitor URL (optional)..."
                    value={competitorUrl}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCompetitorUrl(value);

                      // only validate if user types something
                      if (value.trim() && !isValidUrl(value)) {
                        setUrlError("Please enter a valid URL");
                      } else {
                        setUrlError("");
                      }
                    }}
                    className="
        w-full
        p-3
        mb-1
        bg-gray-800
        text-white
        rounded-xl
        border
        border-gray-700
        focus:outline-none
        focus:border-purple-500
      "
                  />
                  {urlError && (
                    <p className="text-red-500 text-sm mb-2">⚠ {urlError}</p>
                  )}
                </>
              )}

              {agentMode === "Trending_offers" && (
                <div className="mb-2">
                  <Select
                    styles={customSelectStyles}
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) => option.value === country,
                    )}
                    onChange={(option) => setCountry(option.value)}
                    placeholder="Search country..."
                    isSearchable
                    isMulti
                  />
                </div>
              )}

              {agentMode !== "Trending_offers" && (
                <textarea
                  rows={1}
                  className="w-full p-3 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-lg"
                  ref={textareaRef}
                  placeholder={
                    agentMode === "link"
                      ? "Paste competitor URL here..."
                      : agentMode === "addCopy"
                        ? "Paste competitor ad copy here..."
                        : "Type your offer or product description here..."
                  }
                  value={prompt}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  onChange={(e) => {
                    setPrompt(e.target.value);

                    // Hide variation button on new input
                    setHasAIResponse(false);

                    // Hide old variations
                    setShowVariations(false);
                  }}
                />
              )}

              {/* FOOTER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* PLUS BUTTON */}
                  <button
                    // onClick={() => setShowTools(!showTools)}
                    onClick={handleToggleTools}
                    className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-2xl flex items-center justify-center transition"
                  >
                    +
                  </button>

                  {/* MODE BADGE */}
                  {agentMode && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-white">
                        {agentMode === "link"
                          ? "🔗 URL Mode"
                          : agentMode === "Trending_offers"
                            ? "Trending offers"
                            : "Add copy"}
                      </span>
                      <button
                        onClick={() => {
                          // setCompetitorMode(null);
                          setAgentMode(null);
                          setCompetitorUrl("");
                          setUrlError("");
                        }}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>

                {/* SEND BUTTON */}

                <button
                  onClick={handleGenerate}
                  disabled={
                    loading ||
                    (competitorMode === "link" &&
                      competitorUrl.trim() &&
                      !isValidUrl(competitorUrl))
                  }
                  className={`
  p-3 rounded-full shadow-lg transition
  ${
    loading ||
    (competitorMode === "link" &&
      competitorUrl.trim() &&
      !isValidUrl(competitorUrl))
      ? "bg-gray-700 cursor-not-allowed opacity-50"
      : "bg-gray-800 hover:scale-105"
  }
`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      {selectedAd && (
        <div className="w-1/3 bg-gray-900 border-l border-gray-700 p-6 h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Ad Details</h2>

            <button
              onClick={() => {
                setCompetitorMode(null);
                setCompetitorUrl("");
                setUrlError("");
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              ✖
            </button>
          </div>

          {/* <div className="space-y-4 text-gray-200">
            {Object.entries(selectedAd).map(([key, value]) => (
              <div key={key}>
                <p className="font-semibold capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>

                <p className="text-gray-300">{String(value)}</p>
              </div>
            ))}
          </div> */}

          <div className="space-y-4 text-gray-200">
            <AdsRenderer data={selectedAd} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Facebook;
