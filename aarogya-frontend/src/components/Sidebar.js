import React from "react";
import { NavLink } from "react-router-dom";

const navConfig = {
  patient: [
    { to: "/dashboard",    label: "Dashboard",       icon: "🏠" },
    { to: "/appointments", label: "Book Appointment", icon: "📅" },
    { to: "/chatbot",      label: "Chatbot",          icon: "🤖" },
    { to: "/profile",      label: "Profile",          icon: "👤" },
  ],
  doctor: [
    { to: "/dashboard",    label: "Dashboard",            icon: "🏠" },
    { to: "/appointments", label: "Patient Appointments", icon: "📋" },
    { to: "/profile",      label: "Profile",              icon: "👤" },
  ],
  admin: [
    { to: "/dashboard",    label: "Dashboard",           icon: "🏠" },
    { to: "/appointments", label: "Manage Appointments", icon: "⚙️" },
    { to: "/profile",      label: "Profile",             icon: "👤" },
  ],
};

const roleConfig = {
  patient: {
    label: "Patient",
    gradient: "from-blue-500 to-blue-700",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    activeBg: "from-blue-500 to-blue-700",
    activeShadow: "rgba(59,130,246,0.35)",
    dot: "bg-blue-400",
  },
  doctor: {
    label: "Doctor",
    gradient: "from-emerald-500 to-teal-700",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    activeBg: "from-emerald-500 to-teal-600",
    activeShadow: "rgba(16,185,129,0.35)",
    dot: "bg-emerald-400",
  },
  admin: {
    label: "Hospital Admin",
    gradient: "from-violet-500 to-purple-700",
    badge: "bg-violet-50 text-violet-600 border-violet-100",
    activeBg: "from-violet-500 to-purple-700",
    activeShadow: "rgba(139,92,246,0.35)",
    dot: "bg-violet-400",
  },
};

export default function Sidebar({ open, onClose, role }) {
  const items  = navConfig[role]  || [];
  const config = roleConfig[role] || roleConfig.patient;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        .sidebar-nav-active {
          background: linear-gradient(135deg, var(--active-from), var(--active-to));
          color: #fff !important;
          box-shadow: 0 4px 14px var(--active-shadow);
        }
        .sidebar-nav-inactive:hover {
          background: #f8fafc;
          color: #1e293b !important;
        }
        .sidebar-nav-inactive:hover .nav-icon {
          transform: scale(1.15);
        }
        .nav-icon {
          transition: transform 0.2s ease;
          display: inline-block;
        }
        .logout-btn:hover {
          background: #fef2f2;
          color: #ef4444 !important;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.18s cubic-bezier(.4,0,.2,1);
          text-decoration: none;
          position: relative;
        }
        .active-pip {
          position: absolute;
          right: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          background: "#fff",
          borderRight: "1px solid #f1f5f9",
          boxShadow: "4px 0 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-lg flex-shrink-0`}
            style={{ boxShadow: `0 4px 14px ${config.activeShadow}` }}
          >
            ❤️
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-800 leading-none block">
              Aarogya
            </span>
            <span className="text-xs text-slate-400 font-medium leading-tight">
              Health Platform
            </span>
          </div>
        </div>

        {/* ── User mini-card ── */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #f8fafc" }}>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
            <div
              className={`w-8 h-8 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
            >
              {config.label.charAt(0)}
            </div>
            <div className="min-w-0">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest border rounded-full px-2 py-0.5 ${config.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
          <p className="px-3 pb-2 text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Menu
          </p>
          {items.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-nav-active" : "sidebar-nav-inactive text-slate-500"}`
              }
              style={({ isActive }) => isActive ? {
                "--active-from": config.activeBg.replace("from-","").split(" ")[0],
                "--active-shadow": config.activeShadow,
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <span className="nav-icon text-base w-5 text-center">{icon}</span>
                  <span className="flex-1">{label}</span>
                  {isActive && <span className="active-pip" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom: help + logout ── */}
        <div className="px-3 pb-4" style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
          {/* Help card */}
          <div
            className={`mb-3 rounded-2xl px-4 py-3 bg-gradient-to-br ${config.gradient} text-white`}
            style={{ boxShadow: `0 4px 16px ${config.activeShadow}` }}
          >
            <p className="text-xs font-bold mb-0.5">Need help?</p>
            <p className="text-xs opacity-70 leading-snug">Contact our 24/7 support team for assistance.</p>
            <button className="mt-2 text-xs bg-white/20 hover:bg-white/30 transition rounded-lg px-3 py-1 font-semibold">
              Get Support
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="logout-btn flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all w-full"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}