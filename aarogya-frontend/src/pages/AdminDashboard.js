import React, { useEffect, useState } from "react";

export default function AdminDashboard() {

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialization, setSpecialization] = useState("General");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {

      const resUser = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = await resUser.json();
      setHospital(userData.hospital);

      const resDoctors = await fetch("http://localhost:5000/api/auth/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const doctorsData = await resDoctors.json();
      setDoctors(doctorsData);

      const resAppointments = await fetch(
        "http://localhost:5000/api/appointments/hospital",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const appointmentsData = await resAppointments.json();
      setAppointments(appointmentsData);

    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const createDoctor = async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(
      "http://localhost:5000/api/auth/admin/create-doctor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          password,
          specialization
        })
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Doctor created successfully!");
      fetchHospitalData();
      e.target.reset();
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="space-y-8">

      {/* Hospital Info */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-bold mb-2">
          {hospital?.name}
        </h2>
        <p className="text-gray-500">
          {hospital?.address}
        </p>
      </div>

      {/* Create Doctor */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-semibold mb-4">
          Add New Doctor
        </h3>

        <form
          onSubmit={createDoctor}
          className="space-y-3"
        >

          <input
            name="name"
            placeholder="Doctor Name"
            className="w-full border rounded-lg p-2"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Doctor Email"
            className="w-full border rounded-lg p-2"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-2"
            required
          />

          {/* Specialization Dropdown */}
          <select
            value={specialization}
            onChange={(e)=>setSpecialization(e.target.value)}
            className="w-full border rounded-lg p-2"
          >

            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General">General</option>

          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Doctor
          </button>

        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Total Doctors</h3>
          <p className="text-3xl font-bold mt-2">
            {doctors.length}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold">
            Total Appointments
          </h3>
          <p className="text-3xl font-bold mt-2">
            {appointments.length}
          </p>
        </div>

      </div>

      {/* Doctor List */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-semibold mb-4">
          Hospital Doctors
        </h3>

        {doctors.length === 0 && (
          <p className="text-gray-500">
            No doctors added yet.
          </p>
        )}

        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="border-b py-2 flex justify-between"
          >
            <span>
              {doc.name} ({doc.specialization})
            </span>

            <span className="text-sm text-gray-500">
              {doc.email}
            </span>
          </div>
        ))}
      </div>

      {/* Hospital Appointments */}
      <div className="bg-white p-6 rounded-xl shadow border">

        <h3 className="text-lg font-semibold mb-4">
          Hospital Appointments
        </h3>

        {appointments.length === 0 && (
          <p className="text-gray-500">
            No appointments yet.
          </p>
        )}

        {appointments.map((appt) => (

          <div
            key={appt._id}
            className="border-b py-2"
          >

            <p>
              <strong>Patient:</strong> {appt.patient?.name}
            </p>

            <p>
              <strong>Doctor:</strong> {appt.doctor?.name}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(appt.date).toLocaleDateString()}
            </p>

            <p>
              <strong>Status:</strong> {appt.status}
            </p>

          </div>

        ))}
      </div>

    </div>
  );
}