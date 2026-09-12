import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LayoutDashboard,
  Sparkles,
  Folder,
  Layers,
  BarChart3,
  ChevronDown,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router";

const Sidebar = ({ history, onSelectHistory, loadHistory }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameText, setRenameText] = useState("");
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const MENU_HEIGHT = 160;

  const handleRename = async (id) => {
    if (!renameText.trim()) return;

    await fetch(`http://localhost:5000/chat/rename/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: renameText }),
    });

    setRenameId(null);
    setRenameText("");

    // reload history from parent
    if (typeof loadHistory === "function") {
      loadHistory?.();
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this chat?");
    if (!ok) return;

    await fetch(`http://localhost:5000/chat/delete/${id}`, {
      method: "DELETE",
    });

    setOpenMenuId(null);

    if (typeof loadHistory === "function") {
      loadHistory?.();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {" "}
      {/* <div className="h-screen w-64 bg-black border-r border-gray-800 text-gray-300 flex flex-col"> */}
      <div className="h-screen w-74 bg-black border-r border-gray-800 text-gray-300 flex flex-col">
        {/* Logo */}
        <div className="p-6 text-xl font-bold text-white border-b border-gray-800">
          AffilAI
        </div>

        {/* Menu */}
        {/* <div className="flex-1 px-4 py-6 space-y-2"> */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto ">
          <Link to={`/dashboard`}>
            {" "}
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              text="Dashboard "
            />
          </Link>

          <Link to={`/dashboard`}>
            {" "}
            <SidebarItem icon={<Sparkles size={18} />} text="Generate Page" />
          </Link>

          {/* 🔥 Ad Creative Dropdown */}
          <div>
            <div
              onClick={() => setShowAds(!showAds)}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-900 transition"
            >
              <div className="flex items-center gap-3">
                <Megaphone size={18} />
                <Link to={"/dashboard/ad-creative"}>
                  {" "}
                  <span className="text-lg">Ad Creative</span>
                </Link>
              </div>

              {/* <ChevronDown
                size={16}
                className={`transition-transform ${showAds ? "rotate-180" : ""}`}
              /> */}
            </div>

            {/* Sub Ads */}
            {/* {showAds && (
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
            )} */}
          </div>

          {/* Templates Dropdown */}
          <div>
            <div
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-900 transition"
            >
              <div className="flex items-center gap-3">
                <Layers size={18} />
                <span className="text-lg">Templates</span>
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

        {/* History section  */}
        <div className="border-t border-gray-800 p-4">
          <h2 className="text-gray-400 text-xs uppercase mb-3">History</h2>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history && history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item._id}
                  className="relative group px-3 py-2 rounded text-sm text-white hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                >
                  {/* LEFT: TITLE */}
                  <div
                    className="truncate flex-1"
                    onClick={() => onSelectHistory(item._id)}
                  >
                    {renameId === item._id ? (
                      <input
                        value={renameText}
                        onChange={(e) => setRenameText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRename(item._id);
                          }
                        }}
                        onBlur={() => handleRename(item._id)}
                        className="bg-gray-900 text-white px-2 py-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      item.title || "Untitled Chat"
                    )}
                  </div>

                  {/* RIGHT: 3 DOTS (visible on hover) */}
                  <div
                    className="relative"
                    ref={openMenuId === item._id ? menuRef : null}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        const rect = e.currentTarget.getBoundingClientRect();

                        const GAP = 10;

                        let top = rect.top + rect.height + GAP;
                        let left = rect.right + 8;
                        const menuEstimatedHeight = 220;

                        if (top + menuEstimatedHeight > window.innerHeight) {
                          top = rect.top - menuEstimatedHeight - GAP;
                        }

                        top = Math.max(
                          GAP,
                          Math.min(
                            top,
                            window.innerHeight - menuEstimatedHeight - GAP,
                          ),
                        );

                        setMenuPosition({ top, left });
                        setOpenMenuId((prev) =>
                          prev === item._id ? null : item._id,
                        );
                      }}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-white px-2"
                    >
                      ⋯
                    </button>

                    {/* POPUP MENU */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No history found</p>
            )}

            {openMenuId &&
              createPortal(
                <div
                  ref={menuRef}
                  style={{
                    position: "fixed",
                    top: menuPosition.top,
                    left: menuPosition.left,
                  }}
                  className="bg-[#202123] border border-gray-700 rounded-xl shadow-2xl w-44 z-[99999] overflow-hidden"
                >
                  <button
                    onClick={() => {
                      const item = history.find((h) => h._id === openMenuId);

                      setRenameId(openMenuId);
                      setRenameText(item?.title || "");
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[#2a2b32] text-white text-sm"
                  >
                    ✏️ Rename
                  </button>

                  <button
                    onClick={() => handleDelete(openMenuId)}
                    className="w-full text-left px-4 py-3 hover:bg-[#2a2b32] text-red-400 text-sm"
                  >
                    🗑 Delete
                  </button>
                </div>,
                document.body,
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-900 transition">
      {icon}
      <span className="text-lg">{text}</span>
    </div>
  );
};

export default Sidebar;
