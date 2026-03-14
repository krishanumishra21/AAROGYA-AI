import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./layout/Layout";
import Login from "./pages/login";
import Signup from "./pages/Signup";


import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminAppointments from "./pages/AdminAppointments";

import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import EmergencyPage from "./pages/EmergencyPage";
import DoctorAppointmentDetail from "./pages/DoctorAppointmentDetail";

export default function App() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://aarogya-ai-uugr.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Auth error");
      }
    };

    fetchUser();
  }, [token]);

  const isAuthenticated = !!token;

  const DashboardPage = () => {
    if (!user) return null;
    if (user.role === "doctor") return <DoctorDashboard />;
    if (user.role === "admin") return <AdminDashboard />;
    return <PatientDashboard />;
  };

  const AppointmentPage = () => {
    if (!user) return null;
    if (user.role === "doctor") return <DoctorAppointments />;
    if (user.role === "admin") return <AdminAppointments />;
    return <Appointments />;
  };

  return (
    <Router>
      <Routes>

        {/* Public Emergency Page */}
        <Route path="/emergency/:id" element={<EmergencyPage />} />

        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup/:role" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="/" element={<Layout user={user} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentPage />} />
            <Route
              path="appointments/:id"
              element={<DoctorAppointmentDetail />}
            />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}

      </Routes>
    </Router>
  );
}