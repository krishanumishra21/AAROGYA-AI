import React, { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGES = [
  {
    id: Date.now() + Math.random(),
    from: "bot",
    text:
      "Hello! I'm Aara, your AI health assistant 👋\n\nHow can I assist you today? You can ask me about symptoms, medications, or book an appointment.",
    time: "Now",
  },
];

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "not breathing",
  "unconscious",
  "seizure",
  "heavy bleeding",
  "heart attack",
  "stroke",
];

const SYMPTOM_KEYWORDS = [
  "pain",
  "fever",
  "headache",
  "chest",
  "heart",
  "rash",
  "skin",
  "bone",
  "joint",
  "vomit",
  "cough",
  "infection",
  "dizziness",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 16px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#93c5fd",
            display: "inline-block",
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Avatar({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
      }}
    >
      🤖
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        from: "user",
        text: trimmed,
        time: now,
      },
    ]);

    setInput("");
    setTyping(true);

    const lower = trimmed.toLowerCase();

    // 🚨 Emergency detection
    let emergencyDetected = EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));

    if (emergencyDetected) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          from: "bot",
          text: "⚠️ This may be a medical emergency. Please seek medical help immediately.",
        },
      ]);
    }

    try {
      const token = localStorage.getItem("token");

      const aiRes = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const aiData = await aiRes.json();

      let finalReply = `🧠 AI Medical Insight\n\n${aiData.reply}`;

      // Check if message contains symptoms
      const hasSymptom = SYMPTOM_KEYWORDS.some((k) => lower.includes(k));

      if (hasSymptom) {
        try {
          const recRes = await fetch(
            "http://localhost:5000/api/ai/recommend-doctor",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ symptom: trimmed }),
            }
          );

          const recData = await recRes.json();

          if (recData.doctors && recData.doctors.length > 0) {
            finalReply += `

🏥 Hospital: ${recData.hospital}
🩺 Recommended Department: ${recData.specialization}

Available Doctors:
`;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            recData.doctors.forEach((doc) => {
              if (doc.availableDates) {
                const futureDates = doc.availableDates.filter((d) => {
                  const date = new Date(d);
                  date.setHours(0, 0, 0, 0);
                  return date >= today;
                });

                if (futureDates.length > 0) {
                  finalReply += `• ${doc.name}\n`;
                  finalReply += `  Slots: ${futureDates
                    .map((d) => new Date(d).toLocaleDateString())
                    .join(", ")}\n`;
                }
              }
            });
          }
        } catch {
          console.log("Doctor recommendation failed");
        }
      }

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          from: "bot",
          text: finalReply,
          time: now,
        },
      ]);
    } catch {
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          from: "bot",
          text: "Sorry, I'm having trouble connecting right now.",
          time: now,
        },
      ]);
    }
  };

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%,60%,100% { transform:translateY(0); opacity:.5 }
          30% { transform:translateY(-5px); opacity:1 }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 8rem)",
          maxWidth: 760,
          margin: "0 auto",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#fff",
            padding: "16px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Avatar size={44} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
              Aara — AI Medical Assistant
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
              ● Online · Powered by LLaMA 3
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#f8fafc",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((msg, index) => {
            const isUser = msg.from === "user";

            return (
              <div
                key={msg.id + "-" + index}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  gap: 10,
                }}
              >
                {!isUser && <Avatar size={32} />}

                <div
                  style={{
                    maxWidth: "72%",
                    background: isUser ? "#2563eb" : "#fff",
                    color: isUser ? "#fff" : "#334155",
                    padding: "12px 16px",
                    borderRadius: 16,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {typing && (
            <div style={{ display: "flex", gap: 10 }}>
              <Avatar size={32} />
              <TypingDots />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #f1f5f9",
            padding: "14px 16px",
            display: "flex",
            gap: 10,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type your health query..."
            style={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "11px 16px",
            }}
          />

          <button
            onClick={() => sendMessage(input)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}