import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/appointments/doctor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching appointments");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/appointments/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      fetchAppointments();
    } catch (err) {
      console.log("Error updating status");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">
        Patient Appointments
      </h2>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-slate-500">No appointments yet.</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt._id}
            onClick={() =>
              navigate(`/appointments/${appt._id}`)
            }
            className="border p-4 rounded-lg mb-4 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition"
          >
            <div>
              <p className="font-semibold">
                Patient: {appt.patient?.name}
              </p>
              <p className="text-sm text-slate-500">
                {appt.patient?.email}
              </p>
              <p className="text-sm">
                Date: {new Date(appt.date).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium">
                Status: {appt.status}
              </p>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex gap-2"
            >
              {appt.status === "Booked" && (
                <>
                  <button
                    onClick={() =>
                      updateStatus(appt._id, "Confirmed")
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(appt._id, "Cancelled")
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              )}

              {appt.status !== "Booked" && (
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    appt.status === "Confirmed"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {appt.status}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}