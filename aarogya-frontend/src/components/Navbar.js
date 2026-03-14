import React, { useState, useRef, useEffect } from "react";

const roleLabels = {
  patient: "Patient",
  doctor:  "Doctor",
  admin:   "Hospital Admin",
};

const roleColors = {
  patient: "from-blue-400 to-blue-600",
  doctor:  "from-emerald-400 to-teal-600",
  admin:   "from-violet-400 to-purple-600",
};

const navbarStyles = `
  .navbar-root {
    --nb-bg:            rgba(255,255,255,0.85);
    --nb-border:        #f1f5f9;
    --nb-shadow:        0 1px 8px rgba(0,0,0,0.06);
    --nb-title:         #1e293b;
    --nb-icon:          #64748b;
    --nb-btn-bg:        #ffffff;
    --nb-btn-border:    #e2e8f0;
    --nb-btn-hover-bg:  #f8fafc;
    --nb-btn-hover-border: #cbd5e1;
    --nb-dropdown-bg:   #ffffff;
    --nb-dropdown-border: #f1f5f9;
    --nb-dropdown-shadow: 0 8px 24px rgba(0,0,0,0.10);
    --nb-text-primary:  #334155;
    --nb-text-secondary:#94a3b8;
    --nb-text-muted:    #64748b;
    --nb-divider:       #f1f5f9;
    --nb-item-hover:    #f8fafc;
    --nb-notif-unread:  #1e293b;
    --nb-badge-bg:      #f1f5f9;
    --nb-badge-color:   #475569;
    --nb-toggle-bg:     #e2e8f0;
    --nb-toggle-knob:   #ffffff;
    --nb-menu-hover:    #f1f5f9;
  }

  .navbar-root.dark {
    --nb-bg:            rgba(22,27,34,0.92);
    --nb-border:        #30363d;
    --nb-shadow:        0 1px 8px rgba(0,0,0,0.35);
    --nb-title:         #e6edf3;
    --nb-icon:          #8b949e;
    --nb-btn-bg:        #21262d;
    --nb-btn-border:    #30363d;
    --nb-btn-hover-bg:  #2d333b;
    --nb-btn-hover-border: #484f58;
    --nb-dropdown-bg:   #1c2128;
    --nb-dropdown-border: #30363d;
    --nb-dropdown-shadow: 0 8px 24px rgba(0,0,0,0.5);
    --nb-text-primary:  #e6edf3;
    --nb-text-secondary:#6e7681;
    --nb-text-muted:    #8b949e;
    --nb-divider:       #30363d;
    --nb-item-hover:    #21262d;
    --nb-notif-unread:  #e6edf3;
    --nb-badge-bg:      #2d333b;
    --nb-badge-color:   #8b949e;
    --nb-toggle-bg:     #388bfd;
    --nb-toggle-knob:   #ffffff;
    --nb-menu-hover:    #2d333b;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .nb-dropdown { animation: dropIn 0.18s cubic-bezier(.4,0,.2,1) forwards; }

  .nb-header {
    background: var(--nb-bg);
    border-bottom: 1px solid var(--nb-border);
    box-shadow: var(--nb-shadow);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background .3s, border-color .3s, box-shadow .3s;
  }

  .nb-title {
    color: var(--nb-title);
    transition: color .3s;
  }

  .nb-icon-btn {
    position: relative;
    padding: 8px;
    border-radius: 12px;
    border: 1px solid var(--nb-btn-border);
    background: var(--nb-btn-bg);
    cursor: pointer;
    line-height: 0;
    transition: background .18s, border-color .18s;
  }
  .nb-icon-btn:hover {
    background: var(--nb-btn-hover-bg);
    border-color: var(--nb-btn-hover-border);
  }
  .nb-icon-btn svg { color: var(--nb-icon); transition: color .3s; }

  .nb-user-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 14px 6px 10px;
    border-radius: 12px;
    border: 1px solid var(--nb-btn-border);
    background: var(--nb-btn-bg);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    transition: background .18s, border-color .18s;
  }
  .nb-user-btn:hover {
    background: var(--nb-btn-hover-bg);
    border-color: var(--nb-btn-hover-border);
  }

  .nb-dropdown-panel {
    background: var(--nb-dropdown-bg);
    border: 1px solid var(--nb-dropdown-border);
    box-shadow: var(--nb-dropdown-shadow);
    border-radius: 14px;
    overflow: hidden;
    transition: background .3s, border-color .3s;
  }

  .nb-divider { border-color: var(--nb-divider); }

  .nb-dropdown-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--nb-divider);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nb-user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--nb-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color .3s;
  }
  .nb-user-email {
    font-size: 12px;
    color: var(--nb-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color .3s;
  }

  .nb-role-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    background: var(--nb-badge-bg);
    color: var(--nb-badge-color);
    transition: background .3s, color .3s;
  }

  .nb-menu-item {
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    font-size: 13.5px;
    color: var(--nb-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background .15s, color .15s;
  }
  .nb-menu-item:hover {
    background: var(--nb-item-hover);
    color: var(--nb-text-primary);
  }
  .nb-menu-item.danger { color: #ef4444; }
  .nb-menu-item.danger:hover { background: #fef2f2; color: #dc2626; }
  .navbar-root.dark .nb-menu-item.danger:hover { background: #2d1515; color: #f87171; }

  .nb-notif-item {
    width: 100%;
    text-align: left;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--nb-divider);
    background: transparent;
    border-left: none;
    border-right: none;
    border-top: none;
    cursor: pointer;
    transition: background .15s;
  }
  .nb-notif-item:last-child { border-bottom: none; }
  .nb-notif-item:hover { background: var(--nb-item-hover); }
  .nb-notif-text-unread { font-size: 13px; line-height: 1.4; color: var(--nb-notif-unread); font-weight: 500; transition: color .3s; }
  .nb-notif-text-read   { font-size: 13px; line-height: 1.4; color: var(--nb-text-secondary); transition: color .3s; }
  .nb-notif-time        { font-size: 11px; color: var(--nb-text-secondary); margin-top: 2px; transition: color .3s; }

  .nb-notif-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid var(--nb-divider);
  }
  .nb-notif-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--nb-text-muted);
    transition: color .3s;
  }
  .nb-mark-read {
    font-size: 12px;
    font-weight: 500;
    color: #3b82f6;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color .15s;
  }
  .nb-mark-read:hover { color: #1d4ed8; }

  .nb-chevron { transition: transform 0.2s ease; color: var(--nb-text-secondary); }
  .nb-chevron.open { transform: rotate(180deg); }

  /* Theme toggle inside dropdown */
  .nb-theme-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-top: 1px solid var(--nb-divider);
  }
  .nb-theme-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    color: var(--nb-text-muted);
    transition: color .3s;
  }
  .nb-toggle {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 50px;
    background: var(--nb-toggle-bg);
    border: none;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
    transition: background .3s;
  }
  .nb-toggle::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--nb-toggle-knob);
    box-shadow: 0 2px 4px rgba(0,0,0,.2);
    transition: transform .3s cubic-bezier(.34,1.56,.64,1);
  }
  .navbar-root.dark .nb-toggle::after { transform: translateX(20px); }

  .nb-hamburger {
    padding: 8px;
    border-radius: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--nb-icon);
    transition: background .15s, color .15s;
  }
  .nb-hamburger:hover { background: var(--nb-menu-hover); }
`;

