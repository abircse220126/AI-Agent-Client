
import React, { useState } from "react";
import Sidebar from "../Component/Sidebar/Sidebar";
import DashboardNavbar from "../Component/DashboardNavbar/DashboardNavbar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-64 bg-black border-r border-white/10 z-40
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <Sidebar />
      </div>

      {/* Overlay (mobile) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-20">
          <DashboardNavbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
