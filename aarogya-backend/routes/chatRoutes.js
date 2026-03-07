const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
       model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are Aara, an AI medical assistant for Aarogya hospital platform.
Provide helpful, safe health guidance.
If symptoms indicate emergency, clearly warn the user.
Always include: "This is not a substitute for professional medical advice."
            `
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({ reply: aiReply });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ reply: "AI service error. Please try again." });
  }
});

module.exports = router;