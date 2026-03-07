router.get("/grouped", async (req, res) => {
  try {

    const doctors = await User.find({ role: "doctor" });

    const grouped = {};

    doctors.forEach(doc => {

      if (!grouped[doc.specialization]) {
        grouped[doc.specialization] = [];
      }

      grouped[doc.specialization].push(doc);

    });

    res.json(grouped);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }
});