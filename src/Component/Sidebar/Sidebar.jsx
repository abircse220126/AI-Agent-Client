import React, { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Folder,
  Layers,
  BarChart3,
  Settings,
  ChevronDown,
  Megaphone, // ✅ new icon
} from "lucide-react";
import { Link } from "react-router";

const Sidebar = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAds, setShowAds] = useState(false); // ✅ new state

  return (
    <div className="h-screen w-64 bg-black border-r border-gray-800 text-gray-300 flex flex-col">
      {/* Logo */}
      <div className="p-6 text-xl font-bold text-white border-b border-gray-800">
        AffilAI
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <Link to={`/dashboard`}>
          {" "}
          <SidebarItem icon={<LayoutDashboard size={18} />} text="Dashboard" />
        </Link>

        <SidebarItem icon={<Sparkles size={18} />} text="Generate Page" />

        <SidebarItem icon={<Folder size={18} />} text="My Landing Pages" />

        {/* 🔥 Ad Creative Dropdown */}
        <div>
          <div
            onClick={() => setShowAds(!showAds)}
            className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-900 transition"
          >
            <div className="flex items-center gap-3">
              <Megaphone size={18} />
              <span className="text-sm">Ad Creative</span>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${showAds ? "rotate-180" : ""}`}
            />
          </div>

          {/* Sub Ads */}
          {showAds && (
            <div className="ml-8 mt-2 space-y-2 text-sm text-gray-400">
              <div className="hover:text-white cursor-pointer">
                <Link to={"/dashboard/facebook"}> Facebook Ads</Link>
              </div>

              <div className="hover:text-white cursor-pointer">
                <Link> Google Ads</Link>
              </div>

              <div className="hover:text-white cursor-pointer">
                <Link>TikTok Ads</Link>
              </div>

              <div className="hover:text-white cursor-pointer">
                <Link>Native Ads</Link>
              </div>
            </div>
          )}
        </div>

        {/* Templates Dropdown */}
        <div>
          <div
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-900 transition"
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span className="text-sm">Templates</span>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                showTemplates ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Sub Templates */}
          {showTemplates && (
            <div className="ml-8 mt-2 space-y-2 text-sm text-gray-400">
              <div className="hover:text-white cursor-pointer">
                SaaS Product
              </div>

              <div className="hover:text-white cursor-pointer">
                Health & Fitness
              </div>

              <div className="hover:text-white cursor-pointer">
                Digital Course
              </div>

              <div className="hover:text-white cursor-pointer">
                App Promotion
              </div>

              <div className="hover:text-white cursor-pointer">
                E-commerce Product
              </div>
            </div>
          )}
        </div>

        <SidebarItem icon={<BarChart3 size={18} />} text="Analytics" />
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-800">
        <SidebarItem icon={<Settings size={18} />} text="Settings" />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-900 transition">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default Sidebar;
