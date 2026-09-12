
const ICON_CATEGORIES = [
  {
    icon: "📰",
    keywords: [
      "headline",
      "title",
      "heading",
      "hero",
      "banner",
      "subject",
      "caption",
      "tagline"
    ]
  },

  {
    icon: "🎣",
    keywords: [
      "hook",
      "opening",
      "intro",
      "attention",
      "scroll"
    ]
  },

  {
    icon: "👉",
    keywords: [
      "cta",
      "calltoaction",
      "action",
      "button",
      "click",
      "apply",
      "signup",
      "register",
      "buy",
      "download"
    ]
  },

  {
    icon: "🎁",
    keywords: [
      "offer",
      "deal",
      "discount",
      "bonus",
      "promotion",
      "coupon",
      "sale",
      "limited"
    ]
  },

  {
    icon: "🛍️",
    keywords: [
      "product",
      "service",
      "sell",
      "item",
      "solution",
      "package"
    ]
  },

  {
    icon: "🎯",
    keywords: [
      "audience",
      "customer",
      "buyer",
      "persona",
      "avatar",
      "target",
      "demographic",
      "segment"
    ]
  },

  {
    icon: "😣",
    keywords: [
      "pain",
      "problem",
      "challenge",
      "frustration",
      "issue",
      "objection"
    ]
  },

  {
    icon: "❤️",
    keywords: [
      "desire",
      "emotion",
      "dream",
      "motivation",
      "goal",
      "wish"
    ]
  },

  {
    icon: "✅",
    keywords: [
      "benefit",
      "value",
      "result",
      "advantage",
      "gain",
      "outcome"
    ]
  },

  {
    icon: "⚙️",
    keywords: [
      "feature",
      "specification",
      "function",
      "capability"
    ]
  },

  {
    icon: "💰",
    keywords: [
      "price",
      "pricing",
      "cost",
      "payment",
      "subscription",
      "revenue",
      "profit"
    ]
  },

  {
    icon: "🏆",
    keywords: [
      "usp",
      "unique",
      "advantage",
      "competitive"
    ]
  },

  {
    icon: "🛡️",
    keywords: [
      "trust",
      "testimonial",
      "review",
      "rating",
      "socialproof",
      "guarantee",
      "proof"
    ]
  },

  {
    icon: "📈",
    keywords: [
      "marketing",
      "strategy",
      "growth",
      "performance",
      "optimization",
      "conversion"
    ]
  },

  {
    icon: "🔍",
    keywords: [
      "seo",
      "keyword",
      "search",
      "meta"
    ]
  },

  {
    icon: "🖼️",
    keywords: [
      "image",
      "photo",
      "visual",
      "creative",
      "graphic",
      "design",
      "thumbnail"
    ]
  },

  {
    icon: "🚀",
    keywords: [
      "funnel",
      "journey",
      "pipeline",
      "flow",
      "checkout"
    ]
  },

  {
    icon: "📧",
    keywords: [
      "email",
      "newsletter",
      "capture",
      "lead"
    ]
  },

  {
    icon: "🌐",
    keywords: [
      "landing",
      "website",
      "page",
      "homepage",
      "section"
    ]
  },

  {
    icon: "📊",
    keywords: [
      "analysis",
      "insight",
      "finding",
      "report",
      "score"
    ]
  },

  {
    icon: "💡",
    keywords: [
      "recommend",
      "suggest",
      "idea",
      "tip",
      "improvement"
    ]
  }
];

export function getIcon(key = "") {

  const normalized = key
    .toLowerCase()
    .replace(/[_-]/g, "")
    .replace(/\s+/g, "");

  for (const category of ICON_CATEGORIES) {

    for (const keyword of category.keywords) {

      if (normalized.includes(keyword)) {
        return category.icon;
      }

    }

  }

  return "📌";
}


// const SECTION_VARIANTS = {
//   primary: {
//     bg: "bg-blue-500/10",
//     border: "border-blue-500/20",
//     icon: "text-blue-400",
//     heading: "text-blue-300",
//   },

//   success: {
//     bg: "bg-green-500/10",
//     border: "border-green-500/20",
//     icon: "text-green-400",
//     heading: "text-green-300",
//   },

//   warning: {
//     bg: "bg-amber-500/10",
//     border: "border-amber-500/20",
//     icon: "text-amber-400",
//     heading: "text-amber-300",
//   },

//   danger: {
//     bg: "bg-red-500/10",
//     border: "border-red-500/20",
//     icon: "text-red-400",
//     heading: "text-red-300",
//   },

//   purple: {
//     bg: "bg-purple-500/10",
//     border: "border-purple-500/20",
//     icon: "text-purple-400",
//     heading: "text-purple-300",
//   },

//   neutral: {
//     bg: "bg-zinc-500/10",
//     border: "border-zinc-500/20",
//     icon: "text-zinc-300",
//     heading: "text-white",
//   },
// };

