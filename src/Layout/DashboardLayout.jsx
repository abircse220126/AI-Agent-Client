
import React, { useState, useEffect } from "react";
import Sidebar from "../Component/Sidebar/Sidebar";
import DashboardNavbar from "../Component/DashboardNavbar/DashboardNavbar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // load all history
  const loadHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.log(err);
    }
  };

  // load single chat
  const openChat = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/history/${id}`);
      const data = await res.json();
      setSelectedChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  // load history on refresh
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-black">
    {/* <div className="h-screen bg-black overflow-hidden"> */}
      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-64 bg-black border-r border-white/10 z-40
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <Sidebar history={history} onSelectHistory={openChat}  loadHistory={loadHistory}/>
      </div>

      {/* overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* main */}
      {/* <div className="md:ml-64 flex flex-col min-h-screen"> */}
      <div className="md:ml-64 flex flex-col h-screen">
        <div className="sticky top-0 z-20">
          <DashboardNavbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        </div>

        {/* <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6"> */}
        <div className="flex-1 overflow-hidden px-4 md:px-6">
        
          <Outlet context={{ selectedChat, setSelectedChat,loadHistory}} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
