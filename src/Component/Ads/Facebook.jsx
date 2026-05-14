
import React, { useState, useRef, useEffect } from "react";

const Facebook = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [hasAIResponse, setHasAIResponse] = useState(false);
  const [variations, setVariations] = useState([]);
  const [variationLoading, setVariationLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setShowVariations(false);

    const userMessage = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/facebook-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();

      const aiMessage = {
        role: "ai",
        content: data,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setHasAIResponse(true);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: {
            error: "❌ Failed to generate ad",
          },
        },
      ]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleGenerateVariation = async () => {
    try {
      setVariationLoading(true);
      setHasAIResponse(false);

      const lastAd = messages[messages.length - 1];

      const res = await fetch("http://localhost:5000/generate-variations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: lastAd.content,
        }),
      });

      const data = await res.json();

      setVariations(data.variations || []);
      setShowVariations(true);
    } catch (err) {
      console.log(err);
    } finally {
      setVariationLoading(false);
    }
  };

  const seeDetails = (ad) => {
    setSelectedAd(ad);
  };

  return (
    <div className="min-h-svh bg-black flex overflow-hidden">
      {/* ================= MAIN SECTION ================= */}

      <div
        className={`transition-all duration-500 ease-in-out flex ${
          selectedAd ? "w-2/3 justify-start px-6" : "w-full justify-center px-4"
        }`}
      >
        <div className="w-full max-w-4xl py-6">
          {/* HEADER */}

          <h1
            className="
              text-4xl 
              md:text-5xl 
              font-extrabold 
              text-center 
              bg-clip-text 
              text-transparent
              bg-gradient-to-r 
              from-purple-500 
              to-pink-500 
              mb-4
            "
          >
            🚀 Generate Your Facebook Ad
          </h1>

          <p className="text-gray-300 text-center mb-8 max-w-xl mx-auto">
            Create stunning Facebook ad creatives effortlessly. Just enter your
            offer description and hit generate!
          </p>

          {/* CHAT */}

          <div className="w-full relative">
            <div className="w-full mt-8 space-y-4 overflow-y-auto max-h-[500px] pr-2">
              {messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p>{msg.content}</p>
                    ) : msg.content.error ? (
                      <p className="text-red-400">{msg.content.error}</p>
                    ) : (
                      <div className="space-y-2 text-sm leading-relaxed">
                        <p>
                          <b>🚀 Headline:</b> {msg.content.headline}
                        </p>

                        <p>
                          <b>📝 Primary Text:</b> {msg.content.primaryText}
                        </p>

                        <p>
                          <b>👤 Target Age:</b> {msg.content.targetAge}
                        </p>

                        <p>
                          <b>⚧ Target Gender:</b> {msg.content.targetGender}
                        </p>

                        <p>
                          <b>💰 Budget:</b> {msg.content.budget}
                        </p>

                        <p>
                          <b>🎯 Audience:</b> {msg.content.targetAudience}
                        </p>

                        <p>
                          <b>🎯 Interests:</b> {msg.content.interests}
                        </p>

                        <p>
                          <b>📄 Description:</b> {msg.content.description}
                        </p>

                        <p>
                          <b>🖼 Image Prompt:</b> {msg.content.imagePrompt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* LOADING */}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-4 rounded-2xl text-white">
                    Typing...
                  </div>
                </div>
              )}

              <div ref={bottomRef}></div>
            </div>

            {/* GENERATE VARIATIONS BUTTON */}

            {hasAIResponse && !variationLoading && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleGenerateVariation}
                  className="
                    px-6 
                    py-3 
                    rounded-xl 
                    bg-gradient-to-r 
                    from-purple-500 
                    to-pink-500 
                    text-white 
                    font-medium 
                    shadow-lg 
                    hover:scale-105 
                    transition
                  "
                >
                  ⚡ Generate 5 New Variations
                </button>
              </div>
            )}

            {/* VARIATION LOADING */}

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
                    {variations.map((ad, i) => (
                      <div
                        key={i}
                        className="
                          bg-gray-900 
                          p-4 
                          rounded-xl 
                          border 
                          border-gray-700
                        "
                      >
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded text-white">
                          {ad.type}
                        </span>

                        <p className="text-white mt-3">
                          <b>🚀 Headline:</b> {ad.headline}
                        </p>

                        <button
                          onClick={() => seeDetails(ad)}
                          className="
                            mt-4 
                            text-xs 
                            px-3 
                            py-2 
                            bg-gray-700 
                            hover:bg-gray-600
                            rounded 
                            text-white
                          "
                        >
                          See Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* TEXTAREA */}

            <textarea
              className="
                mt-10 
                w-full 
                p-6 
                rounded-2xl 
                bg-gray-900 
                text-gray-100 
                placeholder-gray-500 
                focus:outline-none 
                focus:ring-2 
                focus:ring-purple-500 
                resize-none 
                text-lg
              "
              rows={3}
              placeholder="Type your offer or product description here..."
              value={prompt}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              onChange={(e) => {
                const value = e.target.value;

                setPrompt(value);

                if (value.trim() === "") {
                  setHasAIResponse(true);
                } else {
                  setHasAIResponse(false);
                  setShowVariations(false);
                }
              }}
            ></textarea>

            {/* GENERATE BUTTON */}

            <button
              onClick={handleGenerate}
              className="
                absolute 
                bottom-4 
                right-4 
                bg-gradient-to-r 
                from-purple-500 
                to-pink-500
                p-4 
                rounded-full 
                shadow-lg 
                hover:scale-105 
                transform 
                transition
                z-20
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
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

      {/* ================= RIGHT SIDEBAR ================= */}

      {selectedAd && (
        <div
          className="
            w-1/3
            bg-gray-900
            border-l
            border-gray-700
            p-6
            h-screen
            overflow-y-auto
            transition-all
            duration-500
          "
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Ad Details</h2>

            <button
              onClick={() => setSelectedAd(null)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✖
            </button>
          </div>

          <div className="space-y-4 text-gray-200">
            <p>
              <b>🚀 Headline:</b> {selectedAd.headline}
            </p>

            <p>
              <b>📝 Primary Text:</b> {selectedAd.primaryText}
            </p>

            <p>
              <b>👤 Target Age:</b> {selectedAd.targetAge}
            </p>

            <p>
              <b>⚧ Gender:</b> {selectedAd.targetGender}
            </p>

            <p>
              <b>💰 Budget:</b> {selectedAd.budget}
            </p>

            <p>
              <b>🎯 Audience:</b> {selectedAd.targetAudience}
            </p>

            <p>
              <b>🎯 Interests:</b> {selectedAd.interests}
            </p>

            <p>
              <b>📄 Description:</b> {selectedAd.description}
            </p>

            <p>
              <b>🖼 Image Prompt:</b> {selectedAd.imagePrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facebook;
