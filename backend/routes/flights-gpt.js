const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { from, to, date } = req.body;
  const prompt = `Pretend you are a flight search API. Give me a JSON array of 3 flights from ${from} to ${to} on ${date}. Each flight should have airline, flight_number, departure_time, arrival_time, and price.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });
    // Extract JSON from the response
    const match = completion.choices[0].message.content.match(/(\[.*\])/s);
    const flights = match ? JSON.parse(match[1]) : [];
    res.json({ flights });
  } catch (err) {
    res.status(500).json({ error: "Failed to get flight data from OpenAI." });
  }
});

module.exports = router;