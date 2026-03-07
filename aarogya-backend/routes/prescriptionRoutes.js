const express = require("express");
const AuditLog = require("../models/AuditLog");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");


const router = express.Router();

/* =========================
   📦 MULTER STORAGE CONFIG
========================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Remove spaces from filename
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + cleanName);
  }
});

const upload = multer({ storage });

/* =========================
   🩺 CREATE PRESCRIPTION
========================= */

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { patient, appointment, diagnosis, medicines, notes } = req.body;

    // 🔐 Ensure doctor had appointment with patient
    const validAppointment = await Appointment.findOne({
      _id: appointment,
      doctor: req.user.id,
      patient
    });

    if (!validAppointment) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    const doctor = await User.findById(req.user.id);

    const prescription = new Prescription({
      patient,
      doctor: req.user.id,
      hospital: doctor.hospital,
      appointment,
      diagnosis,
      medicines: medicines ? JSON.parse(medicines) : [],
      notes,
      // 🔥 FIXED HERE
      fileUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await prescription.save();

    res.status(201).json({
      message: "Prescription created successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   📂 GET PATIENT HISTORY (Doctor)
========================= */

router.get("/patient/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patientId = req.params.id;

    const hasAppointment = await Appointment.findOne({
      doctor: req.user.id,
      patient: patientId
    });

    if (!hasAppointment) {
      // 🔥 Create Audit Record
const doctor = await User.findById(req.user.id);

await AuditLog.create({
  doctor: req.user.id,
  patient: patientId,
  hospital: doctor.hospital,
  action: "Viewed Patient Medical History"
});
      return res.status(403).json({
        message: "You are not authorized to view this patient's history"
      });
    }

    const prescriptions = await Prescription.find({
      patient: patientId
    })
      .populate("doctor", "name")
      .populate("hospital", "name")
      .sort({ createdAt: -1 });

    res.json(prescriptions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   📂 GET MY PRESCRIPTIONS (Patient)
========================= */

router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescriptions = await Prescription.find({
      patient: req.user.id
    })
      .populate("doctor", "name")
      .populate("hospital", "name")
      .sort({ createdAt: -1 });

    res.json(prescriptions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;