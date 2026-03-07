const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Hospital = require("../models/Hospital");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   📝 REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      hospitalName,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
console.log(req.body);
    // =========================
    // 🔥 ADMIN REGISTRATION
    // =========================
 if (role === "admin") {

  const { hospitalName, hospitalAddress } = req.body;

  if (!hospitalName || !hospitalAddress) {
    return res.status(400).json({
      message: "Hospital name and address required for admin"
    });
  }

  // STEP 1: Create admin user first (without hospital)
  const adminUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin"
  });

  // STEP 2: Create hospital and link admin
  const hospital = await Hospital.create({
    name: hospitalName,
    address: hospitalAddress,
    admin: adminUser._id
  });

  // STEP 3: Update admin with hospital ID
  adminUser.hospital = hospital._id;
  await adminUser.save();

  return res.status(201).json({
    message: "Admin account created successfully"
  });
}
    // =========================
    // 👤 PATIENT REGISTRATION
    // =========================
    if (role === "patient") {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "patient"
      });

      return res.status(201).json({
        message: "Patient registered successfully"
      });
    }

    // Prevent doctor self registration
    if (role === "doctor") {
      return res.status(403).json({
        message: "Doctors cannot self-register"
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   🔐 LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 VERY IMPORTANT: Check role
    if (user.role !== role) {
      return res.status(403).json({ message: "Invalid role selected" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* =========================
   👤 GET CURRENT USER
========================= */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("hospital", "name address")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   🩺 GET ALL DOCTORS
========================= */


/* =========================
   🩺 GET DOCTORS (Hospital-Based)
========================= */

router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.hospital) {
      return res.status(400).json({
        message: "User is not linked to any hospital"
      });
    }

    const doctors = await User.find({
      role: "doctor",
      hospital: currentUser.hospital
    }).select("-password");

    res.json(doctors);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   🔥 UPDATE PROFILE
========================= */

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      phone,
      bloodGroup,
      emergencyContact,
      allergies,
      chronicDiseases
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        bloodGroup,
        emergencyContact,
        allergies,
        chronicDiseases
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/* =========================
   🏥 ADMIN CREATE DOCTOR
========================= */

/* =========================
   🏥 ADMIN CREATE DOCTOR
========================= */

router.post("/admin/create-doctor", authMiddleware, async (req, res) => {
  try {

    // 🔐 Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    const { name, email, password, specialization } = req.body;

    // Check existing doctor
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const admin = await User.findById(req.user.id);

    if (!admin.hospital) {
      return res.status(400).json({
        message: "Admin is not linked to any hospital"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      specialization: specialization || "General",
      hospital: admin.hospital
    });

    await doctor.save();

    res.status(201).json({
      message: "Doctor created successfully",
      doctor
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
});

/* =========================
   🏥 GET ALL HOSPITALS
========================= */

router.get("/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("name address");
    res.json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;