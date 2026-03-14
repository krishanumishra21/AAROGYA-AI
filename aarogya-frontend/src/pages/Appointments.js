import React, { useEffect, useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aurora   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

  .appt-root {
    font-family:'Manrope',sans-serif;
    min-height:100vh;
    background:#080b1a;
    position:relative;
    overflow-x:hidden;
    display:flex;
    align-items:flex-start;
    justify-content:center;
    padding: clamp(16px,4vw,40px);
  }
  .appt-root::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 70% 60% at 10% 20%,  #5b21b670 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 90% 15%,  #0ea5e955 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 50% 90%,  #f0abfc45 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 80% 65%,  #10b98135 0%, transparent 50%);
    background-size:200% 200%;
    animation:aurora 14s ease infinite;
  }
  .orb { position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(72px);opacity:.28; }
  .orb1{ width:300px;height:300px;top:-60px;left:-60px;background:#7c3aed;animation:floatOrb 10s ease-in-out infinite; }
  .orb2{ width:260px;height:260px;bottom:-40px;right:-40px;background:#06b6d4;animation:floatOrb 12s ease-in-out infinite 3s; }

  .card {
    position:relative;z-index:1;
    width:100%;max-width:560px;
    background:rgba(255,255,255,.07);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,.13);
    border-radius:28px;
    padding:clamp(22px,5vw,38px);
    animation:fadeUp .5s ease both;
  }

  /* Step indicator */
  .steps { display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:32px; }
  .step-item { display:flex;flex-direction:column;align-items:center;gap:6px;position:relative;flex:1; }
  .step-item:not(:last-child)::after {
    content:'';position:absolute;top:18px;left:calc(50% + 18px);
    width:calc(100% - 36px);height:2px;
    background:rgba(255,255,255,.1);
    z-index:0;transition:background .4s;
  }
  .step-item.done:not(:last-child)::after  { background:linear-gradient(90deg,#7c3aed,#06b6d4); }
  .step-dot {
    width:36px;height:36px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:15px;font-weight:700;z-index:1;
    border:2px solid rgba(255,255,255,.15);
    background:rgba(255,255,255,.06);
    color:rgba(255,255,255,.35);
    transition:all .3s;
  }
  .step-item.active .step-dot  { background:linear-gradient(135deg,#7c3aed,#06b6d4);border-color:transparent;color:#fff;box-shadow:0 0 0 4px rgba(124,58,237,.25); }
  .step-item.done   .step-dot  { background:linear-gradient(135deg,#059669,#10b981);border-color:transparent;color:#fff; }
  .step-label { font-size:10px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.7px;text-align:center; }
  .step-item.active .step-label { color:rgba(255,255,255,.7); }
  .step-item.done   .step-label { color:#10b981; }

  /* Field */
  .field-label { font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;display:block; }

  .custom-select, .custom-date {
    width:100%;box-sizing:border-box;
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.12);
    border-radius:14px;
    padding:13px 16px;
    color:#fff;
    font-size:14px;
    font-family:'Manrope',sans-serif;
    outline:none;
    appearance:none;
    -webkit-appearance:none;
    transition:border-color .2s, background .2s, box-shadow .2s;
    cursor:pointer;
  }
  .custom-select:focus, .custom-date:focus {
    border-color:rgba(124,58,237,.7);
    background:rgba(124,58,237,.1);
    box-shadow:0 0 0 3px rgba(124,58,237,.15);
  }
  .custom-select option { background:#1e1b4b;color:#fff; }
  .custom-select:disabled { opacity:.4;cursor:not-allowed; }
  .custom-date::-webkit-calendar-picker-indicator { filter:invert(1) opacity(.5);cursor:pointer; }

  .select-wrap { position:relative; }
  .select-wrap::after {
    content:'⌄';position:absolute;right:14px;top:50%;transform:translateY(-50%);
    color:rgba(255,255,255,.35);font-size:16px;pointer-events:none;
  }

  /* Doctor cards */
  .doctor-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:4px; }
  .doctor-card {
    padding:14px;border-radius:14px;cursor:pointer;
    background:rgba(255,255,255,.05);
    border:1.5px solid rgba(255,255,255,.1);
    transition:all .2s;
    animation:slideIn .3s ease both;
  }
  .doctor-card:hover   { background:rgba(124,58,237,.15);border-color:rgba(124,58,237,.4); }
  .doctor-card.selected{ background:rgba(124,58,237,.2);border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.2); }
  .doc-avatar {
    width:38px;height:38px;border-radius:50%;margin-bottom:8px;
    background:linear-gradient(135deg,#312e81,#4f46e5);
    display:flex;align-items:center;justify-content:center;
    font-weight:800;font-size:15px;color:#fff;
  }

  /* Date grid */
  .date-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;margin-top:4px; }
  .date-chip {
    padding:10px 6px;border-radius:12px;cursor:pointer;text-align:center;
    background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);
    transition:all .2s;animation:slideIn .25s ease both;
  }
  .date-chip:hover    { background:rgba(6,182,212,.15);border-color:rgba(6,182,212,.4); }
  .date-chip.selected { background:rgba(6,182,212,.2);border-color:#06b6d4;box-shadow:0 0 0 3px rgba(6,182,212,.2); }
  .date-chip .day-name{ font-size:10px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.5px; }
  .date-chip .day-num { font-size:18px;font-weight:800;color:#fff;font-family:'Syne',sans-serif; }
  .date-chip .month   { font-size:10px;color:rgba(255,255,255,.4); }

  /* Buttons */
  .btn-primary {
    width:100%;padding:14px;border:none;border-radius:14px;cursor:pointer;
    font-family:'Manrope',sans-serif;font-weight:700;font-size:15px;
    background:linear-gradient(135deg,#7c3aed,#06b6d4);
    color:#fff;box-shadow:0 4px 20px rgba(124,58,237,.4);
    transition:opacity .2s,transform .15s,box-shadow .2s;
  }
  .btn-primary:hover   { opacity:.9;transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,.5); }
  .btn-primary:active  { transform:translateY(0); }
  .btn-primary:disabled{ opacity:.5;cursor:not-allowed;transform:none; }
  .btn-ghost {
    padding:10px 20px;border:1px solid rgba(255,255,255,.15);border-radius:12px;cursor:pointer;
    background:transparent;color:rgba(255,255,255,.5);font-family:'Manrope',sans-serif;font-weight:600;font-size:13px;
    transition:all .2s;
  }
  .btn-ghost:hover{ background:rgba(255,255,255,.08);color:#fff; }

  /* Skel */
  .skel{ border-radius:10px;background:linear-gradient(90deg,rgba(255,255,255,.06) 25%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.06) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite; }

  /* Summary */
  .summary-row{ display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.07); }
  .summary-row:last-child{ border-bottom:none; }

  /* Toast */
  .toast{
    position:fixed;bottom:28px;right:28px;z-index:999;
    padding:13px 20px;border-radius:14px;
    color:#fff;font-size:13px;font-weight:700;
    display:flex;align-items:center;gap:8px;
    box-shadow:0 8px 24px rgba(0,0,0,.3);
    animation:fadeUp .35s ease;
  }
  .check-icon{ animation:checkPop .35s ease; }
  .spinner{ width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite; }
`;

const DAYS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS= ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getUpcomingDates(n = 10) {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const STEPS = ["Hospital","Doctor","Date","Confirm"];

export default function Appointments() {
  const [hospitals,        setHospitals]        = useState([]);
  const [doctors,          setDoctors]          = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDoctor,   setSelectedDoctor]   = useState("");
  const [selectedDate,     setSelectedDate]     = useState(null);
  const [step,             setStep]             = useState(0);
  const [loadingDoctors,   setLoadingDoctors]   = useState(false);
  const [booking,          setBooking]          = useState(false);
  const [toast,            setToast]            = useState(null);

  const token     = localStorage.getItem("token");
  const upDates   = getUpcomingDates(14);
  const selHosp   = hospitals.find(h => h._id === selectedHospital);
  const selDoc    = doctors.find(d => d._id === selectedDoctor);

  useEffect(() => {
    fetch("https://aarogya-ai-uugr.onrender.com/api/auth/hospitals")
      .then(r => r.json()).then(setHospitals).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedHospital) return;
    setLoadingDoctors(true);
    fetch(`https://aarogya-ai-uugr.onrender.com/api/appointments/doctors/${selectedHospital}`)
      .then(r => r.json()).then(d => { setDoctors(d); setLoadingDoctors(false); })
      .catch(() => setLoadingDoctors(false));
  }, [selectedHospital]);

  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBook = async () => {
    setBooking(true);
    try {
      const res  = await fetch("https://aarogya-ai-uugr.onrender.com/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ doctor:selectedDoctor, hospital:selectedHospital, date:selectedDate.toISOString() }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Appointment booked successfully! 🎉", true);
        setStep(0); setSelectedHospital(""); setSelectedDoctor(""); setSelectedDate(null);
      } else {
        showToast(data.message || "Booking failed", false);
      }
    } catch { showToast("Network error", false); }
    finally  { setBooking(false); }
  };

  const stepState = (i) => i < step ? "done" : i === step ? "active" : "";

  return (
    <>
      <style>{STYLES}</style>
      <div className="appt-root">
        <div className="orb orb1"/><div className="orb orb2"/>

        <div className="card">

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.3rem,3vw,1.7rem)", fontWeight:800, color:"#fff", margin:"0 0 6px" }}>
              Book Appointment
            </h2>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, margin:0 }}>
              Choose your hospital, doctor and preferred date
            </p>
          </div>

          {/* Step indicator */}
          <div className="steps">
            {STEPS.map((s,i) => (
              <div key={s} className={`step-item ${stepState(i)}`}>
                <div className="step-dot">{i < step ? "✓" : i+1}</div>
                <span className="step-label">{s}</span>
              </div>
            ))}
          </div>

          {/* ── Step 0: Hospital ── */}
          {step === 0 && (
            <div style={{ animation:"fadeUp .35s ease both" }}>
              <label className="field-label">🏥 Select Hospital</label>
              <div className="select-wrap">
                <select className="custom-select" value={selectedHospital}
                  onChange={e => { setSelectedHospital(e.target.value); setSelectedDoctor(""); }} required>
                  <option value="">— Choose a hospital —</option>
                  {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
              <button className="btn-primary" style={{ marginTop:24 }}
                disabled={!selectedHospital} onClick={() => setStep(1)}>
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 1: Doctor ── */}
          {step === 1 && (
            <div style={{ animation:"fadeUp .35s ease both" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <label className="field-label" style={{ margin:0 }}>👨‍⚕️ Select Doctor</label>
                <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
              </div>

              {loadingDoctors
                ? <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
                    {Array(4).fill(0).map((_,i) => <div key={i} className="skel" style={{ height:90 }}/>)}
                  </div>
                : doctors.length === 0
                  ? <p style={{ color:"rgba(255,255,255,.3)", fontSize:14, textAlign:"center", padding:"20px 0" }}>No doctors found for this hospital.</p>
                  : <div className="doctor-grid">
                      {doctors.map((doc,i) => (
                        <div key={doc._id} className={`doctor-card ${selectedDoctor===doc._id?"selected":""}`}
                          style={{ animationDelay:`${i*.06}s` }}
                          onClick={() => setSelectedDoctor(doc._id)}>
                          <div className="doc-avatar">{doc.name?.charAt(0)}</div>
                          <p style={{ fontWeight:700, color:"#fff", fontSize:13, margin:"0 0 3px" }}>{doc.name}</p>
                          <p style={{ color:"rgba(255,255,255,.35)", fontSize:11, margin:0 }}>{doc.email}</p>
                        </div>
                      ))}
                    </div>
              }

              <button className="btn-primary" style={{ marginTop:20 }}
                disabled={!selectedDoctor} onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Date ── */}
          {step === 2 && (
            <div style={{ animation:"fadeUp .35s ease both" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <label className="field-label" style={{ margin:0 }}>📅 Select Date</label>
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              </div>

              <div className="date-grid">
                {upDates.map((d,i) => (
                  <div key={i} className={`date-chip ${selectedDate?.toDateString()===d.toDateString()?"selected":""}`}
                    style={{ animationDelay:`${i*.04}s` }}
                    onClick={() => setSelectedDate(d)}>
                    <div className="day-name">{DAYS[d.getDay()]}</div>
                    <div className="day-num">{d.getDate()}</div>
                    <div className="month">{MONTHS[d.getMonth()]}</div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" style={{ marginTop:20 }}
                disabled={!selectedDate} onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <div style={{ animation:"fadeUp .35s ease both" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:15, margin:0 }}>Confirm Booking</h3>
                <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
              </div>

              <div style={{ background:"rgba(255,255,255,.04)", borderRadius:16, padding:"4px 16px", border:"1px solid rgba(255,255,255,.08)", marginBottom:22 }}>
                {[
                  { icon:"🏥", label:"Hospital", val:selHosp?.name },
                  { icon:"👨‍⚕️", label:"Doctor",   val:selDoc?.name },
                  { icon:"📧", label:"Email",    val:selDoc?.email },
                  { icon:"📅", label:"Date",     val:selectedDate?.toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"}) },
                ].map(r => (
                  <div key={r.label} className="summary-row">
                    <span style={{ fontSize:13, color:"rgba(255,255,255,.4)", fontWeight:600 }}>{r.icon} {r.label}</span>
                    <span style={{ fontSize:13, color:"#fff", fontWeight:700, textAlign:"right", maxWidth:"60%" }}>{r.val}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={handleBook} disabled={booking}>
                {booking
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span className="spinner"/>Booking…</span>
                  : "✅ Confirm Appointment"
                }
              </button>
            </div>
          )}

        </div>

        {/* Toast */}
        {toast && (
          <div className="toast" style={{ background: toast.ok ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#dc2626,#ef4444)" }}>
            <span className="check-icon">{toast.ok ? "✅" : "❌"}</span>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}