
import React from "react";

const TITLE_MAP = {
  // Meta
  type: "📦 Ad Type",
  headline: "🚀 Headline",
  primaryText: "📝 Primary Text",
  description: "📄 Description",
  targetAudience: "🎯 Target Audience",
  targetAge: "👥 Target Age",
  targetGender: "⚧ Gender",
  interests: "❤️ Interests",
  budget: "💰 Budget",
  imagePrompt: "🎨 Image Prompt",

  // Google
  searchAd: "🔍 Google Search Ad",
  displayAd: "🖼 Google Display Ad",
  headlines: "🚀 Headlines",
  descriptions: "📝 Descriptions",
  keywords: "🔑 Keywords",
  longHeadline: "📢 Long Headline",
  cta: "👉 Call To Action",

  // TikTok
  data: "🎵 TikTok Ad",
  hook: "🔥 Hook",
  caption: "📱 Caption",
  hashtags: "#️⃣ Hashtags",
  videoDuration: "⏱ Video Duration",
  videoPrompt: "🎬 Video Prompt",
};

const BIG_SECTIONS = ["searchAd", "displayAd", "data"];

const AdsRenderer = ({ data, level = 1 }) => {
  if (data === null || data === undefined) return null;

  // Primitive values
  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return (
      <p className="text-gray-300 whitespace-pre-wrap leading-8 text-lg">
        {String(data)}
      </p>
    );
  }

  // Arrays
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-300">
        {data.map((item, index) => (
          <li key={index}>
            <AdsRenderer data={item} level={level} />
          </li>
        ))}
      </ul>
    );
  }

  // Objects
  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => {
        const title = TITLE_MAP[key] || key.replace(/([A-Z])/g, " $1");

        return (
          <div key={key}>
            {/* Main Section */}
            {BIG_SECTIONS.includes(key) && (
              <h1 className="text-4xl font-bold text-white mt-8 mb-6 border-b border-gray-700 pb-3">
                {title}
              </h1>
            )}

            {/* Normal Heading */}
            {!BIG_SECTIONS.includes(key) &&
              typeof value === "object" &&
              value !== null && (
                <h2 className="text-2xl font-bold text-blue-400 mt-6 mb-3">
                  {title}
                </h2>
              )}

            {/* Primitive Title */}
            {typeof value !== "object" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

                <AdsRenderer data={value} level={level + 1} />
              </>
            )}

            {/* Nested Object */}
            {typeof value === "object" &&
              value !== null &&
              !Array.isArray(value) && (
                <AdsRenderer data={value} level={level + 1} />
              )}

            {/* Array */}
            {Array.isArray(value) && (
              <>
                <AdsRenderer data={value} level={level + 1} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdsRenderer;
