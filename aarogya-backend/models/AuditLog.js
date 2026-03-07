const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital"
    },
    action: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditSchema);