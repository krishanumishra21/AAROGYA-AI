const symptomMap = {
  chest: "Cardiology",
  heart: "Cardiology",
  headache: "Neurology",
  migraine: "Neurology",
  brain: "Neurology",
  bone: "Orthopedics",
  fracture: "Orthopedics",
  joint: "Orthopedics",
  skin: "Dermatology",
  rash: "Dermatology",
  allergy: "Dermatology",
  child: "Pediatrics",
  baby: "Pediatrics"
};
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Hospital = require("../models/Hospital")
const axios = require("axios");
const Prescription = require("../models/Prescription");

const router = express.Router();

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user.id);

    const lower = message.toLowerCase();

    // 🔥 PATIENT INTENTS
if (user.role === "patient") {

  // 🩺 Check doctor availability tomorrow
  if (lower.includes("available") || lower.includes("availability")) {

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

    const doctors = await User.find({ role: "doctor" });

    let availableDoctors = [];

    doctors.forEach(doc => {
      doc.availableDates.forEach(date => {
        const d = new Date(date);
        d.setHours(0,0,0,0);

        if (d.getTime() === tomorrow.getTime()) {
          availableDoctors.push(doc.name);
        }
      });
    });

    if (availableDoctors.length === 0) {
      return res.json({
        reply: "No doctors are available tomorrow."
      });
    }

    return res.json({
      reply: `Available doctors tomorrow: ${availableDoctors.join(", ")}`
    });
  }

  // 📅 My appointments
  if (lower.includes("my appointments") || lower.includes("how many")) {
    const appts = await Appointment.find({
      patient: user._id
    });

    return res.json({
      reply: `You have ${appts.length} appointment(s) booked.`
    });
  }

}
    // 🔥 DOCTOR INTENTS
    if (user.role === "doctor") {
      if (lower.includes("today")) {
        const today = new Date();
        today.setHours(0,0,0,0);

        const appts = await Appointment.find({
          doctor: user._id,
          date: today
        });

        return res.json({
          reply: `You have ${appts.length} appointments today.`
        });
      }
    }

    // 🔥 ADMIN INTENTS
    if (user.role === "admin") {
      if (lower.includes("appointments")) {
        const appts = await Appointment.countDocuments();
        return res.json({
          reply: `Total appointments in hospital: ${appts}`
        });
      }
    }

    // Default fallback
    res.json({
      reply:
        "I am your Aarogya assistant. You can ask about appointments, booking, or availability."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI error" });
  }
});
// 🔥 AI PATIENT MEDICAL SUMMARY
router.get("/summary/:patientId", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can access summary" });
    }

    const { patientId } = req.params;

    const prescriptions = await Prescription.find({
      patient: patientId
    })
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    if (prescriptions.length === 0) {
      return res.json({
        summary: "No previous medical records available for this patient."
      });
    }

    const history = prescriptions.map(p => ({
      diagnosis: p.diagnosis,
      medicines: p.medicines,
      notes: p.notes,
      doctor: p.doctor?.name
    }));

    const prompt = `
Generate a short clinical summary for a doctor based on this patient's history.

Patient History:
${JSON.stringify(history)}

Include:
- Previous diagnoses
- Medicines prescribed
- Important notes
- Short recommendation

Keep it short and professional.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an AI medical assistant helping doctors quickly understand patient history."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const summary = response.data.choices[0].message.content;

    res.json({ summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI summary error" });
  }
});

router.post("/recommend-doctor", authMiddleware, async (req, res) => {
  try {

    const { symptom } = req.body

    if (!symptom) {
      return res.status(400).json({ message: "Symptom required" })
    }

    let specialization = "General"

    const s = symptom.toLowerCase()

    if (s.includes("heart") || s.includes("chest")) {
      specialization = "Cardiology"
    }
    else if (s.includes("skin")) {
      specialization = "Dermatology"
    }
    else if (s.includes("bone") || s.includes("joint")) {
      specialization = "Orthopedics"
    }
    else if (s.includes("brain") || s.includes("head")) {
      specialization = "Neurology"
    }

    const user = await User.findById(req.user.id)

    const doctors = await User.find({
      role: "doctor",
      hospital: user.hospital,
      specialization: specialization
    })

let hospitalName = "Partner Hospital"

if (doctors.length > 0 && doctors[0].hospital) {
  const hospital = await Hospital.findById(doctors[0].hospital)
  if (hospital) hospitalName = hospital.name
}
console.log("Doctors found:", doctors)
res.json({
  hospital: hospitalName,
  specialization,
  doctors
})

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Doctor recommendation failed" })
  }
})
module.exports = router;