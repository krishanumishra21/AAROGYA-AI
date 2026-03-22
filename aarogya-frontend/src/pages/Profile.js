import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aurora   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes floatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
  @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.45)} 70%{box-shadow:0 0 0 10px rgba(124,58,237,0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }

  .profile-root {
    font-family:'Manrope',sans-serif;
    min-height:100vh;
    background:#080b1a;
    position:relative;
    overflow-x:hidden;
  }
  .profile-root::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 70% 60% at 15% 20%, #5b21b670 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 85% 15%, #0ea5e955 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 50% 90%, #f0abfc45 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 80% 65%, #10b98135 0%, transparent 50%);
    background-size:200% 200%;
    animation:aurora 14s ease infinite;
  }
  .orb { position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(72px);opacity:.3; }
  .orb1{ width:320px;height:320px;top:-60px;left:-60px;background:#7c3aed;animation:floatOrb 10s ease-in-out infinite; }
  .orb2{ width:260px;height:260px;bottom:-40px;right:-40px;background:#06b6d4;animation:floatOrb 12s ease-in-out infinite 3s; }

  .content { position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:clamp(16px,4vw,36px); }

  .glass {
    background:rgba(255,255,255,.07);
    backdrop-filter:blur(22px);
    -webkit-backdrop-filter:blur(22px);
    border:1px solid rgba(255,255,255,.13);
    border-radius:24px;
  }

  /* Avatar ring */
  .avatar-ring {
    width:90px;height:90px;border-radius:50%;
    background:linear-gradient(135deg,#7c3aed,#06b6d4);
    padding:3px; flex-shrink:0;
  }
  .avatar-inner {
    width:100%;height:100%;border-radius:50%;
    background:linear-gradient(135deg,#312e81,#4f46e5);
    display:flex;align-items:center;justify-content:center;
    font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;
  }

  /* Field */
  .field-wrap { display:flex;flex-direction:column;gap:5px; }
  .field-label { font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.8px; }
  .field-input {
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.12);
    border-radius:12px;
    padding:11px 14px;
    color:#fff;
    font-size:14px;
    font-family:'Manrope',sans-serif;
    outline:none;
    transition:border-color .2s, background .2s, box-shadow .2s;
    width:100%;
    box-sizing:border-box;
  }
  .field-input:focus {
    border-color:rgba(124,58,237,.7);
    background:rgba(124,58,237,.1);
    box-shadow:0 0 0 3px rgba(124,58,237,.15);
  }
  .field-input::placeholder { color:rgba(255,255,255,.2); }

  /* Save button */
  .save-btn {
    width:100%;padding:13px;border:none;border-radius:14px;cursor:pointer;
    font-family:'Manrope',sans-serif;font-weight:700;font-size:15px;
    background:linear-gradient(135deg,#7c3aed,#06b6d4);
    color:#fff;
    box-shadow:0 4px 20px rgba(124,58,237,.4);
    transition:opacity .2s, transform .15s, box-shadow .2s;
    position:relative;overflow:hidden;
  }
  .save-btn:hover { opacity:.92;transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,58,237,.5); }
  .save-btn:active { transform:translateY(0); }
  .save-btn:disabled { opacity:.6;cursor:not-allowed; }

  /* Success toast */
  .toast {
    position:fixed;bottom:28px;right:28px;z-index:999;
    background:linear-gradient(135deg,#059669,#10b981);
    color:#fff;padding:13px 20px;border-radius:14px;
    font-size:13px;font-weight:700;
    box-shadow:0 8px 24px rgba(16,185,129,.4);
    display:flex;align-items:center;gap:8px;
    animation:fadeUp .35s ease;
  }
  .check-icon { animation:checkPop .35s ease; }

  /* QR card */
  .qr-card {
    background:linear-gradient(145deg,#1e1b4b,#312e81);
    border:1px solid rgba(139,92,246,.3);
    border-radius:24px;
    padding:clamp(20px,4vw,32px);
    display:flex;flex-direction:column;align-items:center;gap:18px;
    box-shadow:0 8px 40px rgba(124,58,237,.3);
    animation:fadeUp .5s ease .2s both;
  }
  .qr-frame {
    background:#fff;padding:16px;border-radius:18px;
    box-shadow:0 4px 24px rgba(0,0,0,.3);
    animation:pulse 2.5s ease-in-out infinite;
  }
  .dl-btn {
    padding:11px 28px;border-radius:12px;border:none;cursor:pointer;
    font-family:'Manrope',sans-serif;font-weight:700;font-size:13px;
    background:rgba(255,255,255,.12);color:#fff;
    border:1px solid rgba(255,255,255,.2);
    transition:all .2s;
  }
  .dl-btn:hover { background:rgba(255,255,255,.22);transform:translateY(-2px); }

  /* Info chips row */
  .chip {
    display:inline-flex;align-items:center;gap:5px;
    padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;
    background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);
    border:1px solid rgba(255,255,255,.1);
  }

  /* Spinner */
  .spinner { width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite; }
`;

const FIELDS = [
  { name:"name",             label:"Full Name",         icon:"👤", placeholder:"John Doe" },
  { name:"phone",            label:"Phone",             icon:"📱", placeholder:"+91 9876543210" },
  { name:"bloodGroup",       label:"Blood Group",       icon:"🩸", placeholder:"A+, B-, O+…" },
  { name:"emergencyContact", label:"Emergency Contact", icon:"🚨", placeholder:"Relative's number" },
  { name:"allergies",        label:"Allergies",         icon:"⚠️", placeholder:"Penicillin, Pollen…" },
  { name:"chronicDiseases",  label:"Chronic Diseases",  icon:"🏥", placeholder:"Diabetes, Hypertension…" },
];

export default function Profile() {
  const { user } = useOutletContext();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name:             user?.name             || "",
    phone:            user?.phone            || "",
    bloodGroup:       user?.bloodGroup       || "",
    emergencyContact: user?.emergencyContact || "",
    allergies:        user?.allergies        || "",
    chronicDiseases:  user?.chronicDiseases  || "",
  });
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);   // {msg, ok}
  const [changed,  setChanged]  = useState(false);

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setChanged(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res  = await fetch("https://aarogya-ai-uugr.onrender.com/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setToast({ msg: res.ok ? "Profile updated successfully!" : (data.message || "Update failed"), ok: res.ok });
      if (res.ok) setChanged(false);
    } catch {
      setToast({ msg:"Network error", ok:false });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const BASE_URL = "https://aarogya-client.vercel.app";

  const qrData = `${BASE_URL}/emergency/${user?._id || ""}`;
  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const url    = canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
    Object.assign(document.createElement("a"), { href:url, download:"emergency-qr.png" }).click();
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="profile-root">
        <div className="orb orb1"/><div className="orb orb2"/>

        <div className="content">

          {/* ── Header card ── */}
          <div className="glass" style={{ padding:"clamp(18px,4vw,28px)", marginBottom:24, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap", animation:"fadeUp .4s ease both" }}>
            <div className="avatar-ring">
              <div className="avatar-inner">{user?.name?.charAt(0) || "?"}</div>
            </div>
            <div style={{ flex:1, minWidth:180 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.2rem,3vw,1.6rem)", fontWeight:800, color:"#fff", margin:"0 0 4px" }}>{user?.name}</h2>
              <p style={{ color:"rgba(255,255,255,.45)", fontSize:13, margin:"0 0 10px" }}>{user?.email}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span className="chip">🏷️ {user?.role || "Patient"}</span>
                {formData.bloodGroup && <span className="chip">🩸 {formData.bloodGroup}</span>}
                {formData.phone      && <span className="chip">📱 {formData.phone}</span>}
              </div>
            </div>
            {changed && (
              <span style={{ fontSize:12, color:"#fbbf24", fontWeight:600, animation:"fadeUp .3s ease" }}>● Unsaved changes</span>
            )}
          </div>

          {/* ── Two-col grid ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>

            {/* Form */}
            <div className="glass" style={{ padding:"clamp(18px,4vw,28px)", animation:"fadeUp .45s ease .1s both" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:16, margin:"0 0 20px" }}>
                Personal &amp; Medical Info
              </h3>
              <form onSubmit={handleUpdate} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {FIELDS.map(f => (
                  <div key={f.name} className="field-wrap">
                    <label className="field-label">{f.icon} {f.label}</label>
                    <input
                      className="field-input"
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <button type="submit" className="save-btn" disabled={saving} style={{ marginTop:6 }}>
                  {saving
                    ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}><span className="spinner"/>Saving…</span>
                    : "💾 Save Changes"
                  }
                </button>
              </form>
            </div>

            {/* QR + info */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {user?.role === "patient" && (
                <div className="qr-card">
                  <div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:16, margin:"0 0 4px", textAlign:"center" }}>Emergency Medical QR</h3>
                    <p style={{ color:"rgba(255,255,255,.45)", fontSize:12, textAlign:"center", margin:0 }}>Scan in emergencies to access your health record</p>
                  </div>
                  <div className="qr-frame">
                    <QRCodeCanvas id="qr-code" value={qrData} size={180} level="H" includeMargin />
                  </div>
                  <button className="dl-btn" onClick={downloadQR}>⬇ Download QR</button>
                </div>
              )}

              {/* Quick info card */}
              <div className="glass" style={{ padding:"clamp(16px,3vw,24px)", animation:"fadeUp .5s ease .3s both" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", color:"#fff", fontWeight:700, fontSize:15, margin:"0 0 14px" }}>Quick Info</h3>
                {[
                  { icon:"🚨", label:"Emergency Contact", val:formData.emergencyContact },
                  { icon:"⚠️", label:"Allergies",         val:formData.allergies },
                  { icon:"🏥", label:"Chronic Diseases",  val:formData.chronicDiseases },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom:12, paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, margin:"0 0 3px" }}>{r.icon} {r.label}</p>
                    <p style={{ fontSize:14, color: r.val ? "#fff" : "rgba(255,255,255,.25)", margin:0 }}>{r.val || "Not set"}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
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