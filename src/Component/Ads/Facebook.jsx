// import React, { useState, useRef, useEffect } from "react";

// const Facebook = () => {
//   const [prompt, setPrompt] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showVariations, setShowVariations] = useState(false);
//   const [hasAIResponse, setHasAIResponse] = useState(false);
//   const [variations, setVariations] = useState([]);
//   const [variationLoading, setVariationLoading] = useState(false);
//   const [selectedAd, setSelectedAd] = useState(null);
//   const [showTools, setShowTools] = useState(false);
//   const [competitorMode, setCompetitorMode] = useState(null);

//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const handleGenerate = async () => {
//     if (!prompt.trim()) return;

//     setShowVariations(false);
//     const userMessage = {
//       role: "user",
//       content: prompt,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/facebook-ads", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!res.ok) throw new Error("Server Error");
//       const data = await res.json();
//       const aiMessage = {
//         role: "ai",
//         content: data,
//       };
//       setMessages((prev) => [...prev, aiMessage]);
//       setHasAIResponse(true);
//     } catch (err) {
//       console.log(err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: {
//             error: "❌ Failed to generate ad",
//           },
//         },
//       ]);
//     } finally {
//       setLoading(false);
//       setPrompt("");
//     }
//   };

//   const handleGenerateVariation = async () => {
//     try {
//       setVariationLoading(true);
//       setHasAIResponse(false);
//       const lastAd = messages[messages.length - 1];
//       const res = await fetch("http://localhost:5000/generate-variations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ad: lastAd.content,
//         }),
//       });
//       const data = await res.json();

//       setVariations(data.variations || []);
//       setShowVariations(true);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setVariationLoading(false);
//     }
//   };

//   const seeDetails = (ad) => {
//     setSelectedAd(ad);
//   };

//   return (
//     <div className="min-h-svh bg-black flex overflow-hidden">
//       {/* MAIN SECTION */}
//       <div
//         className={`transition-all duration-500 ease-in-out flex ${
//           selectedAd ? "w-2/3 justify-start px-6" : "w-full justify-center px-4"
//         }`}
//       >
//         <div className="w-full max-w-4xl py-6">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
//             🚀 Generate Your Facebook Ad
//           </h1>

//           <p className="text-gray-300 text-center mb-8 max-w-xl mx-auto">
//             Create stunning Facebook ad creatives effortlessly. Just enter your
//             offer description and hit generate!
//           </p>

//           {/* CHAT */}
//           <div className="w-full relative">
//             <div className="w-full mt-8 space-y-4 overflow-y-auto max-h-[500px] pr-2">
//               {messages?.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     msg.role === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`p-4 rounded-2xl max-w-[85%] ${
//                       msg.role === "user"
//                         ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
//                         : "bg-gray-800 text-gray-200"
//                     }`}
//                   >
//                     {msg.role === "user" ? (
//                       <p>{msg.content}</p>
//                     ) : msg.content.error ? (
//                       <p className="text-red-400">{msg.content.error}</p>
//                     ) : (
//                       <div className="space-y-2 text-sm leading-relaxed">
//                         <p>
//                           <b>🚀 Headline:</b> {msg.content.headline}
//                         </p>
//                         <p>
//                           <b>📝 Primary Text:</b> {msg.content.primaryText}
//                         </p>
//                         <p>
//                           <b>👤 Target Age:</b> {msg.content.targetAge}
//                         </p>
//                         <p>
//                           <b>⚧ Target Gender:</b> {msg.content.targetGender}
//                         </p>
//                         <p>
//                           <b>💰 Budget:</b> {msg.content.budget}
//                         </p>
//                         <p>
//                           <b>🎯 Audience:</b> {msg.content.targetAudience}
//                         </p>
//                         <p>
//                           <b>🎯 Interests:</b> {msg.content.interests}
//                         </p>
//                         <p>
//                           <b>📄 Description:</b> {msg.content.description}
//                         </p>
//                         <p>
//                           <b>🖼 Image Prompt:</b> {msg.content.imagePrompt}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {loading && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-800 p-4 rounded-2xl text-white">
//                     Typing...
//                   </div>
//                 </div>
//               )}

//               <div ref={bottomRef}></div>
//             </div>

//             {/* VARIATIONS BUTTON */}
//             {hasAIResponse && !variationLoading && (
//               <div className="mt-6 flex justify-center">
//                 <button
//                   onClick={handleGenerateVariation}
//                   className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:scale-105 transition"
//                 >
//                   ⚡ Generate 5 New Variations
//                 </button>
//               </div>
//             )}

