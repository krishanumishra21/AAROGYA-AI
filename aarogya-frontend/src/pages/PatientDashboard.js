import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { useOutletContext } from "react-router-dom";

const pulse = `@keyframes pulse-ring { 0%{transform:scale(.8);opacity:1} 100%{transform:scale(2);opacity:0} }
@keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`;

const statusColor = (s) =>
  ({ confirmed: "#10b981", pending: "#f59e0b", cancelled: "#ef4444" }[s?.toLowerCase()] || "#94a3b8");

function SkeletonBar({ w = "100%", h = 12, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite"
    }} />
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
          fetch("http://localhost:5000/api/appointments/my", { headers }),
          fetch("http://localhost:5000/api/prescriptions/my", { headers }),
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
  const upcoming = sorted[0];

  const filteredAppts = sorted.filter(
    (a) =>
      !search ||
      a.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRx = prescriptions.filter(
    (p) =>
      !search ||
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
      <style>{pulse}</style>
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", padding: "clamp(16px,4vw,32px)", maxWidth: 1200, margin: "0 auto", animation: "fadeSlideIn .5s ease" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              {getGreeting()}, {user?.name || "User"} 👋
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0" }}>Here's a summary of your health activity.</p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#f1f5f9", borderRadius: 12, padding: "8px 14px"
          }}>
            <span style={{ fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records…"
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#334155", width: "clamp(100px,15vw,180px)" }}
            />
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 10 }}>
                  <SkeletonBar w="40%" h={10} /> <SkeletonBar w="60%" h={28} r={6} /> <SkeletonBar w="70%" h={10} />
                </div>
              ))
            : stats.map((s, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 18, padding: 20,
                  border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,.04)",
                  transition: "transform .2s,box-shadow .2s", cursor: "default",
                  animation: `fadeSlideIn .4s ease ${i * .08}s both`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.04)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: s.color, animation: "pulse-ring 2s ease-out infinite" }} />
                    </div>
                  </div>
                  <p style={{ fontSize: "clamp(1.3rem,3vw,1.7rem)", fontWeight: 700, color: "#0f172a", margin: "10px 0 2px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: .5 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: s.color, margin: "4px 0 0", fontWeight: 500 }}>{s.sub}</p>
                </div>
              ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["appointments", "prescriptions"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: activeTab === t ? "#3b82f6" : "#f1f5f9",
              color: activeTab === t ? "#fff" : "#64748b",
              transition: "all .2s", textTransform: "capitalize"
            }}>
              {t === "appointments" ? `🗓️ Appointments (${appointments.length})` : `💊 Prescriptions (${prescriptions.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,.04)", padding: "clamp(14px,3vw,24px)", minHeight: 200 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <SkeletonBar key={i} h={54} r={12} />)}
            </div>
          ) : activeTab === "appointments" ? (
            filteredAppts.length === 0
              ? <p style={{ color: "#94a3b8", fontSize: 14 }}>No appointments found.</p>
              : filteredAppts.map((apt, i) => (
                  <div key={apt._id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
                    padding: "12px 14px", borderRadius: 14, marginBottom: 10,
                    background: "#f8fafc", border: "1px solid #f1f5f9",
                    transition: "all .2s", animation: `fadeSlideIn .3s ease ${i * .05}s both`,
                    cursor: "default"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dbeafe", color: "#3b82f6", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {apt.doctor?.name?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: "#1e293b", fontSize: 14, margin: 0 }}>{apt.doctor?.name}</p>
                        <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{apt.doctor?.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{new Date(apt.date).toLocaleDateString()}</span>
                      <span style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                        background: `${statusColor(apt.status)}18`, color: statusColor(apt.status)
                      }}>{apt.status}</span>
                    </div>
                  </div>
                ))
          ) : (
            filteredRx.length === 0
              ? <p style={{ color: "#94a3b8", fontSize: 14 }}>No prescriptions found.</p>
              : filteredRx.map((p, i) => (
                  <div key={p._id} style={{
                    borderRadius: 14, border: "1px solid #f1f5f9", marginBottom: 10, overflow: "hidden",
                    animation: `fadeSlideIn .3s ease ${i * .05}s both`
                  }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                      padding: "12px 16px", cursor: "pointer", background: expandedRx === p._id ? "#eff6ff" : "#f8fafc",
                      transition: "background .2s"
                    }} onClick={() => setExpandedRx(expandedRx === p._id ? null : p._id)}>
                      <div>
                        <p style={{ fontWeight: 600, color: "#1e293b", fontSize: 14, margin: 0 }}>{p.hospital?.name}</p>
                        <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0 0" }}>Dr. {p.doctor?.name} · {p.diagnosis}</p>
                      </div>
                      <span style={{ fontSize: 18, color: "#94a3b8", transition: "transform .2s", transform: expandedRx === p._id ? "rotate(180deg)" : "" }}>⌄</span>
                    </div>
                    {expandedRx === p._id && (
                      <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", background: "#fff" }}>
                        {p.medicines?.map((m, j) => (
                          <p key={j} style={{ fontSize: 13, color: "#475569", margin: "4px 0" }}>
                            💊 <strong>{m.name}</strong> — {m.dosage} ({m.frequency})
                          </p>
                        ))}
                        {p.fileUrl && (
                          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                            <button onClick={() => window.open(`http://localhost:5000${p.fileUrl}`, "_blank")}
                              style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid #3b82f6", color: "#3b82f6", background: "transparent", cursor: "pointer", fontWeight: 600 }}>
                              👁 View PDF
                            </button>
                            <a href={`http://localhost:5000${p.fileUrl}`} download
                              style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid #10b981", color: "#10b981", background: "transparent", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}>
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