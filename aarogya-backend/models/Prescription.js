const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },

    diagnosis: {
      type: String,
      default: ""
    },

    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String
      }
    ],

    notes: {
      type: String,
      default: ""
    },  // ✅ COMMA WAS MISSING HERE

    fileUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);