//             {/* VARIATIONS */}
//             {variationLoading ? (
//               <div className="flex justify-center mt-4">
//                 <div className="bg-gray-800 p-4 rounded-2xl text-white">
//                   Generating variations...
//                 </div>
//               </div>
//             ) : (
//               showVariations && (
//                 <div className="mt-10 w-full">
//                   <h2 className="text-xl text-white mb-4">
//                     Facebook Ad Variations
//                   </h2>

//                   <div
//                     className={`grid gap-4 ${
//                       selectedAd
//                         ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
//                         : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
//                     }`}
//                   >
//                     {variations?.map((ad, i) => (
//                       <div
//                         key={i}
//                         className="bg-gray-900 p-4 rounded-xl border border-gray-700"
//                       >
//                         <span className="text-xs bg-purple-600 px-2 py-1 rounded text-white">
//                           {ad.type}
//                         </span>

//                         <p className="text-white mt-3">
//                           <b>🚀 Headline:</b> {ad.headline}
//                         </p>

//                         <button
//                           onClick={() => seeDetails(ad)}
//                           className="mt-4 text-xs px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
//                         >
//                           See Details
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )
//             )}

//             {/* INPUT AREA */}
//             {/* <div className="relative mt-10 w-full"> */}
//             <div className="mt-10 w-full bg-gray-900 rounded-2xl p-3 flex flex-col gap-2">
//               {showTools && (
//                 <div className="absolute bottom-24 left-0 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-visible">
//                   <div className="relative group">
//                     <button className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition border-b border-gray-700 flex justify-between items-center">
//                       <span>🔍 Competitor Analysis</span>
//                       <span>›</span>
//                     </button>

//                     <div className="absolute left-full top-0 ml-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                       <button
//                         onClick={() => {
//                           setCompetitorMode("link");
//                           // setShowCompetitorBox(true);
//                           setShowTools(false);
//                         }}
//                         className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 border-b border-gray-700"
//                       >
//                         🔗 From URL
//                       </button>

//                       <button
//                         onClick={() => {
//                           setCompetitorMode("addCopy");
//                           // setActiveTool("competitor-url");
//                           setShowTools(false);
//                         }}
//                         className="w-full text-left px-4 py-3 text-white hover:bg-gray-800"
//                       >
//                         📝 From Ad Copy
//                       </button>
//                     </div>
//                   </div>

//                   <button className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition border-t border-gray-700">
//                     ✨ More Features Coming
//                   </button>
//                 </div>
//               )}

//               {/* MODE BADGE (ChatGPT style) */}

//               <textarea
//                 className="w-full p-3 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-lg"
//                 // className="w-full p-4  pb-20 pr-20 rounded-2xl bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-lg"
//                 rows={2}
//                 placeholder={
//                   competitorMode === "link"
//                     ? "Paste competitor URL here..."
//                     : competitorMode === "addCopy"
//                       ? "Paste competitor ad copy here..."
//                       : "Type your offer or product description here..."
//                 }
//                 value={prompt}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleGenerate();
//                   }
//                 }}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setPrompt(value);
//                 }}
//               />

//                 {/* PLUS BUTTON */}
//                  <div className="flex">
//                 <button
//                   onClick={() => setShowTools(!showTools)}
//                   className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-2xl flex items-center justify-center transition z-20"
//                 >
//                   +
//                 </button>

//                 {/* MODE BADGE */}
//                 {competitorMode && (
//                   <div className="flex items-center gap-2">
//                     <span className="px-3 py-1 text-xs rounded-full bg-purple-600 text-white">
//                       {competitorMode === "link"
//                         ? "🔗 URL Mode"
//                         : "📝 Ad Copy Mode"}
//                     </span>

//                     <button
//                       onClick={() => setCompetitorMode(null)}
//                       className="text-xs text-gray-400 hover:text-white"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 className="absolute bottom-4 right-4  bg-gray-800 p-3 rounded-full shadow-lg hover:scale-105 transform transition z-20"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-white"
//                   fill="none"
//                   viewBox="0 0 20 20"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 12h14M12 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDEBAR */}
//       {selectedAd && (
//         <div className="w-1/3 bg-gray-900 border-l border-gray-700 p-6 h-screen overflow-y-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-white">Ad Details</h2>
//             <button
//               onClick={() => setSelectedAd(null)}
//               className="text-gray-400 hover:text-white text-xl"
//             >
//               ✖
//             </button>
//           </div>

