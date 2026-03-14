require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());



// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/chatbot", require("./routes/chatRoutes"));


app.get("/", (req, res) => {
  res.send("Aarogya Backend Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");


const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const emergencyRoutes = require("./routes/emergencyRoutes");
app.use("/api/emergency", emergencyRoutes);

const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

app.use("/uploads", express.static("uploads"));

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

});