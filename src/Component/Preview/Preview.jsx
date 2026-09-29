
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { FaEdit } from "react-icons/fa";

const Preview = ({ aicode, loading, onEdit, intent ,email }) => {
  const [showCode, setShowCode] = useState(false);

  // =========================================
  // DEPLOYMENT STATE — NEW
  // =========================================

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [showDeployModal, setShowDeployModal] = useState(false);

  const [deploying, setDeploying] = useState(false);

  const [deployError, setDeployError] = useState(""); 

  const [pageName, setPageName] = useState(intent || "My AI Landing Page"); 

  const [affiliateLink, setAffiliateLink] = useState("");

  const [deployedURL, setDeployedURL] = useState("");

  const [copied, setCopied] = useState(false);


  // =========================================
  // DEPLOY LANDING PAGE — NEW
  // =========================================


  const handleDeploy = async () => {
    if (!aicode || deploying) return;

    setDeploying(true);
    setDeployError("");

    try {
      const response = await fetch(`${API_BASE_URL}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: pageName.trim(), 
          html: aicode, 
          affiliateLink: affiliateLink.trim(), 
          intent, 
          email
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to deploy landing page.");
      }

      setDeployedURL(data.url);
    } catch (error) {
      // console.error("Deployment error:", error);
      setDeployError(error.message || "Something went wrong while deploying.");
    } finally {
      setDeploying(false);
    }
  };

  // =========================================
  // COPY DEPLOYED URL — NEW
  // =========================================

  const handleCopyURL = async () => {
    if (!deployedURL) return;

    try {
      await navigator.clipboard.writeText(deployedURL);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy URL failed:", error);
    }
  };

  // Open current AI generated website in a new tab
  const handleOpenNewTab = () => {
    if (!aicode) return;

    const blob = new Blob([aicode], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    // Cleanup object URL after opening
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // Download current website HTML
  const handleDownload = () => {
    if (!aicode) return;

    const blob = new Blob([aicode], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-generated-website.html";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // console.log(aicode);

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-4">
      {/* Header */}
      <h2 className="text-center text-gray-200 text-lg sm:text-xl font-medium mb-4">
        Your AI-Generated Website will appear here.
      </h2>

      {/* Preview Container */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-gray-800">
          <span className="text-gray-400 font-semibold text-sm">
            Live Preview
          </span>

          <div className="flex gap-2">
            {/* Open in New Tab */}
            <button
              onClick={handleOpenNewTab}
              disabled={!aicode}
              className="
                flex
                items-center
                gap-1
                px-3
                py-1
                text-gray-300
                bg-gray-700
                rounded
                hover:bg-gray-600
                text-sm
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
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
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={!aicode}
              className="
                flex
                items-center
                gap-1
                px-3
                py-1
                text-gray-300
                bg-gray-700
                rounded
                hover:bg-gray-600
                text-sm
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
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
            </button>

            {/* Show Code */}
            <button
              className="
                flex
                items-center
                gap-1
                px-3
                py-1
                text-gray-300
                bg-gray-700
                rounded
                hover:bg-gray-600
                text-sm
                transition
              "
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? (
                <div className="flex items-center gap-1">
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
                <div className="flex items-center gap-1">
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

            {/* EDIT */}
            <button
              onClick={onEdit}
              disabled={!aicode}
              className="
                flex
                items-center
                gap-2
                px-3
                py-1.5
               text-gray-300
                bg-gray-700
                rounded
                hover:bg-gray-600
                text-sm
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Edit
              <FaEdit className="text-xs" />
            </button>

            {/* =========================================
    DEPLOY BUTTON — NEW ONLY
    ========================================= */}

            <button
              onClick={() => {
                setDeployError("");
                setDeployedURL("");
                setCopied(false);
                setShowDeployModal(true);
              }}
              disabled={!aicode || deploying}
              className="
    flex
    items-center
    gap-2
    px-3
    py-1.5
    text-gray-300
    bg-gray-700
    rounded
    hover:bg-gray-600
    text-sm
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
            >
              🚀 Deploy
            </button>
          </div>
        </div>

        {/* Preview / Code Area */}

        {loading ? (
          <div className="w-full h-80 sm:h-96 md:h-[500px] flex flex-col items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

            <p className="mt-4 text-gray-400 text-sm">
              Generating your AI website...
            </p>
          </div>
        ) : showCode ? (
          /* Monaco Code Editor */
          <Editor
            height="90vh"
            theme="vs-dark"
            defaultLanguage="html"
            value={aicode}
            options={{
              minimap: {
                enabled: false,
              },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        ) : (
          /* Live Website Preview */
          <iframe
            srcDoc={aicode}
            title="AI Website Preview"
            className="w-full h-80 sm:h-96 md:h-[500px] border-0 bg-gray-900"
          ></iframe>
        )}
      </div>

      {/* =====================================================
    DEPLOY MODAL — NEW ONLY
    ===================================================== */}

      {showDeployModal && (
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
        >
          <div
            className="
        w-full
        max-w-lg
        bg-slate-900
        border
        border-white/10
        rounded-2xl
        shadow-2xl
        overflow-hidden
      "
          >
            {/* Modal Header */}

            <div
              className="
          flex
          items-center
          justify-between
          px-6
          py-4
          border-b
          border-white/10
        "
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Deploy Landing Page
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Publish your generated landing page.
                </p>
              </div>

              <button
                onClick={() => setShowDeployModal(false)}
                className="
            w-8
            h-8
            rounded-lg
            text-gray-400
            hover:text-white
            hover:bg-white/10
          "
              >
                ✕
              </button>
            </div>


            {/* Modal Body */}

            <div className="p-6">
              {!deployedURL ? (
                <>
                  {/* Landing Page Name */}

                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Landing Page Name
                  </label>

                  <input
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    maxLength={120}
                    placeholder="My AI Landing Page"
                    className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-slate-800
                border
                border-white/10
                text-white
                placeholder-gray-500
                outline-none
                focus:border-indigo-500
              "
                  />

                  {/* Affiliate Link */}

                  <label className="block text-sm font-medium text-gray-300 mt-5 mb-2">
                    Affiliate Link
                    <span className="text-gray-500 ml-1">(optional)</span>
                  </label>

                  <input
                    type="url"
                    value={affiliateLink}
                    onChange={(e) => setAffiliateLink(e.target.value)}
                    placeholder="https://example.com/offer"
                    className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-slate-800
                border
                border-white/10
                text-white
                placeholder-gray-500
                outline-none
                focus:border-indigo-500
              "
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    This will replace <code>{"{{AFFILIATE_LINK}}"}</code>{" "}
                    placeholders in your landing page.
                  </p>

                  {/* Error */}

                  {deployError && (
                    <div
                      className="
                  mt-4
                  p-3
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-400
                  text-sm
                "
                    >
                      {deployError}
                    </div>
                  )}

                  {/* Deploy */}

                  <button
                    onClick={handleDeploy}
                    disabled={deploying}
                    className="
                w-full
                mt-6
                flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-emerald-600
                hover:bg-emerald-500
                text-white
                font-semibold
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
                  >
                    {deploying ? (
                      <>
                        <span
                          className="
                      w-4
                      h-4
                      border-2
                      border-white
                      border-t-transparent
                      rounded-full
                      animate-spin
                    "
                        />
                        Deploying...
                      </>
                    ) : (
                      <>🚀 Deploy Landing Page</>
                    )}
                  </button>
                </>
              ) : (
                /* =========================================
             DEPLOY SUCCESS
             ========================================= */

                <div className="text-center">
                  <div
                    className="
                w-14
                h-14
                mx-auto
                flex
                items-center
                justify-center
                rounded-full
                bg-emerald-500/10
                text-emerald-400
                text-2xl
              "
                  >
                    ✓
                  </div>

                  <h3 className="text-xl font-semibold text-white mt-4">
                    Landing Page Deployed
                  </h3>

                  <p className="text-sm text-gray-400 mt-2">
                    Your landing page is now live.
                  </p>

                  {/* Live URL */}

                  <div
                    className="
                mt-6
                p-4
                rounded-xl
                bg-slate-800
                border
                border-white/10
              "
                  >
                    <p className="text-sm text-indigo-400 break-all text-left">
                      {deployedURL}
                    </p>
                  </div>

                  {/* Open + Copy */}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() =>
                        window.open(
                          deployedURL,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                      className="
                  px-4
                  py-3
                  rounded-xl
                  bg-indigo-600
                  hover:bg-indigo-500
                  text-white
                  text-sm
                  font-medium
                "
                    >
                      Open Live Page
                    </button>

                    <button
                      onClick={handleCopyURL}
                      className="
                  px-4
                  py-3
                  rounded-xl
                  bg-slate-700
                  hover:bg-slate-600
                  text-white
                  text-sm
                  font-medium
                "
                    >
                      {copied ? "Copied!" : "Copy URL"}
                    </button>
                  </div>

                  {/* Close */}

                  <button
                    onClick={() => setShowDeployModal(false)}
                    className="
                w-full
                mt-3
                py-3
                text-gray-400
                hover:text-white
                text-sm
              "
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
