import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const animations = `
@keyframes pulse-ring { 0%{transform:scale(.8);opacity:1} 100%{transform:scale(2);opacity:0} }
@keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer-light { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

.patient-dash {
  --bg-page:       #f8fafc;
  --bg-card:       #ffffff;
  --bg-muted:      #f1f5f9;
  --bg-hover:      #eff6ff;
  --bg-row:        #f8fafc;
  --border:        #f1f5f9;
  --border-hover:  #bfdbfe;
  --text-primary:  #0f172a;
  --text-secondary:#475569;
  --text-muted:    #94a3b8;
  --shadow-card:   0 2px 12px rgba(0,0,0,.04);
  --shadow-hover:  0 8px 24px;
  --input-bg:      #f1f5f9;
  --input-color:   #334155;
  --toggle-bg:     #e2e8f0;
  --toggle-knob:   #ffffff;
  --shimmer:       linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
  --accent-blue:   #3b82f6;
  --rx-header-bg:  #f8fafc;
  --rx-header-active: #eff6ff;
  --rx-body-bg:    #ffffff;
}

.patient-dash.dark {
  --bg-page:       #0d1117;
  --bg-card:       #161b22;
  --bg-muted:      #21262d;
  --bg-hover:      #1d2d44;
  --bg-row:        #1c2128;
  --border:        #30363d;
  --border-hover:  #388bfd;
  --text-primary:  #e6edf3;
  --text-secondary:#8b949e;
  --text-muted:    #6e7681;
  --shadow-card:   0 2px 12px rgba(0,0,0,.3);
  --shadow-hover:  0 8px 24px;
  --input-bg:      #21262d;
  --input-color:   #c9d1d9;
  --toggle-bg:     #388bfd;
  --toggle-knob:   #ffffff;
  --shimmer:       linear-gradient(90deg,#21262d 25%,#30363d 50%,#21262d 75%);
  --rx-header-bg:  #1c2128;
  --rx-header-active: #1d2d44;
  --rx-body-bg:    #161b22;
}

.patient-dash * { box-sizing: border-box; }

.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 50px;
  background: var(--toggle-bg);
  cursor: pointer;
  border: none;
  outline: none;
  transition: background .3s;
  flex-shrink: 0;
}
.toggle-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--toggle-knob);
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
  box-shadow: 0 2px 4px rgba(0,0,0,.2);
}
.patient-dash.dark .toggle-switch::after {
  transform: translateX(22px);
}

.stat-card {
  background: var(--bg-card);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  transition: transform .2s, box-shadow .2s, background .3s, border-color .3s;
  cursor: default;
  animation: fadeSlideIn .4s ease both;
}
.stat-card:hover {
  transform: translateY(-4px);
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all .2s;
  text-transform: capitalize;
}

.appt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  margin-bottom: 10px;
  background: var(--bg-row);
  border: 1px solid var(--border);
  transition: background .2s, border-color .2s;
  cursor: default;
}
.appt-row:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
}

.rx-card {
  border-radius: 14px;
  border: 1px solid var(--border);
  margin-bottom: 10px;
  overflow: hidden;
  transition: border-color .2s;
}
.rx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  background: var(--rx-header-bg);
  transition: background .2s;
}
.rx-header.active { background: var(--rx-header-active); }
.rx-body {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--rx-body-bg);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--input-bg);
  border-radius: 12px;
  padding: 8px 14px;
  transition: background .3s;
}
.search-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--input-color);
  width: clamp(100px,15vw,180px);
}
.search-wrap input::placeholder { color: var(--text-muted); }

.content-card {
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  padding: clamp(14px,3vw,24px);
  min-height: 200px;
  transition: background .3s, border-color .3s;
}

.skeleton-bar {
  background: var(--shimmer);
  background-size: 200% 100%;
  animation: shimmer-light 1.4s infinite;
}
`;

const statusColor = (s) =>
  ({ confirmed: "#10b981", pending: "#f59e0b", cancelled: "#ef4444" }[s?.toLowerCase()] || "#94a3b8");

function SkeletonBar({ w = "100%", h = 12, r = 8 }) {
  return (
    <div className="skeleton-bar" style={{ width: w, height: h, borderRadius: r }} />
  );
}

