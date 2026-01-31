import React, { useRef, useState } from "react";
import Preview from "../Preview/Preview";
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from "../helper";

const Container = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aicode, Setaicode] = useState("");
  const previewRef = useRef(null);

  // ✅ Extract code safely

  // function extractCode(response) {
  //   const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  //   return match ? match[1].trim() : response.trim();
  // }

  function extractCode(response) {
    const match = response.match(/```html\s*([\s\S]*?)```/i);
    if (!match) {
      throw new Error("AI did not return valid HTML code block");
    }
    return match[1].trim();
  }

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  async function getResponse() {
    setLoading(true);

    const text_prompt = `You are an expert frontend developer and UI/UX designer. The user will provide a detailed prompt describing what kind of website they want. Based on the user’s description, generate a fully working, production-ready website as a **single HTML file**. Use only **HTML, Tailwind CSS (via CDN)**, vanilla JavaScript, and GSAP (via CDN).  

Strict output rules:
- Return the website as a single fenced Markdown code block with the language tag.  
- Do NOT include any explanations, text, or extra code blocks outside that single block. Only the HTML file content.  

Technical requirements:
1. **Stack**: HTML + Tailwind CSS (via CDN) + vanilla JavaScript + GSAP (via CDN). Everything in one file.  
2. **Responsive**: Must be fully responsive (mobile, tablet, desktop) with modern grid and flex layouts.  
3. **Theme**: Default **dark mode**, but if the website type fits better in light mode, auto-select light mode. Include a **toggle button** to switch between dark and light themes.  
4. **Animations & Interactions**:  
   - GSAP scroll-based animations (fade, slide, stagger, parallax).  
   - Smooth hover effects with scale, shadow, and gradient transitions.  
   - Sticky navbar with subtle shadow on scroll.  
   - Animated gradient backgrounds or floating decorative shapes.  
5. **Visual richness**:  
   - Use high-quality **royalty-free images** (Unsplash via direct URLs).  
   - Apply **soft shadows, glassmorphism, or neumorphism** effects where suitable.  
   - Modern cards, rounded corners, gradient buttons, hover animations.  
6. **UI Sections** (as per user request):  
   - Sticky **Navbar** with logo + links + theme toggle.  
   - **Hero section** with headline, subheadline, CTA button, and background image/gradient.  
   - **Main content**: features grid, product showcase, gallery, blog cards, or whatever fits user’s request.  
   - **Call to Action** with strong button.  
   - **Footer** with the text: "Made with WebBuilder"  
7. **Code quality**: Clean, semantic HTML5, ARIA labels for accessibility, well-indented, professional Tailwind usage.  
8. **Performance**: Optimized. No external CSS/JS frameworks beyond Tailwind + GSAP. Use responsive images, gradients, inline SVGs, or Unsplash placeholders.  

Final instruction: Output only the single fenced Markdown code block with the full HTML file content. Nothing else.  

    Website prompt: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });
    // console.log(response.text);
    
    // Setaicode(extractCode(response.text));
    try {
      Setaicode(extractCode(response.text));
    } catch (err) {
      Setaicode(`
     <!DOCTYPE html>
     <html>
  <body style="background:black;color:red;">
    <h1>AI Error</h1>
    <p>Please try again with a clearer prompt.</p>
  </body>
</html>
  `);
    }
    
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
      <div className="w-full pt-30 flex flex-col justify-center items-center bg-black px-4">
        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-lg">
          Build Your Website With AI
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-gray-300 text-center text-lg sm:text-xl max-w-xl">
          Create stunning, responsive websites effortlessly using AI-powered
          tools. No coding required!
        </p>

        <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative">
          <textarea
            id="ai-command"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your command here... e.g., Create a modern portfolio website with dark theme"
            className="w-full h-40 sm:h-48 p-4 pr-14 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow shadow-sm hover:shadow-md"
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
      <div ref={previewRef}>
        <Preview aicode={aicode} loading={loading}></Preview>
      </div>
    </>
  );
};

export default Container;
