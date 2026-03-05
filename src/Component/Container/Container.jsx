import React, { useRef, useState } from "react";
import Preview from "../Preview/Preview";
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from "../helper";

const gradients = [
  "bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60",
  "bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-slate-950/60",
  "bg-gradient-to-br from-slate-900/60 to-indigo-900/40",
];

const Container = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aicode, Setaicode] = useState("");
  const previewRef = useRef(null);
  const [conversionScore, setConversionScore] = useState(null);
  const [analysis, setAnalysis] = useState("");

  // function extractCode(response) {
  //   const match = response.match(/```html\s*([\s\S]*?)```/i);
  //   if (!match) {
  //     throw new Error("AI did not return valid HTML code block");
  //   }
  //   return match[1].trim();
  // }

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.

  function extractCode(response) {
    const match = response.match(/```html\s*([\s\S]*?)```/i);
    if (!match) {
      throw new Error("AI did not return valid HTML code block");
    }

    let html = match[1].trim();

    // Remove DOCTYPE, html, body if present
    html = html
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<\/?html[^>]*>/gi, "")
      .replace(/<\/?body[^>]*>/gi, "");

    return html;
  }

  function extractAnalysis(response) {
    const scoreMatch = response.match(/Conversion Score:\s*(\d+)\/100/i);

    let score = null;
    if (scoreMatch) {
      score = scoreMatch[1];
    }

    const analysisMatch = response.split("```html")[0];

    return {
      score,
      analysis: analysisMatch.trim(),
    };
  }

  // Intent Detection Function
  function detectIntent(text) {
    const t = text.toLowerCase();

    if (t.includes("casino") || t.includes("bet") || t.includes("gambling")) {
      return "casino";
    }

    if (
      t.includes("crypto") ||
      t.includes("bitcoin") ||
      t.includes("trading")
    ) {
      return "crypto";
    }

    if (t.includes("weight") || t.includes("diet") || t.includes("health")) {
      return "health";
    }

    if (
      t.includes("saas") ||
      t.includes("software") ||
      t.includes("platform") ||
      t.includes("app")
    ) {
      return "saas";
    }

    return "general";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  async function getResponse() {
    const intent = detectIntent(prompt);

    console.log("Detected Intent:", intent);
    setLoading(true);

    const text_prompt = `You are a professional affiliate marketing funnel builder and CRO expert.
    Detected Product Intent: ${intent}

Intent Design Rules:

casino:
- casino style design
- poker / roulette images
- gold / luxury feeling

crypto:
- fintech dashboard style
- trading charts
- tech feel

health:
- wellness style
- healthy lifestyle images

saas:
- SaaS dashboard style
- software UI images

general:
- modern SaaS landing page style

IMPORTANT:
Use the detected intent to guide:
- hero image
- copywriting tone
- section style
- CTA wording

The user will paste a raw affiliate offer requirement.

Your task:

1. Analyze the offer and detect:
   - Product type
   - Offer type (CPA / CPL / Deposit / Trial)
   - Conversion event
   - Target user intent
   - Monetization model

2. Based on the offer type, choose the best copywriting framework:
   - AIDA
   - PAS
   - FOMO
   - Direct Response

3. Generate a high-converting affiliate landing page as a single HTML file.

Strict Rules (Follow Carefully):

OUTPUT RULE:
- Return only ONE fenced \`\`\`html code block
- Use HTML + Tailwind CDN + Vanilla JS only
- No external libraries
- Mobile-first responsive design
- Replace all CTA links with {{AFFILIATE_LINK}}

STRUCTURE RULES:
Must include these sections in order:
1. Hero Section
2. About Product / About Service Section (MANDATORY)
3. Problem Section
4. Solution Section
5. Benefits Section (focus on benefits, not features)
6. SOCIAL PROOF RULE:
  Must include:
  - 3 testimonial cards
  - Name
  - Location
  - Star rating
  - Short realistic quote
 Cards must follow gradient card design system.
7. Urgency Section (with real countdown timer)
8. COMPARISON SECTION:
 If competitors exist, create comparison table:
 Columns:
- Feature
- This Product
- Typical Alternatives
Highlight advantages using check icons.
9. FAQ Section (5–8 questions)
10. Final CTA Section
11. Affiliate Disclaimer Section

SMART SECTION GENERATOR (VERY IMPORTANT):

AI must intelligently choose sections based on the product type.

Do NOT generate unnecessary sections.

Examples:

If product type is CPA / Sweepstakes:
Sections:
- Hero
- Benefits
- Simple CTA
- Urgency

If product type is Casino / Gambling:
Sections:
- Hero
- Bonus Offer
- Urgency Countdown
- Testimonials
- Final CTA

If product type is SaaS / Software:
Sections:
- Hero
- About Product
- Features
- Benefits
- FAQ
- Final CTA

If product type is Finance / Crypto:
Sections:
- Hero
- Trust Section
- How It Works
- FAQ
- Final CTA

If product type is Health:
Sections:
- Hero
- Problem
- Solution
- Benefits
- Testimonials
- FAQ
- CTA

Rules:
- Keep the landing page concise.
- Only include sections that increase conversion.
- Avoid unnecessary long pages.

HERO:
- Hero must use vibrant gradient background
- 2-column layout on desktop (text left, image right)
- Stack on mobile
- Include:
    Headline
    Subheadline
    CTA
    Premium Unsplash image relevant to niche

IMAGE RULES:
- Use high-quality Unsplash images
- Must match product category
- Use:
  class="w-full h-auto rounded-xl object-cover"
  loading="lazy"

HERO SECTION REQUIREMENTS (VERY IMPORTANT):

- Hero must include BOTH:
  1. Conversion-focused headline & subheadline
  2. A relevant high-quality Unsplash image

- Hero layout must use a 2-column grid on desktop:
  - Left: Text content + CTA
  - Right: Hero image
  - Mobile: Stack vertically

  HERO SIZE & STRUCTURE (CRITICAL):

- Hero section MUST be:
    class="w-full h-[560px] pt-24 pb-20"

- Hero must include inner container:
    class="max-w-7xl mx-auto px-6 h-full"

- Hero content must be vertically centered using:
    flex items-center

- Do NOT use min-h-screen
- Do NOT use 80vh

- Add horizontal padding using px-6 or px-8
- Keep layout clean and balanced

- Image must match product category:
  - Casino → luxury casino / poker / roulette
  - Finance → fintech dashboard / business professional
  - Health → healthy lifestyle / wellness
  - Software → SaaS dashboard mockup
  - Crypto → trading screens / blockchain visuals

- Image must feel premium, realistic, and conversion-focused.
- Do NOT use random stock images.

  HERO CTA BUTTON (VERY IMPORTANT):

- Hero must include ONE primary CTA button inside the banner.
- This CTA button MUST contain the affiliate link {{AFFILIATE_LINK}}.
- CTA must be visually dominant and eye-catching.
- Use a vibrant gradient background:
  from-indigo-500 via-purple-500 to-pink-500
- Add glow effect behind the button using a blurred gradient div.
- Add hover animation:
    hover:scale-105
    hover:shadow-2xl
    transition-all duration-300
- Button must be large, rounded-xl or rounded-2xl.
- Button text must be benefit-driven (example:
    "Claim Your Bonus Now",
    "Unlock Access",
    "Start Winning Today")
- CTA must look premium, modern, and conversion-focused.

HERO / BANNER SECTION (VERY IMPORTANT – MUST BE DIFFERENT FROM BODY):

- Hero section MUST NOT use dark plain background
- Hero must use a vibrant, attractive, premium gradient background
- Hero background must feel modern SaaS and visually impressive
- Use large gradient blends like:
    bg-gradient-to-r
    bg-gradient-to-br
    bg-gradient-to-tr

- Add premium effects:
    • soft radial glow
    • blurred gradient circles
    • background overlay with opacity
    • subtle glass shine effect

- Hero must look like a professional SaaS homepage banner
- Hero should feel visually rich, not flat
- Hero background should be UNIQUE every time

IMPORTANT:
- Only hero is colorful.
- Everything else returns to dark SaaS layout.

GRADIENT BACKGROUND (REQUIRED):

Use one of these ONLY:
1)
bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-slate-950/60
2)
bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60
3)
bg-gradient-to-br from-slate-900/60 to-indigo-900/40
4)
bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
5)
bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600
6)
bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500
7)
bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700
8)
bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700
9)
bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600

ABOUT SECTION RULES (HIGH-TRUST – NO IMAGE VERSION):

- This section is mandatory.
- Do NOT use any image in this section.
- Must use clean 2-column layout on desktop:
    Left: Main explanation
    Right: Trust / How It Works cards

CONTENT STRUCTURE (STRICT):

LAYOUT STRUCTURE (STRICT):

- Use 2-column grid on desktop:
    grid md:grid-cols-2 gap-12

- Both columns MUST be vertically centered using:
    items-center

- Main wrapper must use:
    class="w-full mx-auto px-6 py-20"

LEFT COLUMN:
- Clear headline explaining what the product/service is
- 2–3 concise paragraphs:
    • What it is
    • Who it is for
    • Why it exists
- Tone must be authoritative, confident, and benefit-driven
- Avoid generic filler phrases
- Must feel credible and expert-written

RIGHT COLUMN:
- 3 premium gradient cards explaining:
    Step 1 – How it works
    Step 2 – What user does
    Step 3 – What result they get
- Use THIS Tailwind class for all cards (MANDATORY):
  class="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-indigo-500/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60"

SECTION FLEXIBILITY RULE:

- If the offer is complex (SaaS, Finance, Software, Crypto, High-ticket):
  About section is mandatory.

- If the offer is simple CPA or sweepstakes:
  About section may be shortened or merged with Solution section.

- AI must intelligently decide based on offer type.

TRUST ELEMENTS (REQUIRED):
- Add 2–3 micro trust indicators such as:
    • Industry-backed
    • Thousands of users
    • Secure & encrypted
    • Transparent terms
    • Performance-driven
- Display these as small badge-style gradient chips

Add a subtle divider line under the section heading:
<div class="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8"></div>

DESIGN RULES:
- Must follow dark theme
- Must use premium gradient cards
- Must visually stand out from background
- Use p-8 spacing inside cards
- Use subtle hover animation
- No flat dark blocks
- Keep layout balanced and breathable

COPY STYLE:
- Clear
- Confident
- Conversion-focused
- No hype exaggeration
- No unrealistic promises

Keep the section concise but powerful.
It must build trust before moving into the Problem section.


CTA DISTRIBUTION RULE:
- CTA buttons must appear in these locations:
1. Hero section
2. After Benefits section
3. Final CTA section

- Each CTA must contain {{AFFILIATE_LINK}}.
- Add data-track attribute to each CTA
- CTA buttons must be visually dominant
- Use gradient background (indigo → purple → pink)
- Add hover:scale-105 and transition


STICKY CTA:
MOBILE STICKY CTA:
Create a bottom sticky CTA bar:
class="fixed bottom-0 left-0 w-full md:hidden"
Must include:
- CTA button
- affiliate link {{AFFILIATE_LINK}}
- Must not cover content.
- Must not block content
- Must use {{AFFILIATE_LINK}}


COUNTDOWN TIMER (REAL FUNCTIONAL):
Use Vanilla JS.
Timer must:
- Count down from 24:00:00
- Reset automatically every midnight
- Update every second using setInterval
- Display hours, minutes, seconds

CARDS:
- rounded-2xl
- shadow-2xl
- border border-white/10
- Use gradient dark glass style background
- No flat black boxes

URGENCY:
- Add visually strong urgency section
- Include working JS countdown

TRUST:
- Add trust badges
- Add affiliate disclaimer at bottom

SEO:
- Add meta title
- Add meta description
- Add FAQ schema JSON-LD

IMPORTANT:
- Only hero section can be colorful
- All other sections must remain dark
- Design must look like premium SaaS landing page

4. ALWAYS follow this layout system strictly:

- Use a main container: w-full mx-auto px-6
- All sections must use consistent vertical spacing: py-20
- Hero section must use h-[560px]
- Add pt-24 for top spacing
- Do NOT vertically center with justify-center
- Align content naturally with proper padding
- Never use random margins like mt-52 or absolute positioning unless necessary
- Use grid or flex properly aligned
- Keep text-center for hero headline only, other sections text-left
- All images must use: class="w-full h-auto rounded-xl object-cover" loading="lazy"

5. DESIGN SYSTEM (VERY IMPORTANT):

GLOBAL THEME:
- The main website body must use dark theme (bg-slate-950 or bg-slate-900)
BODY RULE (CRITICAL):
- The <body> tag MUST include:
    class="bg-slate-950 text-white"
- The entire page background must be dark.
- Never use solid white background on sections.
- All sections AFTER hero must follow dark Theme
- Use layered dark backgrounds for content sections

CARDS (MANDATORY GRADIENT SYSTEM – NO EXCEPTION):

ALL cards across ALL sections MUST use gradient background.
Solid or flat backgrounds are strictly forbidden.

Each card MUST include:

- relative
- rounded-2xl
- overflow-hidden
- border border-white/10
- backdrop-blur-xl
- shadow-2xl
- p-6 or p-8
- transition-all duration-300
- hover:scale-[1.03]
- hover:shadow-indigo-500/20

IMPORTANT:
- NEVER use bg-black
- NEVER use bg-slate-950 as main card background
- NEVER use flat dark background
- Every card must visually stand out from section background
- No plain div blocks allowed for features, benefits, testimonials, comparison items, FAQ items

Cards must look premium SaaS level with layered gradient depth.

INTERACTION RULES:

- On hover:
  hover:scale-[1.03]
  hover:shadow-2xl
  transition-all duration-300

- Add subtle glow on hover:
  hover:shadow-indigo-500/20

DEPTH ENHANCEMENT:

- Add subtle border glow effect using:
  before:absolute before:inset-0 before:rounded-2xl
  before:bg-gradient-to-r before:from-indigo-500/10 before:to-purple-500/10
  before:opacity-0 hover:before:opacity-100
  before:transition-opacity

Cards must look like a $50k SaaS landing page.
Not like a basic Tailwind dark box.

CRITICAL DARK THEME LOCK:
- After hero section, NO section is allowed to use:
    bg-white
    bg-gray-50
    bg-gray-100
    bg-slate-50
    bg-neutral-50

- All main sections must use:
    bg-slate-950
    bg-slate-900
    bg-slate-900/50
    bg-slate-800/40

- If any section uses a light background, it is considered invalid output.

- The overall page must remain visually dark except the hero gradient.

TEXT RULES:
- Hero heading → large, bold, white
- Hero subtext → light gray
- Accent words → text-indigo-400 or text-purple-400

- Add subtle gradients in hero or CTA sections
- Use soft glowing accents behind main CTA buttons
- Add rounded-2xl on cards and containers
- Use proper spacing to create breathing room

- Text hierarchy:
  Headings → text-white
  Subtext → text-gray-400
  Accent words → text-indigo-400 or text-purple-400

- Add hover transitions:
  hover:shadow-indigo-500/20
  hover:scale-105
  transition-all duration-300

This must look like a premium SaaS landing page, not a plain dark HTML page.

Return only a single fenced HTML code block.

Here is the raw affiliate offer requirement:

${prompt}

IMPORTANT:
- Automatically extract affiliate link if mentioned.
- If no affiliate link is present, use placeholder {{AFFILIATE_LINK}}.
- Replace all CTA buttons with {{AFFILIATE_LINK}}.
- Do NOT ask user any question.
- Make smart decisions automatically.

CRITICAL OUTPUT VALIDATION:

Before returning the HTML:
- Ensure all required sections exist
- Ensure minimum 3 CTA buttons exist
- Ensure countdown timer works
- Ensure dark theme is applied
- Ensure cards use gradient background

If any rule is missing, regenerate internally before responding.

AFTER generating the landing page HTML, provide a conversion analysis.

FORMAT:

Conversion Score: X/100

Strengths:
- bullet points

Improvements:
- bullet points

Then return the HTML code block.

IMPORTANT:
The analysis must appear BEFORE the html`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });

    const { score, analysis } = extractAnalysis(response.text);
    setConversionScore(score);
    setAnalysis(analysis);
    const cleanedHTML = extractCode(response.text);

    // replace cards with dynamic gradient
    const wrappedHTML = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white antialiased">