//           <div className="space-y-4 text-gray-200">
//             <p>
//               <b>🚀 Headline:</b> {selectedAd.headline}
//             </p>
//             <p>
//               <b>📝 Primary Text:</b> {selectedAd.primaryText}
//             </p>
//             <p>
//               <b>👤 Target Age:</b> {selectedAd.targetAge}
//             </p>
//             <p>
//               <b>⚧ Gender:</b> {selectedAd.targetGender}
//             </p>
//             <p>
//               <b>💰 Budget:</b> {selectedAd.budget}
//             </p>
//             <p>
//               <b>🎯 Audience:</b> {selectedAd.targetAudience}
//             </p>
//             <p>
//               <b>🎯 Interests:</b> {selectedAd.interests}
//             </p>
//             <p>
//               <b>📄 Description:</b> {selectedAd.description}
//             </p>
//             <p>
//               <b>🖼 Image Prompt:</b> {selectedAd.imagePrompt}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Facebook;

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
  const [showTools, setShowTools] = useState(false);
  const [competitorMode, setCompetitorMode] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // GENERATE MAIN AD
  // =========================

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
        body: JSON.stringify({ prompt, mode: competitorMode, }),
      });

      if (!res.ok) {
        throw new Error("Server Error");
      }

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

  // =========================
  // GENERATE VARIATIONS
  // =========================

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

  // =========================
  // SEE DETAILS
  // =========================

  const seeDetails = (ad) => {
    setSelectedAd(ad);
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* MAIN SECTION */}
      <div
        className={`transition-all duration-500 ease-in-out flex ${
          selectedAd ? "w-2/3 justify-start px-6" : "w-full justify-center px-4"
        }`}
      >
        <div className="w-full max-w-4xl py-6">
          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
            🚀 Generate Your Facebook Ad
          </h1>

          <p className="text-gray-300 text-center mb-8 max-w-xl mx-auto">
            Create stunning Facebook ad creatives effortlessly.
          </p>

          {/* CHAT */}
          <div className="w-full relative">
            <div className="w-full mt-8 space-y-4 overflow-y-auto max-h-[500px] pr-2">
              {messages.map((msg, index) => (
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:scale-105 transition"
                >
                  ⚡ Generate 5 New Variations
                </button>
              </div>
            )}

            {/* VARIATIONS */}
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
                    {Array.isArray(variations) && variations.length > 0 ? (
                      variations.map((ad, i) => (
                        <div
                          key={i}
                          className="bg-gray-900 p-4 rounded-xl border border-gray-700"
                        >
                          <span className="text-xs bg-purple-600 px-2 py-1 rounded text-white">
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
                      <div className="text-gray-400">No variations found</div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* INPUT AREA */}
            <div className="mt-10 w-full bg-gray-900 rounded-2xl p-3 flex flex-col gap-2 relative">
              {/* TOOLS */}
              {showTools && (
                <div className="absolute bottom-24 left-0 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-visible">
                  <div className="relative group">
                    <button className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition border-b border-gray-700 flex justify-between items-center">
                      <span>🔍 Competitor Analysis</span>
                      
                    </button>

                    <div className="absolute left-full top-0 ml-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <button
                        onClick={() => {
                          setCompetitorMode("link");
                          setShowTools(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-gray-800 border-b border-gray-700"
                      >
                        🔗 From URL
                      </button>

                      <button
                        onClick={() => {
                          setCompetitorMode("addCopy");
                          setShowTools(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-gray-800"
                      >
                        📝 From Ad Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TEXTAREA */}
              <textarea
                className="w-full p-3 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-lg"
                rows={2}
                placeholder={
                  competitorMode === "link"
                    ? "Paste competitor URL here..."
                    : competitorMode === "addCopy"
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
                onChange={(e) => setPrompt(e.target.value)}
              />

              {/* FOOTER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* PLUS BUTTON */}
                  <button
                    onClick={() => setShowTools(!showTools)}
                    className="w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-2xl flex items-center justify-center transition"
                  >
                    +
                  </button>

                  {/* MODE BADGE */}
                  {competitorMode && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-600 text-white">
                        {competitorMode === "link"
                          ? "🔗 URL Mode"
                          : "📝 Ad Copy Mode"}
                      </span>

                      <button
                        onClick={() => setCompetitorMode(null)}
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
                  className="bg-gray-800 p-3 rounded-full shadow-lg hover:scale-105 transform transition"
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
