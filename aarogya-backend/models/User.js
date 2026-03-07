const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true
    },
    specialization: {
  type: String,
  default: "General"
},

    // 🔥 Hospital reference
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null
    },

    // 🔥 Patient fields
    phone: {
      type: String,
      default: ""
    },

    bloodGroup: {
      type: String,
      default: ""
    },

    // 🆘 NEW Emergency QR Fields
    emergencyContact: {
      type: String,
      default: ""
    },

    allergies: {
      type: String,
      default: ""
    },

    chronicDiseases: {
      type: String,
      default: ""
    },

    // 🔥 Doctor fields
    availableDates: [
      {
        type: Date
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);