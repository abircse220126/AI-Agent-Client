// import React, { useEffect, useState } from "react";

// const EditorTools = ({ code, setCode, onClose }) => {
//   // =========================================
//   // CONTENT STATE
//   // =========================================
//   const [content, setContent] = useState({
//     headline: "",
//     description: "",
//     cta: "",
//     ctaLink: "",
//     heroImage: "",
//   });

//   // =========================================
//   // STYLE STATE
//   // =========================================

//   const [style, setStyle] = useState({
//     primaryColor: "",
//     backgroundColor: "",
//     headingSize: "",
//     buttonRadius: "",
//   });

//   // =========================================
//   // GET DOCUMENT
//   // =========================================

//   const getDocument = () => {
//     if (!code) return null;

//     const parser = new DOMParser();

//     return parser.parseFromString(code, "text/html");
//   };

//   // =========================================
//   // GET / CREATE HEAD
//   // =========================================

//   const getHead = (doc) => {
//     if (!doc) return null;

//     let head = doc.head;

//     if (!head) {
//       head = doc.createElement("head");

//       if (doc.documentElement) {
//         doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
//       }
//     }

//     return head;
//   };

//   // =========================================
//   // SAVE DOCUMENT
//   // =========================================

//   const saveDocument = (doc) => {
//     if (!doc || !doc.documentElement) return;

//     const updatedCode = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

//     setCode(updatedCode);
//   };

//   // =========================================
//   // GET / CREATE EDITOR STYLE
//   // =========================================

//   const getEditorStyleTag = (doc) => {
//     if (!doc) return null;

//     const head = getHead(doc);

//     if (!head) return null;

//     let styleTag = doc.querySelector("#ai-editor-styles");

//     if (!styleTag) {
//       styleTag = doc.createElement("style");

//       styleTag.id = "ai-editor-styles";

//       head.appendChild(styleTag);
//     } else {
//       // Always move our style to the end of <head>
//       head.appendChild(styleTag);
//     }

//     return styleTag;
//   };

//   // =========================================
//   // VALIDATE COLOR
//   // =========================================

//   const isValidColor = (value) => {
//     if (!value) return false;

//     const testElement = document.createElement("div");

//     testElement.style.color = "";

//     testElement.style.color = value;

//     return Boolean(testElement.style.color);
//   };

//   // =========================================
//   // EXTRACT CONTENT FROM HTML
//   // =========================================

//   useEffect(() => {
//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     // -----------------------------------------
//     // Headline
//     // -----------------------------------------

//     const heading =
//       doc.querySelector("h1") ||
//       doc.querySelector("h2") ||
//       doc.querySelector("h3") ||
//       doc.querySelector("h4");

//     // -----------------------------------------
//     // Description
//     // -----------------------------------------

//     const paragraph = doc.querySelector("p");

//     // -----------------------------------------
//     // CTA
//     // -----------------------------------------

//     const cta =
//       doc.querySelector("a[data-track]") ||
//       doc.querySelector("button") ||
//       doc.querySelector("a");

//     // -----------------------------------------
//     // Hero Image
//     // -----------------------------------------

//     const image = doc.querySelector("img");

//     const ctaLink = doc.querySelector("a")?.getAttribute("href") || "";

//     setContent({
//       headline: heading?.textContent?.trim() || "",
//       description: paragraph?.textContent?.trim() || "",
//       cta: cta?.textContent?.trim() || "",
//       ctaLink,
//       heroImage: image?.getAttribute("src") || "",
//     });

//     // -----------------------------------------
//     // Detect existing styles
//     // -----------------------------------------

//     const body = doc.body;

//     if (body) {
//       const computedBackground = body.style.backgroundColor;

//       if (computedBackground) {
//         setStyle((prev) => ({
//           ...prev,
//           backgroundColor: computedBackground,
//         }));
//       }
//     }
//   }, [code]);

//   // =========================================
//   // UPDATE TEXT HTML
//   // =========================================

//   const updateTextElements = (selector, value) => {
//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     const elements = doc.querySelectorAll(selector);

//     elements.forEach((element) => {
//       element.textContent = value;
//     });

//     saveDocument(doc);
//   };

//   // =========================================
//   // HEADLINE
//   // =========================================

//   const handleHeadline = (value) => {
//     setContent((prev) => ({
//       ...prev,
//       headline: value,
//     }));

//     updateTextElements("h1", value);
//   };

//   // =========================================
//   // DESCRIPTION
//   // =========================================

//   const handleDescription = (value) => {
//     setContent((prev) => ({
//       ...prev,
//       description: value,
//     }));

//     updateTextElements("p", value);
//   };

//   // =========================================
//   // CTA
//   // =========================================

