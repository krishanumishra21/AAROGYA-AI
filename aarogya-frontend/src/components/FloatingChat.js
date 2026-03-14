import React, { useState } from "react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const token = localStorage.getItem("token");

    const res = await fetch("https://aarogya-ai-uugr.onrender.com/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    const botMessage = {
      role: "bot",
      text: data.reply || "Something went wrong"
    };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white rounded-xl shadow-xl flex flex-col">
          <div className="p-3 border-b font-semibold">
            Aarogya AI Assistant
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-2 max-h-64">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex border-t">
            <input
              className="flex-1 p-2 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="px-3 text-blue-600 font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}