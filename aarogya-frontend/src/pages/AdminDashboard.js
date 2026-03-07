import React, { useEffect, useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK = {
  hospital: { name: "Meridian General Hospital", address: "42 Wellness Blvd, San Francisco, CA 94102" },
  doctors: [
    { _id: "1", name: "Dr. Aisha Patel",   specialization: "Cardiology",   email: "aisha@meridian.com" },
    { _id: "2", name: "Dr. Marcus Reid",   specialization: "Neurology",    email: "marcus@meridian.com" },
    { _id: "3", name: "Dr. Sofia Chen",    specialization: "Pediatrics",   email: "sofia@meridian.com" },
    { _id: "4", name: "Dr. James Okafor", specialization: "Dermatology",  email: "james@meridian.com" },
  ],
  appointments: [
    { _id: "a1", patient: { name: "Emily Watson" }, doctor: { name: "Dr. Aisha Patel"  }, date: "2025-03-10", status: "confirmed" },
    { _id: "a2", patient: { name: "Robert Kim"   }, doctor: { name: "Dr. Marcus Reid"  }, date: "2025-03-11", status: "pending"   },
    { _id: "a3", patient: { name: "Laura Sanz"   }, doctor: { name: "Dr. Sofia Chen"   }, date: "2025-03-12", status: "completed" },
    { _id: "a4", patient: { name: "Tom Nguyen"   }, doctor: { name: "Dr. James Okafor" }, date: "2025-03-13", status: "pending"   },
    { _id: "a5", patient: { name: "Ana Costa"    }, doctor: { name: "Dr. Aisha Patel"  }, date: "2025-03-14", status: "confirmed" },
  ],
};

const SPECIALIZATIONS = ["Cardiology","Neurology","Orthopedics","Dermatology","Pediatrics","General"];

const SPEC_COLORS = {
  Cardiology:  "#ff6b6b", Neurology: "#a78bfa", Orthopedics: "#60a5fa",
  Dermatology: "#f59e0b", Pediatrics: "#34d399", General: "#94a3b8",
};

const STATUS_META = {
  confirmed: { color: "#10b981", bg: "#d1fae5", label: "Confirmed" },
  pending:   { color: "#f59e0b", bg: "#fef3c7", label: "Pending"   },
  completed: { color: "#6366f1", bg: "#ede9fe", label: "Completed" },
  cancelled: { color: "#ef4444", bg: "#fee2e2", label: "Cancelled" },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f0f2f7; color: #1a1d2e; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #d0d4e0; border-radius: 99px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes toastIn  { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.8); } }

  .fade-up { animation: fadeUp 0.4s ease both; }

  .card {
    background:#fff; border-radius:20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  }

  .stat-card {
    border-radius:18px; padding:24px 28px;
    position:relative; overflow:hidden;
    transition: transform .2s ease, box-shadow .2s ease;
    cursor:default;
  }
  .stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,0.13); }

  input, select {
    font-family:'DM Sans',sans-serif; font-size:14px;
    width:100%; border:1.5px solid #e2e6ef; border-radius:12px;
    padding:10px 14px; outline:none; background:#f8f9fc; color:#1a1d2e;
    transition:border-color .2s, background .2s, box-shadow .2s;
    appearance:none;
  }
  input:focus, select:focus {
    border-color:#6366f1; background:#fff;
    box-shadow:0 0 0 4px rgba(99,102,241,.1);
  }
  button { font-family:'DM Sans',sans-serif; cursor:pointer; }

  .btn-primary {
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    color:#fff; border:none; border-radius:12px;
    padding:10px 22px; font-size:14px; font-weight:600;
    transition:transform .15s, box-shadow .15s;
    box-shadow:0 4px 14px rgba(99,102,241,.35);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.45); }
  .btn-primary:active { transform:translateY(0); }
  .btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }

  .tag {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 11px; border-radius:99px;
    font-size:12px; font-weight:600; letter-spacing:.02em;
    white-space:nowrap;
  }

  .row-item {
    display:flex; align-items:center; gap:14px;
    padding:12px 16px; border-radius:14px;
    transition:background .15s ease;
  }
  .row-item:hover { background:#f8f9fc; }

  .toast {
    position:fixed; top:20px; right:20px; z-index:200;
    background:#fff; border-radius:14px; padding:14px 18px;
    min-width:260px; box-shadow:0 8px 32px rgba(0,0,0,.12);
    display:flex; align-items:center; gap:12px;
    animation:toastIn .3s ease; font-size:14px; font-weight:500;
    border-left:4px solid #10b981;
  }
  .toast.error { border-left-color:#ef4444; }

  .section-head {
    font-family:'Syne',sans-serif; font-size:17px; font-weight:700;
    color:#1a1d2e; margin-bottom:16px;
    display:flex; align-items:center; gap:8px;
  }

  .form-label {
    font-size:11px; font-weight:600; color:#64748b;
    text-transform:uppercase; letter-spacing:.06em;
    display:block; margin-bottom:6px;
  }

  .avatar {
    border-radius:12px; display:flex; align-items:center;
    justify-content:center; font-family:'Syne',sans-serif;
    font-weight:700; flex-shrink:0;
  }

  .empty { text-align:center; padding:32px; color:#b0b8cc; font-size:14px; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
const AVATAR_COLORS = [
  ["#eef0fd","#6366f1"],["#fce7f3","#db2777"],["#fef3c7","#d97706"],
  ["#d1fae5","#059669"],["#dbeafe","#3b82f6"],["#ede9fe","#7c3aed"],
];
function avatarColors(name) {
  let h = 0; for (const c of (name||"")) h += c.charCodeAt(0);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function Avatar({ name, size = 40 }) {
  const [bg, fg] = avatarColors(name);
  return (
    <div className="avatar" style={{ width:size, height:size, background:bg, color:fg, fontSize:size*0.37 }}>
      {initials(name)}
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast${type==="error"?" error":""}`}>
      <span style={{ fontSize:20 }}>{type==="error"?"⚠️":"✅"}</span>
      <span style={{ flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none",border:"none",fontSize:18,color:"#aaa",lineHeight:1 }}>×</button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [hospital, setHospital]         = useState(MOCK.hospital);
  const [doctors, setDoctors]           = useState(MOCK.doctors);
  const [appointments, setAppointments] = useState(MOCK.appointments);
  const [toast, setToast]               = useState(null);
  const [docSearch, setDocSearch]       = useState("");
  const [docFilter, setDocFilter]       = useState("All");
  const [apptFilter, setApptFilter]     = useState("All");
  const [formSpec, setFormSpec]         = useState("General");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const [u,d,a] = await Promise.all([
          fetch("http://localhost:5000/api/auth/me",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
          fetch("http://localhost:5000/api/auth/doctors",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
          fetch("http://localhost:5000/api/appointments/hospital",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
        ]);
        if (u?.hospital)      setHospital(u.hospital);
        if (Array.isArray(d)) setDoctors(d);
        if (Array.isArray(a)) setAppointments(a);
      } catch {}
    })();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const doc = {
      _id: Date.now().toString(),
      name: fd.get("name"),
      email: fd.get("email"),
      specialization: formSpec,
    };
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/auth/admin/create-doctor", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ ...doc, password: fd.get("password") }),
      });
    } catch {}
    setDoctors(prev => [doc, ...prev]);
    setToast({ msg:`${doc.name} added successfully!`, type:"success" });
    e.target.reset();
    setFormSpec("General");
  };

  const filteredDoctors = doctors.filter(d =>
    (docFilter === "All" || d.specialization === docFilter) &&
    (d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.email.toLowerCase().includes(docSearch.toLowerCase()))
  );

  const filteredAppts = appointments.filter(a =>
    apptFilter === "All" || a.status === apptFilter
  );

  const stats = [
    { label:"Total Doctors",  value: doctors.length,                                         icon:"👨‍⚕️", bg:"#eef0fd", accent:"#6366f1" },
    { label:"Appointments",   value: appointments.length,                                    icon:"📅",  bg:"#fce7f3", accent:"#db2777" },
    { label:"Confirmed",      value: appointments.filter(a=>a.status==="confirmed").length,  icon:"✅",  bg:"#d1fae5", accent:"#059669" },
    { label:"Pending",        value: appointments.filter(a=>a.status==="pending").length,    icon:"⏳",  bg:"#fef3c7", accent:"#d97706" },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}

      <div style={{ maxWidth:960, margin:"0 auto", padding:"32px 20px", display:"flex", flexDirection:"column", gap:22 }}>

        {/* ── Header ── */}
        <div className="fade-up" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🏥</div>
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:800, lineHeight:1.2 }}>{hospital?.name}</h1>
              <p style={{ fontSize:13, color:"#94a3b8", marginTop:3 }}>📍 {hospital?.address}</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:"#fff", borderRadius:12, padding:"8px 15px", fontSize:13, fontWeight:500, color:"#64748b", boxShadow:"0 1px 4px rgba(0,0,0,0.07)" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulseDot 2s infinite" }}/>
            System Online
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))", gap:14 }}>
          {stats.map((s, i) => (
            <div className="stat-card fade-up" key={s.label} style={{ background:s.bg, animationDelay:`${i*0.07}s` }}>
              <div style={{ position:"absolute", top:-16, right:-10, fontSize:68, opacity:0.1, lineHeight:1, pointerEvents:"none" }}>{s.icon}</div>
              <p style={{ fontSize:11, fontWeight:600, color:s.accent, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{s.label}</p>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:40, fontWeight:800, color:s.accent, lineHeight:1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Add Doctor Form ── */}
        <div className="card fade-up" style={{ padding:"26px 28px", animationDelay:"0.22s" }}>
          <p className="section-head">Add New Doctor</p>
          <form onSubmit={handleCreateDoctor} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:14, alignItems:"end" }}>
            <div>
              <label className="form-label">Doctor Name</label>
              <input name="name" placeholder="Dr. Jane Smith" required />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" placeholder="doctor@hospital.com" required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input name="password" type="password" placeholder="••••••••" required />
            </div>
            <div>
              <label className="form-label">Specialization</label>
              <select value={formSpec} onChange={e => setFormSpec(e.target.value)}>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ height:42 }}>
              Create Doctor
            </button>
          </form>
        </div>

        {/* ── Two-column grid for doctors + appointments ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:18, alignItems:"start" }}>

          {/* Doctors */}
          <div className="card fade-up" style={{ padding:"22px 22px", animationDelay:"0.3s" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:14 }}>
              <p className="section-head" style={{ margin:0 }}>
                Hospital Doctors
                <span style={{ fontFamily:"'DM Sans'", fontWeight:500, fontSize:13, color:"#94a3b8" }}>({filteredDoctors.length})</span>
              </p>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <input
                placeholder="Search…"
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                style={{ flex:1, minWidth:120, padding:"8px 12px" }}
              />
              <select value={docFilter} onChange={e => setDocFilter(e.target.value)} style={{ width:150, padding:"8px 12px" }}>
                <option value="All">All</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {filteredDoctors.length === 0
              ? <div className="empty">No doctors found.</div>
              : filteredDoctors.map((doc, i) => (
                <div className="row-item fade-up" key={doc._id} style={{ animationDelay:`${i*0.05}s` }}>
                  <Avatar name={doc.name} size={40} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.name}</p>
                    <p style={{ fontSize:12, color:"#94a3b8", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.email}</p>
                  </div>
                  <span className="tag" style={{ background:(SPEC_COLORS[doc.specialization]||"#94a3b8")+"22", color:SPEC_COLORS[doc.specialization]||"#94a3b8" }}>
                    {doc.specialization}
                  </span>
                </div>
              ))
            }
          </div>

          {/* Appointments */}
          <div className="card fade-up" style={{ padding:"22px 22px", animationDelay:"0.36s" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:14 }}>
              <p className="section-head" style={{ margin:0 }}>
                Appointments
                <span style={{ fontFamily:"'DM Sans'", fontWeight:500, fontSize:13, color:"#94a3b8" }}>({filteredAppts.length})</span>
              </p>
              <select value={apptFilter} onChange={e => setApptFilter(e.target.value)} style={{ width:150, padding:"8px 12px" }}>
                <option value="All">All Statuses</option>
                {Object.entries(STATUS_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {filteredAppts.length === 0
              ? <div className="empty">No appointments found.</div>
              : filteredAppts.map((appt, i) => {
                const sm = STATUS_META[appt.status] || STATUS_META.pending;
                return (
                  <div className="row-item fade-up" key={appt._id} style={{ animationDelay:`${i*0.05}s`, flexWrap:"wrap", gap:10 }}>
                    <Avatar name={appt.patient?.name} size={38} />
                    <div style={{ flex:1, minWidth:120 }}>
                      <p style={{ fontWeight:600, fontSize:14 }}>{appt.patient?.name}</p>
                      <p style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>with {appt.doctor?.name}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:12, color:"#94a3b8", marginBottom:4 }}>
                        {new Date(appt.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                      </p>
                      <span className="tag" style={{ background:sm.bg, color:sm.color }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:sm.color, display:"inline-block" }}/>
                        {sm.label}
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>

        </div>
      </div>
    </>
  );
}