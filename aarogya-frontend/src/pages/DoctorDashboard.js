import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aurora   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-26px) scale(1.05)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn    { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }

  .doc-root {
    font-family:'Manrope',sans-serif;
    min-height:100vh;
    background:#080b1a;
    position:relative;
    overflow-x:hidden;
  }
  .doc-root::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 70% 60% at 10% 20%,  #065f4670 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 90% 15%,  #0ea5e955 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 50% 90%,  #a7f3d045 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 80% 65%,  #10b98135 0%, transparent 50%);
    background-size:200% 200%;
    animation:aurora 14s ease infinite;
  }
  .orb { position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(72px);opacity:.28; }
  .orb1{ width:320px;height:320px;top:-70px;left:-70px;background:#059669;animation:floatOrb 10s ease-in-out infinite; }
  .orb2{ width:280px;height:280px;bottom:-50px;right:-50px;background:#06b6d4;animation:floatOrb 12s ease-in-out infinite 3s; }
  .orb3{ width:220px;height:220px;top:40%;left:60%;background:#7c3aed;animation:floatOrb 15s ease-in-out infinite 6s; }

  .content { position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:clamp(16px,4vw,36px); }

  .glass {
    background:rgba(255,255,255,.07);
    backdrop-filter:blur(22px);
    -webkit-backdrop-filter:blur(22px);
    border:1px solid rgba(255,255,255,.13);
    border-radius:24px;
  }

  /* Stat cards */
  .stat-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px; }
  .stat-card {
    padding:20px;border-radius:20px;border:1px solid rgba(255,255,255,.1);
    backdrop-filter:blur(20px);position:relative;overflow:hidden;
    transition:transform .25s,box-shadow .25s;cursor:default;
  }
  .stat-card::after { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 60%);pointer-events:none; }
  .stat-card:hover { transform:translateY(-5px); }

  /* Availability date chips */
  .date-chip {
    display:inline-flex;align-items:center;gap:6px;
    padding:6px 12px;border-radius:20px;font-size:12px;font-weight:700;
    background:rgba(16,185,129,.15);color:#34d399;
    border:1px solid rgba(16,185,129,.3);
    animation:popIn .3s ease both;
  }
  .date-chip-remove {
    width:16px;height:16px;border-radius:50%;border:none;cursor:pointer;
    background:rgba(255,255,255,.1);color:rgba(255,255,255,.5);
    display:flex;align-items:center;justify-content:center;font-size:11px;
    transition:background .2s,color .2s;line-height:1;padding:0;
  }
  .date-chip-remove:hover { background:rgba(239,68,68,.3);color:#fca5a5; }

  /* Date input */
  .date-input {
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
    border-radius:13px;padding:12px 16px;color:#fff;font-size:14px;
    font-family:'Manrope',sans-serif;outline:none;
    transition:border-color .2s,box-shadow .2s;flex:1;
  }
  .date-input:focus { border-color:rgba(16,185,129,.6);box-shadow:0 0 0 3px rgba(16,185,129,.15); }
  .date-input::-webkit-calendar-picker-indicator { filter:invert(1) opacity(.5);cursor:pointer; }

  /* Add btn */
  .add-btn {
    padding:12px 22px;border:none;border-radius:13px;cursor:pointer;
    font-family:'Manrope',sans-serif;font-weight:700;font-size:14px;
    background:linear-gradient(135deg,#059669,#06b6d4);color:#fff;
    box-shadow:0 4px 16px rgba(5,150,105,.35);
    transition:opacity .2s,transform .15s;white-space:nowrap;
  }
  .add-btn:hover { opacity:.9;transform:translateY(-1px); }
  .add-btn:disabled { opacity:.5;cursor:not-allowed;transform:none; }

  /* Appointment card */
  .appt-card {
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.09);
    border-radius:18px;padding:18px 20px;
    display:flex;align-items:center;justify-content:space-between;
    flex-wrap:wrap;gap:14px;
    cursor:pointer;
    transition:background .2s,border-color .2s,transform .2s;
    animation:slideIn .35s ease both;
  }
  .appt-card:hover { background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);transform:translateX(4px); }

  /* Patient avatar */
  .pat-avatar {
    width:44px;height:44px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,#065f46,#059669);
    display:flex;align-items:center;justify-content:center;
    font-weight:800;font-size:16px;color:#fff;
  }

  /* Status badge */
  .badge { font-size:11px;padding:4px 12px;border-radius:20px;font-weight:700; }

  /* Action buttons */
  .act-btn {
    padding:8px 16px;border-radius:10px;border:none;cursor:pointer;
    font-family:'Manrope',sans-serif;font-weight:700;font-size:12px;
    transition:all .2s;
  }
  .act-confirm { background:rgba(16,185,129,.2);color:#34d399;border:1px solid rgba(16,185,129,.3); }
  .act-confirm:hover { background:rgba(16,185,129,.35);transform:translateY(-1px); }
  .act-cancel  { background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.25); }
  .act-cancel:hover  { background:rgba(239,68,68,.3);transform:translateY(-1px); }

  /* Filter tabs */
  .filter-tab {
    padding:7px 16px;border-radius:10px;border:none;cursor:pointer;
    font-family:'Manrope',sans-serif;font-weight:700;font-size:12px;
    transition:all .2s;
  }
  .filter-tab.active   { background:linear-gradient(135deg,#059669,#06b6d4);color:#fff;box-shadow:0 3px 12px rgba(5,150,105,.4); }
  .filter-tab.inactive { background:rgba(255,255,255,.07);color:rgba(255,255,255,.45); }
  .filter-tab.inactive:hover { background:rgba(255,255,255,.13);color:#fff; }

  /* Skel */
  .skel { border-radius:10px;background:linear-gradient(90deg,rgba(255,255,255,.06) 25%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.06) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite; }

  /* Toast */
  .toast {
    position:fixed;bottom:28px;right:28px;z-index:999;
    padding:13px 20px;border-radius:14px;color:#fff;font-size:13px;font-weight:700;
    display:flex;align-items:center;gap:8px;
    box-shadow:0 8px 24px rgba(0,0,0,.3);animation:fadeUp .35s ease;
  }
  .spinner { width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite; }
`;

const STATUS_STYLE = {
  Confirmed: { bg:"rgba(16,185,129,.15)",  color:"#34d399",  border:"rgba(16,185,129,.3)"  },
  Cancelled: { bg:"rgba(239,68,68,.15)",   color:"#f87171",  border:"rgba(239,68,68,.25)"  },
  Booked:    { bg:"rgba(245,158,11,.15)",  color:"#fbbf24",  border:"rgba(245,158,11,.25)" },
  Pending:   { bg:"rgba(245,158,11,.15)",  color:"#fbbf24",  border:"rgba(245,158,11,.25)" },
};
const statusStyle = (s) => STATUS_STYLE[s] || STATUS_STYLE.Pending;

const STAT_THEMES = [
  { bg:"linear-gradient(135deg,#064e3bcc,#059669cc)", glow:"rgba(5,150,105,.5)",   icon:"📋" },
  { bg:"linear-gradient(135deg,#134e4acc,#0d9488cc)", glow:"rgba(20,184,166,.5)",  icon:"✅" },
  { bg:"linear-gradient(135deg,#78350fcc,#d97706cc)", glow:"rgba(245,158,11,.5)",  icon:"⏳" },
  { bg:"linear-gradient(135deg,#312e81cc,#4f46e5cc)", glow:"rgba(99,102,241,.5)",  icon:"📅" },
];

const FILTERS = ["All","Booked","Confirmed","Cancelled"];

export default function DoctorDashboard() {
  const [appointments,    setAppointments]    = useState([]);
  const [availableDates,  setAvailableDates]  = useState([]);
  const [availabilityDate,setAvailabilityDate]= useState("");
  const [loading,         setLoading]         = useState(true);
  const [adding,          setAdding]          = useState(false);
  const [updatingId,      setUpdatingId]      = useState(null);
  const [filter,          setFilter]          = useState("All");
  const [toast,           setToast]           = useState(null);
  const token    = localStorage.getItem("token");
  const navigate = useNavigate();

  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchAppointments = async () => {
    try {
      const res  = await fetch("http://localhost:5000/api/appointments/my", { headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch { setAppointments([]); }
    finally  { setLoading(false); }
  };

  const fetchAvailability = async () => {
    try {
      const decoded  = JSON.parse(atob(token.split(".")[1]));
      const res      = await fetch(`http://localhost:5000/api/appointments/availability/${decoded.id}`);
      const data     = await res.json();
      setAvailableDates(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => { fetchAppointments(); fetchAvailability(); }, []);

const updateStatus = async (id, newStatus, e) => {
  e.stopPropagation();
  setUpdatingId(id);

  try {

    const res = await fetch(
      `http://localhost:5000/api/appointments/update-status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Update failed");
    }

    showToast(`Appointment ${newStatus.toLowerCase()} successfully`, true);

    fetchAppointments();

  } catch (err) {

    console.error("Status update error:", err);
    showToast("Failed to update appointment", false);

  } finally {
    setUpdatingId(null);
  }
};

  const addAvailability = async () => {
    if (!availabilityDate) return showToast("Please select a date", false);
    const sel = new Date(availabilityDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (sel < today) return showToast("Cannot add past dates", false);
    setAdding(true);
    try {
      const res  = await fetch("http://localhost:5000/api/appointments/add-availability", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body:JSON.stringify({ date:availabilityDate }),
      });
      const data = await res.json();
      showToast(data.message || "Date added!", true);
      setAvailabilityDate("");
      fetchAvailability();
    } catch { showToast("Failed to add date", false); }
    finally  { setAdding(false); }
  };

  const filtered   = filter === "All" ? appointments : appointments.filter(a => a.status === filter);
  const confirmed  = appointments.filter(a => a.status === "Confirmed").length;
  const pending    = appointments.filter(a => ["Pending","Booked"].includes(a.status)).length;

  const stats = [
    { label:"Total Patients",   value:appointments.length },
    { label:"Confirmed",        value:confirmed },
    { label:"Pending",          value:pending },
    { label:"Available Dates",  value:availableDates.length },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="doc-root">
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>

        <div className="content">

          {/* Header */}
          <div style={{ marginBottom:28, animation:"fadeUp .4s ease both" }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.3rem,3vw,1.8rem)", fontWeight:800, color:"#fff", margin:"0 0 6px" }}>
              Doctor Dashboard 🩺
            </h2>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, margin:0 }}>Manage your appointments and availability</p>
          </div>

          {/* Stat cards */}
          <div className="stat-grid">
            {stats.map((s,i) => (
              <div key={i} className="stat-card"
                style={{ background:STAT_THEMES[i].bg, boxShadow:`0 6px 28px ${STAT_THEMES[i].glow}`, animation:`fadeUp .4s ease ${i*.08}s both` }}
                onMouseEnter={e => e.currentTarget.style.boxShadow=`0 14px 40px ${STAT_THEMES[i].glow}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow=`0 6px 28px ${STAT_THEMES[i].glow}`}
              >
                <span style={{ fontSize:24 }}>{STAT_THEMES[i].icon}</span>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:800, color:"#fff", margin:"10px 0 2px" }}>
                  {loading ? <span className="skel" style={{ display:"inline-block", width:40, height:28 }}/> : s.value}
                </p>
                <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)", margin:0, textTransform:"uppercase", letterSpacing:.8 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Two-col grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20, marginBottom:24 }}>

            {/* Availability */}
            <div className="glass" style={{ padding:"clamp(18px,3vw,26px)", animation:"fadeUp .45s ease .2s both" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:15, margin:"0 0 16px" }}>
                📅 Set Availability
              </h3>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <input type="date" className="date-input" value={availabilityDate}
                  onChange={e => setAvailabilityDate(e.target.value)} style={{ minWidth:0 }}/>
                <button className="add-btn" onClick={addAvailability} disabled={adding || !availabilityDate}>
                  {adding ? <span style={{ display:"flex", alignItems:"center", gap:7 }}><span className="spinner"/>Adding…</span> : "+ Add"}
                </button>
              </div>

              {availableDates.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:.8, margin:"0 0 10px" }}>
                    Your available dates
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {availableDates.map((d,i) => (
                      <span key={i} className="date-chip" style={{ animationDelay:`${i*.05}s` }}>
                        📅 {new Date(d).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" })}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {availableDates.length === 0 && !loading && (
                <p style={{ color:"rgba(255,255,255,.25)", fontSize:13, marginTop:14, textAlign:"center" }}>
                  No availability set yet
                </p>
              )}
            </div>

            {/* Quick stats breakdown */}
            <div className="glass" style={{ padding:"clamp(18px,3vw,26px)", animation:"fadeUp .45s ease .3s both" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:15, margin:"0 0 16px" }}>
                📊 Appointment Breakdown
              </h3>
              {FILTERS.slice(1).map((f,i) => {
                const count = appointments.filter(a => a.status === f).length;
                const pct   = appointments.length ? Math.round((count/appointments.length)*100) : 0;
                const colors= { Confirmed:"#10b981", Cancelled:"#ef4444", Booked:"#f59e0b" };
                return (
                  <div key={f} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:13, color:"rgba(255,255,255,.6)", fontWeight:600 }}>{f}</span>
                      <span style={{ fontSize:13, color:"#fff", fontWeight:700 }}>{count}</span>
                    </div>
                    <div style={{ height:6, borderRadius:6, background:"rgba(255,255,255,.08)", overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:6, width:`${pct}%`, background:colors[f], transition:"width .6s ease", minWidth: count>0?8:0 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointments list */}
          <div className="glass" style={{ padding:"clamp(18px,3vw,26px)", animation:"fadeUp .5s ease .35s both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:15, margin:0 }}>
                🗓️ Patient Appointments
              </h3>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {FILTERS.map(f => (
                  <button key={f} className={`filter-tab ${filter===f?"active":"inactive"}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>

            {loading
              ? Array(3).fill(0).map((_,i) => <div key={i} className="skel" style={{ height:80, borderRadius:18, marginBottom:12 }}/>)
              : filtered.length === 0
                ? <div style={{ textAlign:"center", padding:"32px 0" }}>
                    <p style={{ fontSize:32, margin:"0 0 8px" }}>🩺</p>
                    <p style={{ color:"rgba(255,255,255,.3)", fontSize:14 }}>No {filter === "All" ? "" : filter.toLowerCase()} appointments</p>
                  </div>
                : filtered.map((apt, i) => {
                    const ss = statusStyle(apt.status);
                    const isUpdating = updatingId === apt._id;
                    return (
                      <div key={apt._id} className="appt-card"
                        style={{ animationDelay:`${i*.06}s` }}
                        onClick={() => navigate(`/appointments/${apt._id}`)}>

                        {/* Left */}
                        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                          <div className="pat-avatar">{apt.patient?.name?.charAt(0) || "?"}</div>
                          <div>
                            <p style={{ fontWeight:700, color:"#fff", fontSize:14, margin:"0 0 3px" }}>{apt.patient?.name}</p>
                            <p style={{ color:"rgba(255,255,255,.35)", fontSize:12, margin:"0 0 4px" }}>{apt.patient?.email}</p>
                            <p style={{ color:"rgba(255,255,255,.45)", fontSize:12, margin:0 }}>
                              📅 {new Date(apt.date).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" })}
                            </p>
                          </div>
                        </div>

                        {/* Right */}
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }} onClick={e => e.stopPropagation()}>
                          <span className="badge" style={{ background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>
                            {apt.status}
                          </span>

                          {apt.status !== "Confirmed" && (
                            <button className="act-btn act-confirm" onClick={e => updateStatus(apt._id,"Confirmed",e)} disabled={isUpdating}>
                              {isUpdating ? <span className="spinner"/> : "✓ Confirm"}
                            </button>
                          )}
                          {apt.status !== "Cancelled" && (
                            <button className="act-btn act-cancel" onClick={e => updateStatus(apt._id,"Cancelled",e)} disabled={isUpdating}>
                              ✕ Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
            }
          </div>

        </div>

        {/* Toast */}
        {toast && (
          <div className="toast" style={{ background: toast.ok ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#dc2626,#ef4444)" }}>
            <span style={{ animation:"checkPop .35s ease" }}>{toast.ok ? "✅" : "❌"}</span>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}