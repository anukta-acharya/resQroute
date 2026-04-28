const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve index.html, style.css, app.js, india-night.png

app.post("/analyze", (req, res) => {
  const { disaster, location } = req.body;

  // Example mock response
  res.json({
    risk_level: "High",
    risk_summary: `Detected ${disaster} risk near ${location}.`,
    evacuation_steps: [
      "Move to higher ground",
      "Avoid rivers and low-lying areas",
      "Follow NDMA alerts"
    ],
    nearest_resources: [
      "Relief camp at XYZ",
      "Hospital at ABC"
    ],
    alert_english: "Evacuate immediately!",
    alert_hindi: "तुरंत निकासी करें!"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ResQRoute server running on http://localhost:${PORT}`));