export default function Navbar({ role, user, onMenuClick, dark, onToggleDark }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Appointment confirmed for 3 PM",    time: "2m ago",  read: false },
    { id: 2, text: "Dr. Sharma reviewed your report",   time: "1h ago",  read: false },
    { id: 3, text: "Prescription renewed successfully", time: "3h ago",  read: true  },
  ]);

  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);
  const unread = notifications.filter(n => !n.read).length;

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
      <style>{navbarStyles}</style>

      <div className={`navbar-root${dark ? " dark" : ""}`}>
        <header className="nb-header sticky top-0 z-10 flex items-center justify-between h-16 px-6">

          {/* ── Left ── */}
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="nb-hamburger lg:hidden">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="nb-title text-lg font-bold tracking-tight">Aarogya</h1>
          </div>

          {/* ── Right ── */}
          <div className="flex items-center gap-2">

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                className="nb-icon-btn"
                onClick={() => { setNotifOpen(o => !o); setDropdownOpen(false); }}
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <div className="nb-dropdown nb-dropdown-panel absolute right-0 mt-2 z-50" style={{ width: 300 }}>
                  <div className="nb-notif-header">
                    <p className="nb-notif-title">Notifications</p>
                    {unread > 0 && (
                      <button className="nb-mark-read" onClick={markAllRead}>Mark all read</button>
                    )}
                  </div>
                  <div>
                    {notifications.map(n => (
                      <button key={n.id} className="nb-notif-item" onClick={() => markRead(n.id)}>
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-slate-300" : "bg-blue-500"}`} />
                        <div>
                          <p className={n.read ? "nb-notif-text-read" : "nb-notif-text-unread"}>{n.text}</p>
                          <p className="nb-notif-time">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {notifications.every(n => n.read) && (
                    <p className="nb-notif-title text-center py-4" style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}>
                      You're all caught up 🎉
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="nb-user-btn"
                onClick={() => { setDropdownOpen(o => !o); setNotifOpen(false); }}
              >
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {initial}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="nb-user-name" style={{ fontSize: 12, marginBottom: 1 }}>{user?.name || "User"}</p>
                  <p className="nb-user-email" style={{ fontSize: 11 }}>{roleLabels[user?.role] || roleLabels[role]}</p>
                </div>
                <svg className={`nb-chevron w-4 h-4 ${dropdownOpen ? "open" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nb-dropdown nb-dropdown-panel absolute right-0 mt-2 z-50" style={{ width: 210 }}>
                  {/* Header */}
                  <div className="nb-dropdown-header">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="nb-user-name">{user?.name || "User"}</p>
                      <p className="nb-user-email">{user?.email}</p>
                    </div>
                  </div>

                  {/* Role badge */}
                  <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--nb-divider)" }}>
                    <span className="nb-role-badge">{roleLabels[user?.role] || roleLabels[role]}</span>
                  </div>

                  {/* Menu items */}
                  <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                    {[
                      { icon: "👤", label: "View Profile"     },
                      { icon: "⚙️", label: "Settings"         },
                      { icon: "🔒", label: "Change Password"  },
                    ].map(({ icon, label }) => (
                      <button key={label} className="nb-menu-item">
                        <span>{icon}</span> {label}
                      </button>
                    ))}
                  </div>

                  {/* Theme toggle row */}
                  <div className="nb-theme-row">
                    <span className="nb-theme-label">
                      <span>{dark ? "🌙" : "☀️"}</span>
                      <span>{dark ? "Dark" : "Light"}</span>
                    </span>
                    <button
                      className="nb-toggle"
                      onClick={onToggleDark}
                      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                    />
                  </div>

                  {/* Logout */}
                  <div style={{ borderTop: "1px solid var(--nb-divider)", paddingTop: 4, paddingBottom: 4 }}>
                    <button onClick={handleLogout} className="nb-menu-item danger">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}