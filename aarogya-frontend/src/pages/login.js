import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const roleConfig = {
  patient: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.35)",
    label: "Patient",
    hint: "Access your health records & appointments",
  },
  doctor: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.35)",
    label: "Doctor",
    hint: "Manage your patients & consultations",
  },
  admin: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M16.95 16.95l1.41 1.41M5.64 16.95l-1.41 1.41"/>
      </svg>
    ),
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.35)",
    label: "Admin",
    hint: "Oversee system operations & users",
  },
};

export default function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cfg = roleConfig[role];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
        window.location.reload();
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch {
      setError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .aarogya-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #060d1a;
          color: #e8edf5;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Ambient background */
        .aarogya-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% -10%, rgba(16,185,129,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 110%, rgba(59,130,246,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(168,85,247,0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* Top nav */
        .nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
        }

        .logo {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
          box-shadow: 0 0 12px #10b981;
          animation: pulse-dot 2.4s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }

        .nav-badge {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 100px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Main layout */
        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 48px;
          position: relative;
          z-index: 1;
        }

        .card-wrap {
          width: 100%;
          max-width: 440px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .card-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Greeting */
        .greeting {
          text-align: center;
          margin-bottom: 32px;
        }

        .greeting h1 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #fff;
        }

        .greeting p {
          margin-top: 8px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          transition: color 0.3s;
        }

        /* Card */
        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
          transition: border-color 0.4s;
        }

        /* Role pills */
        .role-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 28px;
        }

        .role-btn {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 10px 6px 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
          color: rgba(255,255,255,0.4);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }

        .role-btn:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
        }

        .role-btn.active {
          color: #fff;
          font-weight: 600;
        }

        .role-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
        }

        /* Form fields */
        .field {
          margin-bottom: 14px;
          position: relative;
        }

        .field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .field-inner {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          transition: color 0.2s;
        }

        .field input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 14px 13px 42px;
          color: #fff;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }

        .field input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .field input:focus {
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.05);
        }

        .field input:focus + .field-focus-ring {
          opacity: 1;
        }

        .toggle-pw {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.25);
          padding: 0;
          display: flex;
          transition: color 0.2s;
        }

        .toggle-pw:hover { color: rgba(255,255,255,0.6); }

        /* Error */
        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.82rem;
          color: #fca5a5;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          color: #fff;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }

        .submit-btn:hover::after {
          background: rgba(255,255,255,0.06);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer link */
        .footer-link {
          text-align: center;
          margin-top: 20px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.3);
        }

        .footer-link button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: inherit;
          font-weight: 600;
          padding: 0;
          margin-left: 4px;
          transition: color 0.2s;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .divider p {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
        }

        /* Hint text */
        .role-hint {
          text-align: center;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.25);
          margin-bottom: 18px;
          min-height: 1.1em;
          transition: color 0.3s;
        }

        @media (max-width: 480px) {
          .nav { padding: 16px 20px; }
          .logo { font-size: 1.35rem; }
          .card { padding: 24px 20px; }
          .role-btn { font-size: 0.68rem; padding: 8px 4px 10px; }
        }
      `}</style>

      <div className="aarogya-root">
        <div className="grid-bg" />

        {/* Nav */}
        <nav className="nav">
          <a href="/" className="logo">
            <span className="logo-dot" />
            Aarogya
          </a>
          <span className="nav-badge">Health Portal</span>
        </nav>

        {/* Main */}
        <main className="main">
          <div className={`card-wrap ${mounted ? "visible" : ""}`}>

            <div className="greeting">
              <h1>Welcome back</h1>
              <p style={{ color: cfg.color, opacity: 0.8 }}>{cfg.hint}</p>
            </div>

            <div
              className="card"
              style={{ borderColor: cfg.border }}
            >
              {/* Role selector */}
              <div className="role-row">
                {Object.entries(roleConfig).map(([r, c]) => (
                  <button
                    key={r}
                    className={`role-btn ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                    style={role === r ? {
                      borderColor: c.border,
                      background: c.bg,
                      color: "#fff",
                    } : {}}
                  >
                    <span
                      className="role-icon"
                      style={role === r ? {
                        background: c.bg,
                        color: c.color,
                        boxShadow: `0 0 18px ${c.color}40`,
                      } : {
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {c.icon}
                    </span>
                    {c.label}
                  </button>
                ))}
              </div>

              <p className="role-hint" style={{ color: cfg.color }}>
                Signing in as <strong>{cfg.label}</strong>
              </p>

              {/* Form */}
              <form onSubmit={handleLogin} noValidate>

                {error && (
                  <div className="error-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className="field">
                  <label>Email address</label>
                  <div className="field-inner">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      style={{ borderColor: email ? cfg.border : undefined }}
                      onFocus={(e) => e.target.style.borderColor = cfg.color}
                      onBlur={(e) => e.target.style.borderColor = email ? cfg.border : "rgba(255,255,255,0.1)"}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="field-inner">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: "44px", borderColor: password ? cfg.border : undefined }}
                      onFocus={(e) => e.target.style.borderColor = cfg.color}
                      onBlur={(e) => e.target.style.borderColor = password ? cfg.border : "rgba(255,255,255,0.1)"}
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: "right", marginTop: "-6px", marginBottom: "18px" }}>
                  <button
                    type="button"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.78rem", color: cfg.color, fontFamily: "'DM Sans', sans-serif",
                      textDecoration: "underline", textUnderlineOffset: "2px",
                    }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  style={{
                    background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
                    boxShadow: `0 8px 32px ${cfg.color}40`,
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in as {cfg.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="17" height="17">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="divider"><span /><p>new here?</p><span /></div>

              <div className="footer-link">
                Don't have an account?
                <button
                  style={{ color: cfg.color }}
                  onClick={() => navigate(`/signup/${role}`)}
                >
                  Create one
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}