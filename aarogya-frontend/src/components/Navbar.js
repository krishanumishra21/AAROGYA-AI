import React, { useState, useRef, useEffect } from "react";

const roleLabels = {
  patient: "Patient",
  doctor: "Doctor",
  admin: "Hospital Admin",
};

const roleColors = {
  patient: "from-blue-400 to-blue-600",
  doctor:  "from-emerald-400 to-teal-600",
  admin:   "from-violet-400 to-purple-600",
};

export default function Navbar({ role, user, onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Appointment confirmed for 3 PM", time: "2m ago",  read: false },
    { id: 2, text: "Dr. Sharma reviewed your report", time: "1h ago", read: false },
    { id: 3, text: "Prescription renewed successfully", time: "3h ago",read: true  },
  ]);

  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);

  const unread = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current    && !notifRef.current.contains(e.target))    setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const markRead    = (id) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const gradientClass = roleColors[role] || roleColors.patient;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .nav-dropdown { animation: dropIn 0.18s cubic-bezier(.4,0,.2,1) forwards; }
        .notif-item:hover { background: #f8fafc; }
        .chevron { transition: transform 0.2s ease; }
        .chevron.open { transform: rotate(180deg); }
        .user-btn:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; }
        .notif-btn:hover { background: #f1f5f9 !important; }
      `}</style>

      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm">

        {/* ── Left ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Aarogya</h1>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(o => !o); setDropdownOpen(false); }}
              className="notif-btn relative p-2 rounded-xl border border-slate-200 bg-white transition"
              style={{ lineHeight: 0 }}
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                  style={{ fontSize: 9, fontWeight: 700 }}>
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="nav-dropdown absolute right-0 mt-2 bg-white rounded-xl border border-slate-100 shadow-xl z-50"
                style={{ width: 300 }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notifications</p>
                  {unread > 0 && (
                    <button onClick={markAllRead}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium transition">
                      Mark all read
                    </button>
                  )}
                </div>
                <div>
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => markRead(n.id)}
                      className="notif-item w-full text-left flex items-start gap-3 px-4 py-3 transition border-b border-slate-50 last:border-0">
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-slate-200" : "bg-blue-500"}`} />
                      <div>
                        <p className={`text-sm leading-snug ${n.read ? "text-slate-400" : "text-slate-700 font-medium"}`}>
                          {n.text}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {notifications.every(n => n.read) && (
                  <p className="text-center text-xs text-slate-400 py-4">You're all caught up 🎉</p>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setDropdownOpen(o => !o); setNotifOpen(false); }}
              className="user-btn flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-xl border border-slate-200 bg-white transition shadow-sm"
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xs font-bold`}>
                {initial}
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-700 leading-tight">{user?.name || "User"}</p>
                <p className="text-xs text-slate-400 leading-tight">{roleLabels[user?.role] || roleLabels[role]}</p>
              </div>

              <svg className={`chevron w-4 h-4 text-slate-400 ${dropdownOpen ? "open" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="nav-dropdown absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-100 shadow-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Role badge */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    {roleLabels[user?.role] || roleLabels[role]}
                  </span>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {[
                    { icon: "👤", label: "View Profile" },
                    { icon: "⚙️", label: "Settings"     },
                    { icon: "🔒", label: "Change Password" },
                  ].map(({ icon, label }) => (
                    <button key={label}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition">
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition font-medium">
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}