<div class="space-y-8">
  ${cleanedHTML.replace(/<div class="card">/g, () => {
    // randomly pick a gradient
    const randGradient =
      gradients[Math.floor(Math.random() * gradients.length)];
    return `<div class="card relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-indigo-500/20 ${randGradient}">`;
  })}
</div>
</body>
</html>
`;

    Setaicode(wrappedHTML);

    // try {
    //   Setaicode(extractCode(response.text));
    // } catch (err) {
    //   // Retry once automatically
    //   const retryResponse = await ai.models.generateContent({
    //     model: "gemini-2.5-flash",
    //     contents: text_prompt,
    //   });
    //   try {
    //     Setaicode(extractCode(retryResponse.text));
    //   } catch (err) {
    //     Setaicode(`
    //   <!DOCTYPE html>
    //   <html>
    //     <body style="background:black;color:red;">
    //       <h1>AI Error</h1>
    //       <p>Please try again with a clearer prompt.</p>
    //     </body>
    //   </html>
    // `);
    //   }
    // }

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
      <div>
        {conversionScore && (
          <div className="max-w-4xl mx-auto mt-10 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-indigo-400">
              AI Conversion Score: {conversionScore}/100
            </h2>

            <pre className="text-gray-300 mt-4 whitespace-pre-wrap">
              {analysis}
            </pre>
          </div>
        )}
      </div>
      <div ref={previewRef}>
        <Preview aicode={aicode} loading={loading}></Preview>
      </div>
    </>
  );
};

export default Container;