export default function PatientDashboard() {
  const { user } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [expandedRx, setExpandedRx] = useState(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("pd-theme") === "dark"; } catch { return false; }
  });

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("pd-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [apptRes, presRes] = await Promise.all([
          fetch("https://aarogya-ai-uugr.onrender.com/api/appointments/my", { headers }),
          fetch("https://aarogya-ai-uugr.onrender.com/api/prescriptions/my", { headers }),
        ]);
        setAppointments(apptRes.ok ? await apptRes.json() : []);
        setPrescriptions(presRes.ok ? await presRes.json() : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sorted = Array.isArray(appointments)
    ? [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = sorted.find(a => new Date(a.date) >= today);

  const filteredAppts = sorted.filter(
    (a) => !search ||
      a.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRx = prescriptions.filter(
    (p) => !search ||
      p.hospital?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Appointments", value: appointments.length, sub: "Since joining", color: "#3b82f6", icon: "🗓️" },
    {
      label: "Upcoming Visit",
      value: upcoming ? new Date(upcoming.date).toLocaleDateString() : "—",
      sub: upcoming ? `Dr. ${upcoming.doctor?.name}` : "Book an appointment",
      color: "#14b8a6", icon: "🏥",
    },
    { label: "Prescriptions", value: prescriptions.length, sub: "From all hospitals", color: "#8b5cf6", icon: "💊" },
    { label: "Health Score", value: "84%", sub: "Good — keep it up!", color: "#f59e0b", icon: "❤️" },
  ];

  return (
    <>
      <style>{animations}</style>
      <div
        className={`patient-dash${dark ? " dark" : ""}`}
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          padding: "clamp(16px,4vw,32px)",
          maxWidth: 1200,
          margin: "0 auto",
          animation: "fadeSlideIn .5s ease",
          background: "var(--bg-page)",
          minHeight: "100vh",
          transition: "background .3s",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 700, color: "var(--text-primary)", margin: 0, transition: "color .3s" }}>
              {getGreeting()}, {user?.name || "User"} 👋
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0", transition: "color .3s" }}>
              Here's a summary of your health activity.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Theme toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15 }}>☀️</span>
              <button
                className="toggle-switch"
                onClick={toggleDark}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                title={dark ? "Light mode" : "Dark mode"}
              />
              <span style={{ fontSize: 15 }}>🌙</span>
            </div>

            {/* Search */}
            <div className="search-wrap">
              <span style={{ fontSize: 14 }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records…"
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
          {loading
            ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="stat-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SkeletonBar w="40%" h={10} /> <SkeletonBar w="60%" h={28} r={6} /> <SkeletonBar w="70%" h={10} />
              </div>
            ))
            : stats.map((s, i) => (
              <div
                key={i}
                className="stat-card"
                style={{ animationDelay: `${i * .08}s` }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `var(--shadow-hover) ${s.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: s.color, animation: "pulse-ring 2s ease-out infinite" }} />
                  </div>
                </div>
                <p style={{ fontSize: "clamp(1.3rem,3vw,1.7rem)", fontWeight: 700, color: "var(--text-primary)", margin: "10px 0 2px", transition: "color .3s" }}>{s.value}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: .5, transition: "color .3s" }}>{s.label}</p>
                <p style={{ fontSize: 12, color: s.color, margin: "4px 0 0", fontWeight: 500 }}>{s.sub}</p>
              </div>
            ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["appointments", "prescriptions"].map((t) => (
            <button key={t} className="tab-btn" onClick={() => setActiveTab(t)} style={{
              background: activeTab === t ? "#3b82f6" : "var(--bg-muted)",
              color: activeTab === t ? "#fff" : "var(--text-secondary)",
            }}>
              {t === "appointments" ? `🗓️ Appointments (${appointments.length})` : `💊 Prescriptions (${prescriptions.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="content-card">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <SkeletonBar key={i} h={54} r={12} />)}
            </div>
          ) : activeTab === "appointments" ? (
            filteredAppts.length === 0
              ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No appointments found.</p>
              : filteredAppts.map((apt, i) => (
                <div
                  key={apt._id}
                  className="appt-row"
                  style={{ animation: `fadeSlideIn .3s ease ${i * .05}s both` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: dark ? "#1d2d44" : "#dbeafe", color: "#3b82f6", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .3s" }}>
                      {apt.doctor?.name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14, margin: 0, transition: "color .3s" }}>{apt.doctor?.name}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0, transition: "color .3s" }}>{apt.doctor?.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, transition: "color .3s" }}>{new Date(apt.date).toLocaleDateString()}</span>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                      background: `${statusColor(apt.status)}22`, color: statusColor(apt.status)
                    }}>{apt.status}</span>
                  </div>
                </div>
              ))
          ) : (
            filteredRx.length === 0
              ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No prescriptions found.</p>
              : filteredRx.map((p, i) => (
                <div key={p._id} className="rx-card" style={{ animation: `fadeSlideIn .3s ease ${i * .05}s both` }}>
                  <div
                    className={`rx-header${expandedRx === p._id ? " active" : ""}`}
                    onClick={() => setExpandedRx(expandedRx === p._id ? null : p._id)}
                  >
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14, margin: 0, transition: "color .3s" }}>{p.hospital?.name}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "2px 0 0", transition: "color .3s" }}>Dr. {p.doctor?.name} · {p.diagnosis}</p>
                    </div>
                    <span style={{ fontSize: 18, color: "var(--text-muted)", transition: "transform .2s, color .3s", transform: expandedRx === p._id ? "rotate(180deg)" : "" }}>⌄</span>
                  </div>
                  {expandedRx === p._id && (
                    <div className="rx-body">
                      {p.medicines?.map((m, j) => (
                        <p key={j} style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0", transition: "color .3s" }}>
                          💊 <strong style={{ color: "var(--text-primary)" }}>{m.name}</strong> — {m.dosage} ({m.frequency})
                        </p>
                      ))}
                      {p.fileUrl && (
                        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                          <button
                            onClick={() => window.open(`https://aarogya-ai-uugr.onrender.com${p.fileUrl}`, "_blank")}
                            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid #3b82f6", color: "#3b82f6", background: "transparent", cursor: "pointer", fontWeight: 600 }}
                          >
                            👁 View PDF
                          </button>
                          <a
                            href={`https://aarogya-ai-uugr.onrender.com${p.fileUrl}`}
                            download
                            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid #10b981", color: "#10b981", background: "transparent", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}
                          >
                            ⬇ Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}