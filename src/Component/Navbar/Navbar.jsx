import React from "react";

const Navbar = () => {
  return (
    <>
      <div >
        <nav class="w-full bg-black border-b border-gray-800">
          <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  W
                </div>
                <span class="text-white text-lg font-semibold">WebBuilder</span>
              </div>

              <div class="hidden md:flex items-center gap-8">
                <a href="#" class="text-gray-400 hover:text-white transition">
                  Features
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition">
                  Templates
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition">
                  Pricing
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition">
                  Docs
                </a>
              </div>

              <div class="hidden md:flex items-center gap-4">
                <a href="#" class="text-gray-400 hover:text-white transition">
                  Login
                </a>
                <a
                  href="#"
                  class="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 transition"
                >
                  Build Website
                </a>
              </div>

              <div class="md:hidden text-gray-400">☰</div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
