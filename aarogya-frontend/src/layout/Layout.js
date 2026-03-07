import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";// adjust path if needed

export default function Layout({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={user?.role}
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col lg:ml-64">

        {/* ── Top bar (mobile) ── */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-100 shadow-sm lg:hidden">

          {/* Hamburger button */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="flex flex-col justify-center items-center w-9 h-9 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-all gap-[5px]"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 ${sidebarOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 ${sidebarOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 ${sidebarOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>

          {/* App name in mobile header */}
          <span className="text-base font-bold text-slate-800 tracking-tight">Aarogya</span>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet context={{ user }} />
        </main>

      </div>
    </div>
  );
}