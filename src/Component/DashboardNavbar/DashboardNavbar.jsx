const DashboardNavbar = ({ toggleMenu }) => {
  return (
    <div className=" sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 bg-black border-b border-white/10">
      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} className="md:hidden text-white text-2xl">
        ☰
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="bg-slate-800 text-white px-4 py-2 rounded-lg w-40 md:w-72"
      />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="bg-purple-600 px-3 py-1 rounded-lg text-sm">
          25 Credits
        </span>
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
          A
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