//   const handleCTA = (value) => {
//     setContent((prev) => ({
//       ...prev,
//       cta: value,
//     }));

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     const ctaElements = doc.querySelectorAll(
//       "a[data-track], button, .cta, .btn",
//     );

//     if (ctaElements.length > 0) {
//       ctaElements.forEach((element) => {
//         element.textContent = value;
//       });
//     } else {
//       const firstLink = doc.querySelector("a");

//       if (firstLink) {
//         firstLink.textContent = value;
//       }
//     }

//     saveDocument(doc);
//   };

//   // =========================================
//   // HERO IMAGE
//   // =========================================

//   const handleHeroImage = (value) => {
//     setContent((prev) => ({
//       ...prev,
//       heroImage: value,
//     }));

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     const image = doc.querySelector("img");

//     if (image) {
//       image.setAttribute("src", value);
//     }

//     saveDocument(doc);
//   };

//   // =========================================
//   // ALL CLICKABLE BUTTON / LINK
//   // =========================================

//   const handleCTALink = (value) => {
//     setContent((prev) => ({
//       ...prev,
//       ctaLink: value,
//     }));

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     // =========================================
//     // UPDATE ALL <a> LINKS
//     // =========================================

//     const links = doc.querySelectorAll("a");

//     links.forEach((link) => {
//       link.setAttribute("href", value);
//     });

//     // =========================================
//     // UPDATE ALL <button>
//     // =========================================

//     const buttons = doc.querySelectorAll("button");

//     buttons.forEach((button) => {
//       button.setAttribute(
//         "onclick",
//         `window.location.href='${value.replace(/'/g, "\\'")}'`,
//       );
//     });

//     // =========================================
//     // UPDATE role="button"
//     // =========================================

//     const roleButtons = doc.querySelectorAll('[role="button"]');

//     roleButtons.forEach((element) => {
//       if (
//         element.tagName.toLowerCase() !== "a" &&
//         element.tagName.toLowerCase() !== "button"
//       ) {
//         element.setAttribute(
//           "onclick",
//           `window.location.href='${value.replace(/'/g, "\\'")}'`,
//         );
//       }
//     });

//     // =========================================
//     // SAVE
//     // =========================================

//     saveDocument(doc);
//   };

//   // =========================================
//   // PRIMARY COLOR
//   // =========================================

//   const handlePrimaryColor = (value) => {
//     if (!value) return;

//     // -----------------------------------------
//     // Validate color
//     // -----------------------------------------

//     if (!isValidColor(value)) {
//       setStyle((prev) => ({
//         ...prev,
//         primaryColor: value,
//       }));

//       return;
//     }

//     setStyle((prev) => ({
//       ...prev,
//       primaryColor: value,
//     }));

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     // =========================================
//     // 1. DIRECTLY UPDATE CTA ELEMENTS
//     // =========================================

//     const ctaElements = doc.querySelectorAll(
//       'a[data-track], button, .cta, .btn, [class*="cta"], [class*="btn"]',
//     );

//     ctaElements.forEach((element) => {
//       element.style.setProperty("background-color", value, "important");

//       element.style.setProperty("background-image", "none", "important");

//       element.style.setProperty("border-color", value, "important");
//     });

//     // =========================================
//     // 2. UPDATE COMMON ACCENT ELEMENTS
//     // =========================================

//     const accentElements = doc.querySelectorAll(
//       `
//         .text-indigo-500,
//         .text-indigo-600,
//         .text-purple-500,
//         .text-purple-600,
//         .text-pink-500,
//         .text-pink-600,
//         .bg-indigo-500,
//         .bg-indigo-600,
//         .bg-purple-500,
//         .bg-purple-600,
//         .border-indigo-500,
//         .border-indigo-600,
//         .border-purple-500,
//         .border-purple-600
//         `,
//     );

//     accentElements.forEach((element) => {
//       const className =
//         typeof element.className === "string" ? element.className : "";

//       if (className.includes("text-")) {
//         element.style.setProperty("color", value, "important");
//       }

//       if (className.includes("bg-")) {
//         element.style.setProperty("background-color", value, "important");

//         element.style.setProperty("background-image", "none", "important");
//       }

//       if (className.includes("border-")) {
//         element.style.setProperty("border-color", value, "important");
//       }
//     });

//     // =========================================
//     // 3. UPDATE GRADIENT ELEMENTS
//     // =========================================

//     const gradientElements = doc.querySelectorAll(
//       ".bg-gradient-to-r, .bg-gradient-to-br, .bg-gradient-to-l, .bg-gradient-to-b, .bg-gradient-to-t",
//     );

//     gradientElements.forEach((element) => {
//       const className =
//         typeof element.className === "string" ? element.className : "";

//       const isPrimaryGradient =
//         className.includes("indigo") ||
//         className.includes("purple") ||
//         className.includes("pink");

//       if (isPrimaryGradient) {
//         element.style.setProperty(
//           "background-image",
//           `linear-gradient(to right, ${value}, ${value})`,
//           "important",
//         );
//       }
//     });

//     // =========================================
//     // 4. UPDATE TAILWIND COLOR VARIABLES
//     // =========================================

//     const allElements = doc.querySelectorAll("*");

//     allElements.forEach((element) => {
//       const className =
//         typeof element.className === "string" ? element.className : "";

//       if (!className) return;

//       const hasPrimaryGradient =
//         className.includes("from-indigo") ||
//         className.includes("from-purple") ||
//         className.includes("from-pink") ||
//         className.includes("via-indigo") ||
//         className.includes("via-purple") ||
//         className.includes("via-pink") ||
//         className.includes("to-indigo") ||
//         className.includes("to-purple") ||
//         className.includes("to-pink");

//       if (hasPrimaryGradient) {
//         element.style.setProperty(
//           "background-image",
//           `linear-gradient(to right, ${value}, ${value})`,
//           "important",
//         );
//       }
//     });

//     // =========================================
//     // 5. CREATE FINAL EDITOR CSS
//     // =========================================

//     const styleTag = getEditorStyleTag(doc);

//     if (!styleTag) return;

//     styleTag.textContent = `
//       /* =====================================
//          AI EDITOR PRIMARY COLOR
//          ===================================== */

//       /* CTA */
//       a[data-track],
//       button,
//       .cta,
//       .btn,
//       [class*="cta"],
//       [class*="btn"] {
//         background-color: ${value} !important;
//         border-color: ${value} !important;
//       }

//       /* Remove old CTA gradients */
//       a[data-track],
//       button,
//       .cta,
//       .btn,
//       [class*="cta"],
//       [class*="btn"] {
//         background-image: none !important;
//       }

//       /* Common primary background */
//       .bg-indigo-500,
//       .bg-indigo-600,
//       .bg-purple-500,
//       .bg-purple-600 {
//         background-color: ${value} !important;
//       }

//       /* Common primary text */
//       .text-indigo-500,
//       .text-indigo-600,
//       .text-purple-500,
//       .text-purple-600,
//       .text-pink-500,
//       .text-pink-600 {
//         color: ${value} !important;
//       }

//       /* Common primary borders */
//       .border-indigo-500,
//       .border-indigo-600,
//       .border-purple-500,
//       .border-purple-600 {
//         border-color: ${value} !important;
//       }

//       /* Primary gradients */
//       .bg-gradient-to-r.from-indigo-500,
//       .bg-gradient-to-r.from-indigo-600,
//       .bg-gradient-to-r.from-purple-500,
//       .bg-gradient-to-r.from-purple-600,
//       .bg-gradient-to-r.from-pink-500,
//       .bg-gradient-to-br.from-indigo-500,
//       .bg-gradient-to-br.from-indigo-600,
//       .bg-gradient-to-br.from-purple-500,
//       .bg-gradient-to-br.from-purple-600,
//       .bg-gradient-to-br.from-pink-500 {
//         background-image:
//           linear-gradient(
//             to right,
//             ${value},
//             ${value}
//           ) !important;
//       }

//       /* Explicit gradient CTA */
//       a[data-track].bg-gradient-to-r,
//       a[data-track].bg-gradient-to-br {
//         background-image:
//           linear-gradient(
//             to right,
//             ${value},
//             ${value}
//           ) !important;
//       }

//       /* Accent utility */
//       .ai-primary-color {
//         color: ${value} !important;
//       }

//       .ai-primary-bg {
//         background-color: ${value} !important;
//         background-image: none !important;
//       }

//       .ai-primary-border {
//         border-color: ${value} !important;
//       }
//     `;

//     // =========================================
//     // SAVE
//     // =========================================

//     saveDocument(doc);
//   };

//   // =========================================
//   // BACKGROUND COLOR
//   // =========================================

//   const handleBackgroundColor = (value) => {
//     if (!value) return;

//     // -----------------------------------------
//     // Validate color
//     // -----------------------------------------

//     if (!isValidColor(value)) {
//       setStyle((prev) => ({
//         ...prev,
//         backgroundColor: value,
//       }));

//       return;
//     }

//     setStyle((prev) => ({
//       ...prev,
//       backgroundColor: value,
//     }));

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     // =========================================
//     // UPDATE HTML
//     // =========================================

//     if (doc.documentElement) {
//       doc.documentElement.style.setProperty(
//         "background-color",
//         value,
//         "important",
//       );
//     }

//     // =========================================
//     // UPDATE BODY
//     // =========================================

//     if (doc.body) {
//       doc.body.style.setProperty("background-color", value, "important");
//     }

//     // =========================================
//     // UPDATE MAIN
//     // =========================================

//     const mainElements = doc.querySelectorAll("main");

//     mainElements.forEach((element) => {
//       element.style.setProperty("background-color", value, "important");
//     });

//     // =========================================
//     // EDITOR STYLE
//     // =========================================

//     const styleTag = getEditorStyleTag(doc);

//     if (!styleTag) return;

//     /*
//       Preserve primary color CSS.
//       Remove only previously generated
//       background section.
//     */

//     let existingCSS = styleTag.textContent || "";

//     existingCSS = existingCSS.replace(
//       /\/\* AI EDITOR BACKGROUND START \*\/[\s\S]*?\/\* AI EDITOR BACKGROUND END \*\//g,
//       "",
//     );

//     styleTag.textContent = `
//       ${existingCSS}

//       /* AI EDITOR BACKGROUND START */

//       html {
//         background-color: ${value} !important;
//       }

//       body {
//         background-color: ${value} !important;
//       }

//       main {
//         background-color: ${value} !important;
//       }

//       /* AI EDITOR BACKGROUND END */
//     `;

//     saveDocument(doc);
//   };

//   // =========================================
//   // HEADING SIZE
//   // =========================================

//   const handleHeadingSize = (value) => {
//     setStyle((prev) => ({
//       ...prev,
//       headingSize: value,
//     }));

//     if (!value) return;

//     const numericValue = Number(value);

//     if (Number.isNaN(numericValue) || numericValue < 12 || numericValue > 100) {
//       return;
//     }

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

//     headings.forEach((heading) => {
//       heading.style.setProperty("font-size", `${numericValue}px`, "important");
//     });

//     const styleTag = getEditorStyleTag(doc);

//     if (styleTag) {
//       let css = styleTag.textContent || "";

//       css = css.replace(
//         /\/\* AI EDITOR HEADING SIZE START \*\/[\s\S]*?\/\* AI EDITOR HEADING SIZE END \*\//g,
//         "",
//       );

//       styleTag.textContent = `
//         ${css}

//         /* AI EDITOR HEADING SIZE START */

//         h1,
//         h2,
//         h3,
//         h4,
//         h5,
//         h6 {
//           font-size: ${numericValue}px !important;
//         }

//         /* AI EDITOR HEADING SIZE END */
//       `;
//     }

//     saveDocument(doc);
//   };

//   // =========================================
//   // BUTTON RADIUS
//   // =========================================

//   const handleButtonRadius = (value) => {
//     setStyle((prev) => ({
//       ...prev,
//       buttonRadius: value,
//     }));

//     if (!value) return;

//     const numericValue = Number(value);

//     if (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 50) {
//       return;
//     }

//     if (!code) return;

//     const doc = getDocument();

//     if (!doc) return;

//     // =========================================
//     // ALL CTA / BUTTONS
//     // =========================================

//     const buttons = doc.querySelectorAll(
//       'a[data-track], button, .cta, .btn, [class*="cta"], [class*="btn"]',
//     );

//     buttons.forEach((button) => {
//       button.style.setProperty(
//         "border-radius",
//         `${numericValue}px`,
//         "important",
//       );
//     });

//     // =========================================
//     // EDITOR STYLE
//     // =========================================

//     const styleTag = getEditorStyleTag(doc);

//     if (styleTag) {
//       let css = styleTag.textContent || "";

//       css = css.replace(
//         /\/\* AI EDITOR RADIUS START \*\/[\s\S]*?\/\* AI EDITOR RADIUS END \*\//g,
//         "",
//       );

//       styleTag.textContent = `
//         ${css}

//         /* AI EDITOR RADIUS START */

//         a[data-track],
//         button,
//         .cta,
//         .btn,
//         [class*="cta"],
//         [class*="btn"] {
//           border-radius: ${numericValue}px !important;
//         }

//         /* AI EDITOR RADIUS END */
//       `;
//     }

//     saveDocument(doc);
//   };

//   // =========================================
//   // RETURN UI
//   // =========================================

//   return (
//     <div className="w-full bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
//       {/* ===================================== */}
//       {/* HEADER */}
//       {/* ===================================== */}

//       <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900">
//         <div>
//           <h2 className="text-white font-semibold text-base">
//             Landing Page Editor
//           </h2>

//           <p className="text-xs text-gray-500 mt-1">
//             Customize your landing page
//           </p>
//         </div>

//         <button
//           onClick={onClose}
//           className="
//             text-gray-400
//             hover:text-white
//             transition
//             text-sm
//           "
//         >
//           ✕
//         </button>
//       </div>

//       {/* ===================================== */}
//       {/* EDITOR CONTENT */}
//       {/* ===================================== */}

//       <div className="p-5 space-y-8 max-h-[700px] overflow-y-auto">
//         {/* ================================= */}
//         {/* CONTENT */}
//         {/* ================================= */}

//         <section>
//           <h3
//             className="
//             text-sm
//             font-semibold
//             text-white
//             uppercase
//             tracking-wider
//             mb-5
//           "
//           >
//             Content
//           </h3>

//           <div className="space-y-5">
//             {/* ================================= */}
//             {/* HEADLINE */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Headline
//               </label>

//               <input
//                 type="text"
//                 value={content.headline}
//                 onChange={(e) => handleHeadline(e.target.value)}
//                 placeholder="Enter headline"
//                 className="
//                   w-full
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   bg-gray-900
//                   border
//                   border-gray-700
//                   text-gray-200
//                   text-sm
//                   outline-none
//                   focus:border-indigo-500
//                   transition
//                 "
//               />
//             </div>

//             {/* ================================= */}
//             {/* DESCRIPTION */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Description
//               </label>

//               <textarea
//                 value={content.description}
//                 onChange={(e) => handleDescription(e.target.value)}
//                 placeholder="Enter description"
//                 rows={4}
//                 className="
//                   w-full
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   bg-gray-900
//                   border
//                   border-gray-700
//                   text-gray-200
//                   text-sm
//                   outline-none
//                   resize-none
//                   focus:border-indigo-500
//                   transition
//                 "
//               />
//             </div>

//             {/* ================================= */}
//             {/* CTA */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 CTA Button
//               </label>

//               <input
//                 type="text"
//                 value={content.cta}
//                 onChange={(e) => handleCTA(e.target.value)}
//                 placeholder="Enter CTA text"
//                 className="
//                   w-full
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   bg-gray-900
//                   border
//                   border-gray-700
//                   text-gray-200
//                   text-sm
//                   outline-none
//                   focus:border-indigo-500
//                   transition
//                 "
//               />
//             </div>

//             {/* ================================= */}
//             {/* CTA LINK */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//       block
//       text-sm
//       text-gray-400
//       mb-2
//     "
//               >
//                 Button Link
//               </label>

//               <input
//                 type="url"
//                 value={content.ctaLink}
//                 onChange={(e) => handleCTALink(e.target.value)}
//                 placeholder="https://example.com/offer"
//                 className="
//       w-full
//       px-3
//       py-2.5
//       rounded-lg
//       bg-gray-900
//       border
//       border-gray-700
//       text-gray-200
//       text-sm
//       outline-none
//       focus:border-indigo-500
//       transition
//     "
//               />

//               <p className="text-xs text-gray-600 mt-2">
//                 This link will be applied to all clickable buttons and links.
//               </p>
//             </div>

//             {/* ================================= */}
//             {/* HERO IMAGE */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Hero Image
//               </label>

//               <input
//                 type="text"
//                 value={content.heroImage}
//                 onChange={(e) => handleHeroImage(e.target.value)}
//                 placeholder="Image URL"
//                 className="
//                   w-full
//                   px-3
//                   py-2.5
//                   rounded-lg
//                   bg-gray-900
//                   border
//                   border-gray-700
//                   text-gray-200
//                   text-sm
//                   outline-none
//                   focus:border-indigo-500
//                   transition
//                 "
//               />
//             </div>
//           </div>
//         </section>

//         {/* ================================= */}
//         {/* DIVIDER */}
//         {/* ================================= */}

//         <div className="border-t border-gray-800" />

//         {/* ================================= */}
//         {/* STYLE */}
//         {/* ================================= */}

//         <section>
//           <h3
//             className="
//             text-sm
//             font-semibold
//             text-white
//             uppercase
//             tracking-wider
//             mb-5
//           "
//           >
//             Style
//           </h3>

//           <div className="space-y-5">
//             {/* ================================= */}
//             {/* PRIMARY COLOR */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Primary Color
//               </label>

//               <div
//                 className="
//                 flex
//                 items-center
//                 gap-3
//               "
//               >
//                 <input
//                   type="color"
//                   value={
//                     isValidColor(style.primaryColor)
//                       ? style.primaryColor
//                       : "#6366f1"
//                   }
//                   onChange={(e) => handlePrimaryColor(e.target.value)}
//                   className="
//                     w-12
//                     h-10
//                     rounded-lg
//                     bg-gray-900
//                     border
//                     border-gray-700
//                     cursor-pointer
//                   "
//                 />

//                 <input
//                   type="text"
//                   value={style.primaryColor}
//                   onChange={(e) => handlePrimaryColor(e.target.value)}
//                   placeholder="#6366f1"
//                   className="
//                     flex-1
//                     px-3
//                     py-2.5
//                     rounded-lg
//                     bg-gray-900
//                     border
//                     border-gray-700
//                     text-gray-200
//                     text-sm
//                     outline-none
//                     focus:border-indigo-500
//                   "
//                 />
//               </div>

//               <p
//                 className="
//                 text-xs
//                 text-gray-600
//                 mt-2
//               "
//               >
//                 Changes CTA buttons, gradients and primary accents.
//               </p>
//             </div>

//             {/* ================================= */}
//             {/* BACKGROUND COLOR */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Background Color
//               </label>

//               <div
//                 className="
//                 flex
//                 items-center
//                 gap-3
//               "
//               >
//                 <input
//                   type="color"
//                   value={
//                     isValidColor(style.backgroundColor)
//                       ? style.backgroundColor
//                       : "#020617"
//                   }
//                   onChange={(e) => handleBackgroundColor(e.target.value)}
//                   className="
//                     w-12
//                     h-10
//                     rounded-lg
//                     bg-gray-900
//                     border
//                     border-gray-700
//                     cursor-pointer
//                   "
//                 />

//                 <input
//                   type="text"
//                   value={style.backgroundColor}
//                   onChange={(e) => handleBackgroundColor(e.target.value)}
//                   placeholder="#020617"
//                   className="
//                     flex-1
//                     px-3
//                     py-2.5
//                     rounded-lg
//                     bg-gray-900
//                     border
//                     border-gray-700
//                     text-gray-200
//                     text-sm
//                     outline-none
//                     focus:border-indigo-500
//                   "
//                 />
//               </div>
//             </div>

//             {/* ================================= */}
//             {/* HEADING SIZE */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Heading Size
//               </label>

//               <div
//                 className="
//                 flex
//                 items-center
//                 gap-3
//               "
//               >
//                 <input
//                   type="number"
//                   min="12"
//                   max="100"
//                   value={style.headingSize}
//                   onChange={(e) => handleHeadingSize(e.target.value)}
//                   placeholder="48"
//                   className="
//                     flex-1
//                     px-3
//                     py-2.5
//                     rounded-lg
//                     bg-gray-900
//                     border
//                     border-gray-700
//                     text-gray-200
//                     text-sm
//                     outline-none
//                     focus:border-indigo-500
//                   "
//                 />

//                 <span
//                   className="
//                   text-gray-500
//                   text-sm
//                 "
//                 >
//                   px
//                 </span>
//               </div>
//             </div>

//             {/* ================================= */}
//             {/* BUTTON RADIUS */}
//             {/* ================================= */}

//             <div>
//               <label
//                 className="
//                 block
//                 text-sm
//                 text-gray-400
//                 mb-2
//               "
//               >
//                 Button Radius
//               </label>

//               <div
//                 className="
//                 flex
//                 items-center
//                 gap-3
//               "
//               >
//                 <input
//                   type="number"
//                   min="0"
//                   max="50"
//                   value={style.buttonRadius}
//                   onChange={(e) => handleButtonRadius(e.target.value)}
//                   placeholder="12"
//                   className="
//                     flex-1
//                     px-3
//                     py-2.5
//                     rounded-lg
//                     bg-gray-900
//                     border
//                     border-gray-700
//                     text-gray-200
//                     text-sm
//                     outline-none
//                     focus:border-indigo-500
//                   "
//                 />

//                 <span
//                   className="
//                   text-gray-500
//                   text-sm
//                 "
//                 >
//                   px
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default EditorTools;

import React, { useEffect, useState } from "react";

const EditorTools = ({ code, setCode, onClose }) => {
  // =========================================
  // CONTENT STATE
  // =========================================

  const [content, setContent] = useState({
    headline: "",
    description: "",
    cta: "",
    ctaLink: "",
    heroImage: "",
  });

  // =========================================
  // STYLE STATE
  // =========================================

  const [style, setStyle] = useState({
    primaryColor: "",
    backgroundColor: "",
    headingSize: "",
    buttonRadius: "",
  });

  // =========================================
  // GET DOCUMENT
  // =========================================

  const getDocument = () => {
    if (!code) return null;

    const parser = new DOMParser();

    return parser.parseFromString(code, "text/html");
  };

  // =========================================
  // GET / CREATE HEAD
  // =========================================

  const getHead = (doc) => {
    if (!doc) return null;

    let head = doc.head;

    if (!head) {
      head = doc.createElement("head");

      if (doc.documentElement) {
        doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
      }
    }

    return head;
  };

  // =========================================
  // SAVE DOCUMENT
  // =========================================

  const saveDocument = (doc) => {
    if (!doc || !doc.documentElement) return;

    const updatedCode = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

    setCode(updatedCode);
  };

  // =========================================
  // GET / CREATE EDITOR STYLE
  // =========================================

  const getEditorStyleTag = (doc) => {
    if (!doc) return null;

    const head = getHead(doc);

    if (!head) return null;

    let styleTag = doc.querySelector("#ai-editor-styles");

    if (!styleTag) {
      styleTag = doc.createElement("style");
      styleTag.id = "ai-editor-styles";
      head.appendChild(styleTag);
    } else {
      // Always move our style to the end of <head>
      head.appendChild(styleTag);
    }

    return styleTag;
  };

  // =========================================
  // VALIDATE COLOR
  // =========================================

  const isValidColor = (value) => {
    if (!value) return false;

    const testElement = document.createElement("div");

    testElement.style.color = "";
    testElement.style.color = value;

    return Boolean(testElement.style.color);
  };

  // =========================================
  // EXTRACT CONTENT FROM HTML
  // =========================================

  useEffect(() => {
    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    // -----------------------------------------
    // Headline
    // -----------------------------------------

    const heading =
      doc.querySelector("h1") ||
      doc.querySelector("h2") ||
      doc.querySelector("h3") ||
      doc.querySelector("h4");

    // -----------------------------------------
    // Description
    // -----------------------------------------

    const paragraph = doc.querySelector("p");

    // -----------------------------------------
    // CTA
    // -----------------------------------------

    const cta =
      doc.querySelector("a[data-track]") ||
      doc.querySelector("button") ||
      doc.querySelector("a");

    // -----------------------------------------
    // Hero Image
    // -----------------------------------------

    const image = doc.querySelector("img");

    // -----------------------------------------
    // Existing Affiliate Link
    // -----------------------------------------

    const ctaLink = doc.querySelector("a")?.getAttribute("href") || "";

    setContent({
      headline: heading?.textContent?.trim() || "",
      description: paragraph?.textContent?.trim() || "",
      cta: cta?.textContent?.trim() || "",
      ctaLink,
      heroImage: image?.getAttribute("src") || "",
    });

    // -----------------------------------------
    // Detect existing styles
    // -----------------------------------------

    const body = doc.body;

    if (body) {
      const computedBackground = body.style.backgroundColor;

      if (computedBackground) {
        setStyle((prev) => ({
          ...prev,
          backgroundColor: computedBackground,
        }));
      }
    }
  }, [code]);

  // =========================================
  // UPDATE TEXT HTML
  // =========================================

  const updateTextElements = (selector, value) => {
    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    const elements = doc.querySelectorAll(selector);

    elements.forEach((element) => {
      element.textContent = value;
    });

    saveDocument(doc);
  };

  // =========================================
  // HEADLINE
  // =========================================

  const handleHeadline = (value) => {
    setContent((prev) => ({
      ...prev,
      headline: value,
    }));

    updateTextElements("h1", value);
  };

  // =========================================
  // DESCRIPTION
  // =========================================

  const handleDescription = (value) => {
    setContent((prev) => ({
      ...prev,
      description: value,
    }));

    updateTextElements("p", value);
  };

  // =========================================
  // CTA
  // =========================================

  const handleCTA = (value) => {
    setContent((prev) => ({
      ...prev,
      cta: value,
    }));

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    const ctaElements = doc.querySelectorAll(
      "a[data-track], button, .cta, .btn",
    );

    if (ctaElements.length > 0) {
      ctaElements.forEach((element) => {
        element.textContent = value;
      });
    } else {
      const firstLink = doc.querySelector("a");

      if (firstLink) {
        firstLink.textContent = value;
      }
    }

    saveDocument(doc);
  };

  // =========================================
  // HERO IMAGE
  // =========================================

  const handleHeroImage = (value) => {
    setContent((prev) => ({
      ...prev,
      heroImage: value,
    }));

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    const image = doc.querySelector("img");

    if (image) {
      image.setAttribute("src", value);
    }

    saveDocument(doc);
  };

  // =========================================
  // AFFILIATE LINK
  // =========================================

  const handleCTALink = (value) => {
    setContent((prev) => ({
      ...prev,
      ctaLink: value,
    }));

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    // =========================================
    // UPDATE ALL <a> LINKS
    // =========================================

    const links = doc.querySelectorAll("a");

    links.forEach((link) => {
      link.setAttribute("href", value);
    });

    // =========================================
    // UPDATE ALL <button>
    // =========================================

    const buttons = doc.querySelectorAll("button");

    buttons.forEach((button) => {
      if (value) {
        button.setAttribute(
          "onclick",
          `window.location.href = ${JSON.stringify(value)};`,
        );
      } else {
        button.removeAttribute("onclick");
      }
    });

    // =========================================
    // UPDATE role="button"
    // =========================================

    const roleButtons = doc.querySelectorAll('[role="button"]');

    roleButtons.forEach((element) => {
      const tagName = element.tagName.toLowerCase();

      if (tagName !== "a" && tagName !== "button") {
        if (value) {
          element.setAttribute(
            "onclick",
            `window.location.href = ${JSON.stringify(value)};`,
          );
        } else {
          element.removeAttribute("onclick");
        }
      }
    });

    // =========================================
    // SAVE
    // =========================================

    saveDocument(doc);
  };

  // =========================================
  // PRIMARY COLOR
  // =========================================

  const handlePrimaryColor = (value) => {
    if (!value) return;

    // -----------------------------------------
    // Validate color
    // -----------------------------------------

    if (!isValidColor(value)) {
      setStyle((prev) => ({
        ...prev,
        primaryColor: value,
      }));

      return;
    }

    setStyle((prev) => ({
      ...prev,
      primaryColor: value,
    }));

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    // =========================================
    // 1. DIRECTLY UPDATE CTA ELEMENTS
    // =========================================

    const ctaElements = doc.querySelectorAll(
      'a[data-track], button, .cta, .btn, [class*="cta"], [class*="btn"]',
    );

    ctaElements.forEach((element) => {
      element.style.setProperty("background-color", value, "important");

      element.style.setProperty("background-image", "none", "important");

      element.style.setProperty("border-color", value, "important");
    });

    // =========================================
    // 2. UPDATE COMMON ACCENT ELEMENTS
    // =========================================

    const accentElements = doc.querySelectorAll(
      `
        .text-indigo-500,
        .text-indigo-600,
        .text-purple-500,
        .text-purple-600,
        .text-pink-500,
        .text-pink-600,
        .bg-indigo-500,
        .bg-indigo-600,
        .bg-purple-500,
        .bg-purple-600,
        .border-indigo-500,
        .border-indigo-600,
        .border-purple-500,
        .border-purple-600
      `,
    );

    accentElements.forEach((element) => {
      const className =
        typeof element.className === "string" ? element.className : "";

      if (className.includes("text-")) {
        element.style.setProperty("color", value, "important");
      }

      if (className.includes("bg-")) {
        element.style.setProperty("background-color", value, "important");

        element.style.setProperty("background-image", "none", "important");
      }

      if (className.includes("border-")) {
        element.style.setProperty("border-color", value, "important");
      }
    });

    // =========================================
    // 3. UPDATE GRADIENT ELEMENTS
    // =========================================

    const gradientElements = doc.querySelectorAll(
      ".bg-gradient-to-r, .bg-gradient-to-br, .bg-gradient-to-l, .bg-gradient-to-b, .bg-gradient-to-t",
    );

    gradientElements.forEach((element) => {
      const className =
        typeof element.className === "string" ? element.className : "";

      const isPrimaryGradient =
        className.includes("indigo") ||
        className.includes("purple") ||
        className.includes("pink");

      if (isPrimaryGradient) {
        element.style.setProperty(
          "background-image",
          `linear-gradient(to right, ${value}, ${value})`,
          "important",
        );
      }
    });

    // =========================================
    // 4. UPDATE TAILWIND COLOR VARIABLES
    // =========================================

    const allElements = doc.querySelectorAll("*");

    allElements.forEach((element) => {
      const className =
        typeof element.className === "string" ? element.className : "";

      if (!className) return;

      const hasPrimaryGradient =
        className.includes("from-indigo") ||
        className.includes("from-purple") ||
        className.includes("from-pink") ||
        className.includes("via-indigo") ||
        className.includes("via-purple") ||
        className.includes("via-pink") ||
        className.includes("to-indigo") ||
        className.includes("to-purple") ||
        className.includes("to-pink");

      if (hasPrimaryGradient) {
        element.style.setProperty(
          "background-image",
          `linear-gradient(to right, ${value}, ${value})`,
          "important",
        );
      }
    });

    // =========================================
    // 5. CREATE FINAL EDITOR CSS
    // =========================================

    const styleTag = getEditorStyleTag(doc);

    if (!styleTag) return;

    styleTag.textContent = `
      /* =====================================
         AI EDITOR PRIMARY COLOR
         ===================================== */

      /* CTA */

      a[data-track],
      button,
      .cta,
      .btn,
      [class*="cta"],
      [class*="btn"] {
        background-color: ${value} !important;
        border-color: ${value} !important;
      }

      /* Remove old CTA gradients */

      a[data-track],
      button,
      .cta,
      .btn,
      [class*="cta"],
      [class*="btn"] {
        background-image: none !important;
      }

      /* Common primary background */

      .bg-indigo-500,
      .bg-indigo-600,
      .bg-purple-500,
      .bg-purple-600 {
        background-color: ${value} !important;
      }

      /* Common primary text */

      .text-indigo-500,
      .text-indigo-600,
      .text-purple-500,
      .text-purple-600,
      .text-pink-500,
      .text-pink-600 {
        color: ${value} !important;
      }

      /* Common primary borders */

      .border-indigo-500,
      .border-indigo-600,
      .border-purple-500,
      .border-purple-600 {
        border-color: ${value} !important;
      }

      /* Primary gradients */

      .bg-gradient-to-r.from-indigo-500,
      .bg-gradient-to-r.from-indigo-600,
      .bg-gradient-to-r.from-purple-500,
      .bg-gradient-to-r.from-purple-600,
      .bg-gradient-to-r.from-pink-500,
      .bg-gradient-to-br.from-indigo-500,
      .bg-gradient-to-br.from-indigo-600,
      .bg-gradient-to-br.from-purple-500,
      .bg-gradient-to-br.from-purple-600,
      .bg-gradient-to-br.from-pink-500 {
        background-image:
          linear-gradient(
            to right,
            ${value},
            ${value}
          ) !important;
      }

      /* Explicit gradient CTA */

      a[data-track].bg-gradient-to-r,
      a[data-track].bg-gradient-to-br {
        background-image:
          linear-gradient(
            to right,
            ${value},
            ${value}
          ) !important;
      }

      /* Accent utility */

      .ai-primary-color {
        color: ${value} !important;
      }

      .ai-primary-bg {
        background-color: ${value} !important;
        background-image: none !important;
      }

      .ai-primary-border {
        border-color: ${value} !important;
      }
    `;

    // =========================================
    // SAVE
    // =========================================

    saveDocument(doc);
  };

  // =========================================
  // BACKGROUND COLOR
  // =========================================

  const handleBackgroundColor = (value) => {
    if (!value) return;

    // -----------------------------------------
    // Validate color
    // -----------------------------------------

    if (!isValidColor(value)) {
      setStyle((prev) => ({
        ...prev,
        backgroundColor: value,
      }));

      return;
    }

    setStyle((prev) => ({
      ...prev,
      backgroundColor: value,
    }));

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    // =========================================
    // UPDATE HTML
    // =========================================

    if (doc.documentElement) {
      doc.documentElement.style.setProperty(
        "background-color",
        value,
        "important",
      );
    }

    // =========================================
    // UPDATE BODY
    // =========================================

    if (doc.body) {
      doc.body.style.setProperty("background-color", value, "important");
    }

    // =========================================
    // UPDATE MAIN
    // =========================================

    const mainElements = doc.querySelectorAll("main");

    mainElements.forEach((element) => {
      element.style.setProperty("background-color", value, "important");
    });

    // =========================================
    // EDITOR STYLE
    // =========================================

    const styleTag = getEditorStyleTag(doc);

    if (!styleTag) return;

    /*
      Preserve primary color CSS.
      Remove only previously generated
      background section.
    */

    let existingCSS = styleTag.textContent || "";

    existingCSS = existingCSS.replace(
      /\/\* AI EDITOR BACKGROUND START \*\/[\s\S]*?\/\* AI EDITOR BACKGROUND END \*\//g,
      "",
    );

    styleTag.textContent = `
      ${existingCSS}

      /* AI EDITOR BACKGROUND START */

      html {
        background-color: ${value} !important;
      }

      body {
        background-color: ${value} !important;
      }

      main {
        background-color: ${value} !important;
      }

      /* AI EDITOR BACKGROUND END */
    `;

    saveDocument(doc);
  };

  // =========================================
  // HEADING SIZE
  // =========================================

  const handleHeadingSize = (value) => {
    setStyle((prev) => ({
      ...prev,
      headingSize: value,
    }));

    if (!value) return;

    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < 12 || numericValue > 100) {
      return;
    }

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headings.forEach((heading) => {
      heading.style.setProperty("font-size", `${numericValue}px`, "important");
    });

    const styleTag = getEditorStyleTag(doc);

    if (styleTag) {
      let css = styleTag.textContent || "";

      css = css.replace(
        /\/\* AI EDITOR HEADING SIZE START \*\/[\s\S]*?\/\* AI EDITOR HEADING SIZE END \*\//g,
        "",
      );

      styleTag.textContent = `
        ${css}

        /* AI EDITOR HEADING SIZE START */

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-size: ${numericValue}px !important;
        }

        /* AI EDITOR HEADING SIZE END */
      `;
    }

    saveDocument(doc);
  };

  // =========================================
  // BUTTON RADIUS
  // =========================================

  const handleButtonRadius = (value) => {
    setStyle((prev) => ({
      ...prev,
      buttonRadius: value,
    }));

    if (!value) return;

    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 50) {
      return;
    }

    if (!code) return;

    const doc = getDocument();

    if (!doc) return;

    // =========================================
    // ALL CTA / BUTTONS
    // =========================================

    const buttons = doc.querySelectorAll(
      'a[data-track], button, .cta, .btn, [class*="cta"], [class*="btn"]',
    );

    buttons.forEach((button) => {
      button.style.setProperty(
        "border-radius",
        `${numericValue}px`,
        "important",
      );
    });

    // =========================================
    // EDITOR STYLE
    // =========================================

    const styleTag = getEditorStyleTag(doc);

    if (styleTag) {
      let css = styleTag.textContent || "";

      css = css.replace(
        /\/\* AI EDITOR RADIUS START \*\/[\s\S]*?\/\* AI EDITOR RADIUS END \*\//g,
        "",
      );

      styleTag.textContent = `
        ${css}

        /* AI EDITOR RADIUS START */

        a[data-track],
        button,
        .cta,
        .btn,
        [class*="cta"],
        [class*="btn"] {
          border-radius: ${numericValue}px !important;
        }

        /* AI EDITOR RADIUS END */
      `;
    }

    saveDocument(doc);
  };

  // =========================================
  // RETURN UI
  // =========================================

  return (
    <div className="w-full bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* =====================================
          HEADER
          ===================================== */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900">
        <div>
          <h2 className="text-white font-semibold text-base">
            Landing Page Editor
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Customize your landing page
          </p>
        </div>

        <button
          onClick={onClose}
          className="
            text-gray-400
            hover:text-white
            transition
            text-sm
          "
        >
          ✕
        </button>
      </div>

      {/* =====================================
          EDITOR CONTENT
          ===================================== */}

      <div className="p-5 space-y-8 max-h-[700px] overflow-y-auto">
        {/* =================================
            CONTENT
            ================================= */}

        <section>
          <h3
            className="
              text-sm
              font-semibold
              text-white
              uppercase
              tracking-wider
              mb-5
            "
          >
            Content
          </h3>

          <div className="space-y-5">
            {/* =================================
                HEADLINE
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Headline
              </label>

              <input
                type="text"
                value={content.headline}
                onChange={(e) => handleHeadline(e.target.value)}
                placeholder="Enter headline"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  text-gray-200
                  text-sm
                  outline-none
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

            {/* =================================
                DESCRIPTION
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Description
              </label>

              <textarea
                value={content.description}
                onChange={(e) => handleDescription(e.target.value)}
                placeholder="Enter description"
                rows={4}
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  text-gray-200
                  text-sm
                  outline-none
                  resize-none
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

            {/* =================================
                CTA
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                CTA Button
              </label>

              <input
                type="text"
                value={content.cta}
                onChange={(e) => handleCTA(e.target.value)}
                placeholder="Enter CTA text"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  text-gray-200
                  text-sm
                  outline-none
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

            {/* =================================
                AFFILIATE LINK
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Affiliate Link
              </label>

              <input
                type="url"
                value={content.ctaLink}
                onChange={(e) => handleCTALink(e.target.value)}
                placeholder="https://example.com/offer"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  text-gray-200
                  text-sm
                  outline-none
                  focus:border-indigo-500
                  transition
                "
              />

              <p className="text-xs text-gray-600 mt-2">
                This affiliate link will be applied to all clickable buttons and
                links.
              </p>
            </div>

            {/* =================================
                HERO IMAGE
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Hero Image
              </label>

              <input
                type="text"
                value={content.heroImage}
                onChange={(e) => handleHeroImage(e.target.value)}
                placeholder="Image URL"
                className="
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  text-gray-200
                  text-sm
                  outline-none
                  focus:border-indigo-500
                  transition
                "
              />
            </div>
          </div>
        </section>

        {/* =================================
            DIVIDER
            ================================= */}

        <div className="border-t border-gray-800" />

        {/* =================================
            STYLE
            ================================= */}

        <section>
          <h3
            className="
              text-sm
              font-semibold
              text-white
              uppercase
              tracking-wider
              mb-5
            "
          >
            Style
          </h3>

          <div className="space-y-5">
            {/* =================================
                PRIMARY COLOR
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Primary Color
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <input
                  type="color"
                  value={
                    isValidColor(style.primaryColor)
                      ? style.primaryColor
                      : "#6366f1"
                  }
                  onChange={(e) => handlePrimaryColor(e.target.value)}
                  className="
                    w-12
                    h-10
                    rounded-lg
                    bg-gray-900
                    border
                    border-gray-700
                    cursor-pointer
                  "
                />

                <input
                  type="text"
                  value={style.primaryColor}
                  onChange={(e) => handlePrimaryColor(e.target.value)}
                  placeholder="#6366f1"
                  className="
                    flex-1
                    px-3
                    py-2.5
                    rounded-lg
                    bg-gray-900
                    border
                    border-gray-700
                    text-gray-200
                    text-sm
                    outline-none
                    focus:border-indigo-500
                  "
                />
              </div>

              <p
                className="
                  text-xs
                  text-gray-600
                  mt-2
                "
              >
                Changes CTA buttons, gradients and primary accents.
              </p>
            </div>

            {/* =================================
                BACKGROUND COLOR
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Background Color
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <input
                  type="color"
                  value={
                    isValidColor(style.backgroundColor)
                      ? style.backgroundColor
                      : "#020617"
                  }
                  onChange={(e) => handleBackgroundColor(e.target.value)}
                  className="
                    w-12
                    h-10
                    rounded-lg
                    bg-gray-900
                    border
                    border-gray-700
                    cursor-pointer
                  "
                />

                <input
                  type="text"
                  value={style.backgroundColor}
                  onChange={(e) => handleBackgroundColor(e.target.value)}
                  placeholder="#020617"
                  className="
                    flex-1
                    px-3
                    py-2.5
                    rounded-lg
                    bg-gray-900
                    border
                    border-gray-700
                    text-gray-200
                    text-sm
                    outline-none
                    focus:border-indigo-500
                  "
                />
              </div>
            </div>

            {/* =================================
                HEADING SIZE
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Heading Size
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={style.headingSize}
                  onChange={(e) => handleHeadingSize(e.target.value)}
                  placeholder="48"
                  className="
                    flex-1
                    px-3
                    py-2.5
                    rounded-lg
                    bg-gray-900
                    border
                    border-gray-700
                    text-gray-200
                    text-sm
                    outline-none
                    focus:border-indigo-500
                  "
                />

                <span
                  className="
                    text-gray-500
                    text-sm
                  "
                >
                  px
                </span>
              </div>
            </div>

            {/* =================================
                BUTTON RADIUS
                ================================= */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                "
              >
                Button Radius
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={style.buttonRadius}
                  onChange={(e) => handleButtonRadius(e.target.value)}
                  placeholder="12"
                  className="
                    flex-1
                    px-3
                    py-2.5
                    rounded-lg
                    bg-gray-900
                    border
                    border-gray-700
                    text-gray-200
                    text-sm
                    outline-none
                    focus:border-indigo-500
                  "
                />

                <span
                  className="
                    text-gray-500
                    text-sm
                  "
                >
                  px
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditorTools;