// const ICON_CATEGORIES = [
//   {
//     icon: "📰",
//     variant: "primary",
//     keywords: [
//       "headline",
//       "title",
//       "heading",
//       "hero",
//       "banner",
//       "caption",
//       "tagline",
//       "subject"
//     ]
//   },

//   {
//     icon: "🎣",
//     variant: "primary",
//     keywords: [
//       "hook",
//       "opening",
//       "attention"
//     ]
//   },

//   {
//     icon: "👉",
//     variant: "success",
//     keywords: [
//       "cta",
//       "button",
//       "action",
//       "click",
//       "calltoaction"
//     ]
//   },

//   {
//     icon: "🎁",
//     variant: "warning",
//     keywords: [
//       "offer",
//       "discount",
//       "bonus",
//       "deal",
//       "sale",
//       "coupon"
//     ]
//   },

//   {
//     icon: "🛍️",
//     variant: "primary",
//     keywords: [
//       "product",
//       "service",
//       "sell",
//       "solution"
//     ]
//   },

//   {
//     icon: "🎯",
//     variant: "purple",
//     keywords: [
//       "audience",
//       "customer",
//       "buyer",
//       "persona",
//       "avatar",
//       "target"
//     ]
//   },

//   {
//     icon: "😣",
//     variant: "danger",
//     keywords: [
//       "pain",
//       "problem",
//       "challenge",
//       "issue"
//     ]
//   },

//   {
//     icon: "❤️",
//     variant: "danger",
//     keywords: [
//       "emotion",
//       "desire",
//       "dream"
//     ]
//   },

//   {
//     icon: "✅",
//     variant: "success",
//     keywords: [
//       "benefit",
//       "value",
//       "result",
//       "advantage"
//     ]
//   },

//   {
//     icon: "⚙️",
//     variant: "neutral",
//     keywords: [
//       "feature",
//       "function",
//       "specification"
//     ]
//   },

//   {
//     icon: "💰",
//     variant: "warning",
//     keywords: [
//       "price",
//       "pricing",
//       "cost",
//       "payment",
//       "revenue"
//     ]
//   },

//   {
//     icon: "🏆",
//     variant: "success",
//     keywords: [
//       "usp",
//       "unique",
//       "competitive"
//     ]
//   },

//   {
//     icon: "🛡️",
//     variant: "success",
//     keywords: [
//       "trust",
//       "testimonial",
//       "review",
//       "proof",
//       "guarantee"
//     ]
//   },

//   {
//     icon: "📈",
//     variant: "primary",
//     keywords: [
//       "marketing",
//       "strategy",
//       "growth",
//       "performance",
//       "conversion"
//     ]
//   },

//   {
//     icon: "🔍",
//     variant: "primary",
//     keywords: [
//       "seo",
//       "keyword",
//       "meta",
//       "search"
//     ]
//   },

//   {
//     icon: "🖼️",
//     variant: "purple",
//     keywords: [
//       "image",
//       "creative",
//       "visual",
//       "graphic",
//       "design"
//     ]
//   },

//   {
//     icon: "🚀",
//     variant: "primary",
//     keywords: [
//       "funnel",
//       "journey",
//       "pipeline"
//     ]
//   },

//   {
//     icon: "📧",
//     variant: "warning",
//     keywords: [
//       "email",
//       "lead",
//       "newsletter"
//     ]
//   },

//   {
//     icon: "🌐",
//     variant: "primary",
//     keywords: [
//       "landing",
//       "website",
//       "page",
//       "homepage",
//       "section"
//     ]
//   },

//   {
//     icon: "📊",
//     variant: "neutral",
//     keywords: [
//       "analysis",
//       "report",
//       "score",
//       "finding"
//     ]
//   },

//   {
//     icon: "💡",
//     variant: "warning",
//     keywords: [
//       "recommend",
//       "suggest",
//       "idea",
//       "tip"
//     ]
//   }
// ];

// export function getSectionMeta(key = "") {

//   const normalized = key
//     .toLowerCase()
//     .replace(/[_-]/g, "")
//     .replace(/\s+/g, "");

//   let bestMatch = null;
//   let highestScore = 0;

//   for (const category of ICON_CATEGORIES) {

//     let score = 0;

//     for (const keyword of category.keywords) {

//       if (normalized.includes(keyword)) {
//         score += keyword.length;
//       }

//     }

//     if (score > highestScore) {
//       highestScore = score;
//       bestMatch = category;
//     }

//   }

//   if (!bestMatch) {

//     bestMatch = {
//       icon: "📌",
//       variant: "neutral",
//     };

//   }

//   return {

//     icon: bestMatch.icon,

//     styles: SECTION_VARIANTS[bestMatch.variant],

//   };

// }