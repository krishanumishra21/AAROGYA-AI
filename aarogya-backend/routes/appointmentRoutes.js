const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Hospital = require("../models/Hospital");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const router = express.Router();

/* =========================
   🏥 GET DOCTORS BY HOSPITAL
========================= */

router.get("/doctors/:hospitalId", async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      hospital: req.params.hospitalId,
    }).select("name email");

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   📅 GET DOCTOR AVAILABILITY
========================= */

router.get("/availability/:doctorId", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor.availableDates);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   📅 BOOK APPOINTMENT
========================= */

router.post("/book", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({
        message: "Only patients can book appointments",
      });
    }

    const { doctor, hospital, date } = req.body;

    if (!doctor || !hospital || !date) {
      return res.status(400).json({
        message: "Doctor, hospital and date are required",
      });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot book past dates",
      });
    }

    // Validate hospital
    const hospitalDoc = await Hospital.findById(hospital);
    if (!hospitalDoc) {
      return res.status(404).json({
        message: "Hospital not found",
      });
    }

    // Validate doctor
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Ensure doctor belongs to hospital
    if (
      !doctorUser.hospital ||
      doctorUser.hospital.toString() !== hospital
    ) {
      return res.status(400).json({
        message: "Doctor does not belong to selected hospital",
      });
    }

    // Check availability
    const isAvailable = doctorUser.availableDates.some((d) => {
      const dDate = new Date(d);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === selectedDate.getTime();
    });

    if (!isAvailable) {
      return res.status(400).json({
        message: "Doctor not available on this date",
      });
    }

    // Prevent duplicate booking
    const existing = await Appointment.findOne({
      patient: req.user.id,
      doctor,
      date: selectedDate,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already booked this doctor on this date",
      });
    }

    const appointment = new Appointment({
      patient: req.user.id,
      doctor,
      hospital,
      date: selectedDate,
      status: "Booked",
    });

  await appointment.save();

/* 🔔 Trigger n8n automation */
await axios.post("http://localhost:5678/webhook-test/appointment-created", {
  patient: req.user.id,
  doctor: doctor,
  hospital: hospital,
  date: selectedDate
});

    // Remove availability
    doctorUser.availableDates = doctorUser.availableDates.filter((d) => {
      const dDate = new Date(d);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() !== selectedDate.getTime();
    });

    await doctorUser.save();

    res.status(201).json({
      message: "Appointment booked successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   📌 GET MY APPOINTMENTS
========================= */

router.get("/my", authMiddleware, async (req, res) => {
  try {
    let appointments;

    // PATIENT
    if (req.user.role === "patient") {
      appointments = await Appointment.find({
        patient: req.user.id,
      })
        .populate("doctor", "name email")
        .populate("hospital", "name")
        .sort({ date: 1 });

    // DOCTOR
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({
        doctor: req.user.id,
      })
        .populate("patient", "name email")
        .populate("hospital", "name")
        .sort({ date: 1 });

    // ADMIN
    } else if (req.user.role === "admin") {
      const admin = await User.findById(req.user.id);

      appointments = await Appointment.find({
        hospital: admin.hospital,
      })
        .populate("patient", "name email")
        .populate("doctor", "name email")
        .populate("hospital", "name")
        .sort({ date: 1 });

    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(appointments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   🩺 UPDATE STATUS (Doctor)
========================= */

router.put("/update-status/:id", authMiddleware, async (req, res) => {
  try {

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment updated successfully",
      appointment
    });

  } catch (err) {

    console.error("Update status error:", err);

    res.status(500).json({
      message: "Server error updating appointment"
    });

  }
});

/* =========================
   📅 DOCTOR ADD AVAILABILITY
========================= */

router.post("/add-availability", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { date } = req.body;

    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);

    const doctor = await User.findById(req.user.id);

    const exists = doctor.availableDates.some((d) => {
      const dDate = new Date(d);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === newDate.getTime();
    });

    if (exists) {
      return res.status(400).json({
        message: "Date already added",
      });
    }

    doctor.availableDates.push(newDate);
    await doctor.save();

    res.json({
      message: "Availability added successfully",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/hospital", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user.hospital) {
      return res.json([]);
    }

    const appointments = await Appointment.find({
      hospital: user.hospital
    })
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ date: -1 });

    res.json(appointments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch hospital appointments" });
  }
});


module.exports = router;