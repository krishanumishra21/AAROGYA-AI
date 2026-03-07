import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DoctorAppointmentDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [appointment, setAppointment] = useState(null);
  const [history, setHistory] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" }
  ]);

  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAppointment();
  }, []);

  /* =========================
     FETCH APPOINTMENT
  ========================= */

  const fetchAppointment = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      const selected = data.find(a => a._id === id);

      setAppointment(selected);

      if (selected) {
        fetchHistory(selected.patient._id);
      }

    } catch (err) {
      console.log("Error fetching appointment detail");
    }
  };

  /* =========================
     FETCH PATIENT HISTORY
  ========================= */

  const fetchHistory = async (patientId) => {
    const res = await fetch(
      `http://localhost:5000/api/prescriptions/patient/${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setHistory(data);
  };

  /* =========================
     GENERATE AI SUMMARY
  ========================= */

  const generateSummary = async () => {
    try {

      setLoadingSummary(true);

      const res = await fetch(
        `http://localhost:5000/api/ai/summary/${appointment.patient._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setSummary(data.summary);

      setLoadingSummary(false);

    } catch (err) {
      console.log("AI summary error");
      setLoadingSummary(false);
    }
  };

  /* =========================
     MEDICINE HANDLING
  ========================= */

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" }
    ]);
  };

  /* =========================
     SUBMIT PRESCRIPTION
  ========================= */

  const submitPrescription = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("patient", appointment.patient._id);
    formData.append("appointment", appointment._id);
    formData.append("diagnosis", diagnosis);
    formData.append("notes", notes);
    formData.append("medicines", JSON.stringify(medicines));

    if (file) formData.append("file", file);

    const res = await fetch(
      "http://localhost:5000/api/prescriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (res.ok) {

      alert("Prescription created successfully!");

      setDiagnosis("");
      setNotes("");
      setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);

      fetchHistory(appointment.patient._id);

    } else {
      alert("Error creating prescription");
    }
  };

  if (!appointment) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-8">

      {/* =========================
         PATIENT INFO
      ========================= */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">
          Patient: {appointment.patient.name}
        </h2>

        <p>Email: {appointment.patient.email}</p>

        {/* AI SUMMARY BUTTON */}

        <button
          onClick={generateSummary}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Generate AI Medical Summary
        </button>

        {loadingSummary && (
          <p className="mt-3 text-gray-500">Generating AI summary...</p>
        )}

        {summary && (
          <div className="mt-4 bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              AI Medical Summary
            </h3>

            <p className="text-sm whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}

      </div>

      {/* =========================
         MEDICAL HISTORY
      ========================= */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-lg font-semibold mb-4">
          Patient Medical History
        </h3>

        {history.length === 0 && (
          <p className="text-gray-500">
            No previous prescriptions
          </p>
        )}

        {history.map((p) => (

          <div key={p._id} className="border-b py-3">

            <p><strong>Doctor:</strong> {p.doctor?.name}</p>

            <p><strong>Hospital:</strong> {p.hospital?.name}</p>

            <p><strong>Diagnosis:</strong> {p.diagnosis}</p>

            {p.fileUrl && (
              <a
                href={`http://localhost:5000/${p.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                View Uploaded Prescription
              </a>
            )}

          </div>

        ))}

      </div>

      {/* =========================
         CREATE PRESCRIPTION
      ========================= */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-lg font-semibold mb-4">
          Create New Prescription
        </h3>

        <form onSubmit={submitPrescription} className="space-y-4">

          <textarea
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {medicines.map((med, index) => (

            <div key={index} className="grid grid-cols-4 gap-2">

              <input
                placeholder="Medicine"
                value={med.name}
                onChange={(e) =>
                  handleMedicineChange(index, "name", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) =>
                  handleMedicineChange(index, "dosage", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) =>
                  handleMedicineChange(index, "frequency", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Duration"
                value={med.duration}
                onChange={(e) =>
                  handleMedicineChange(index, "duration", e.target.value)
                }
                className="border p-2 rounded"
              />

            </div>

          ))}

          <button
            type="button"
            onClick={addMedicine}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Medicine
          </button>

          <textarea
            placeholder="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Prescription
          </button>

        </form>

      </div>

    </div>
  );
}