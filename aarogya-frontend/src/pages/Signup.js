import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();
  const validRole = role === "admin" ? "admin" : "patient";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hospitalName: "",
    hospitalAddress: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const bodyData = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: validRole,
      ...(validRole === "admin" && {
        hospitalName: form.hospitalName,
        hospitalAddress: form.hospitalAddress,
      }),
    };

    try {
      const res = await fetch("https://aarogya-ai-uugr.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMsg("✅ Account created successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMsg(err.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 transition-all duration-300 hover:shadow-2xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create {validRole === "admin" ? "Admin" : "Patient"} Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-sm cursor-pointer text-blue-600"
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>

          {validRole === "admin" && (
            <>
              <input
                name="hospitalName"
                placeholder="Hospital Name"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.hospitalName}
                onChange={handleChange}
                required
              />

              <input
                name="hospitalAddress"
                placeholder="Hospital Address"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.hospitalAddress}
                onChange={handleChange}
                required
              />
            </>
          )}

          {msg && (
            <p className="text-center text-sm text-red-600">
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}