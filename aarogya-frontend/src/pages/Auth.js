import React, { useState } from "react";

export default function Auth() {
  const [role, setRole] = useState("patient");
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignup
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const bodyData = isSignup
      ? { ...formData, role }
      : { email: formData.email, password: formData.password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.reload();
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Login to Aarogya"}
        </h2>

        {/* ROLE SELECTOR */}
        <div className="flex justify-center gap-3 mb-6">
          {["patient", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {isSignup && (
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {isSignup
              ? `Create ${role} Account`
              : `Login as ${role}`}
          </button>
        </form>

        {/* GOOGLE BUTTON (UI READY) */}
        <div className="mt-6 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button
            onClick={() => alert("Google login coming soon 🚀")}
            className="w-full border py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* TOGGLE LOGIN / SIGNUP */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="ml-2 text-blue-600 cursor-pointer font-medium"
          >
            {isSignup ? "Login" : "Create one"}
          </span>
        </p>

      </div>
    </div>
  );
}
