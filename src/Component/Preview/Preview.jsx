import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { FaDesktop } from "react-icons/fa";

const Preview = ({ aicode, loading }) => {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Web Builder</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f3f3f3; }
    h1 { color: #333; text-align: center; margin-top: 50px; }
  </style>
</head>
<body>
  <h1>Welcome to AI Web Builder</h1>
  <p style="text-align:center;">Your AI-generated website will appear here.</p>
</body>
</html>`);

  const handleOpenNewTab = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  useEffect(() => {
    setCode(aicode);
  }, [aicode]);

  console.log(aicode);
  // console.log(code);

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-4">
      {/* Header */}
      <h2 className="text-center text-gray-200 text-lg sm:text-xl font-medium mb-4">
        Your AI-Generated Website will appear here.
      </h2>

      {/* Preview Container */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md relative overflow-hidden">
        {/* Top bar with buttons */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-gray-800">
          <span className="text-gray-400 font-semibold text-sm">
            Live Preview
          </span>

          <div className="flex gap-2">
            <button onClick={handleOpenNewTab}>
              <a
                href="#"
                // target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 text-sm transition"
              >
                Open in new tab
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3h7v7m0-7L10 14"
                  />
                </svg>
              </a>
            </button>

            <a
              href="#"
              download
              className="flex items-center gap-1 px-3 py-1 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 text-sm transition"
            >
              Download
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v4h16v-4M12 12v8m0-8l-4 4m4-4l4 4"
                />
              </svg>
            </a>
            {/* Show Code Button */}
            <button
              className="flex items-center gap-1 px-3 py-1 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 text-sm transition"
              onClick={() => setShowCode(!showCode)} // Replace with your code modal/function
            >
              {showCode ? (
                <div className="flex items-center">
                  <p>Hide Code</p>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 18l6-6-6-6M8 6l-6 6 6 6"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex items-center">
                  <p>Show Code</p>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 18l6-6-6-6M8 6l-6 6 6 6"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Iframe / Preview Area */}

        {loading ? (
          <div className="w-full h-80 sm:h-96 md:h-[500px] flex flex-col items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 text-sm">
              Generating your AI website...
            </p>
          </div>
        ) : showCode ? (
          <Editor
            height="90vh"
            theme="vs-dark"
            defaultLanguage="html"
            value={code}
          />
        ) : (
          <iframe
            srcDoc={code} // Replace with AI-generated preview URL
            title="AI Website Preview"
            className="w-full h-80 sm:h-96 md:h-[500px] border-0 bg-gray-900"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Preview;
