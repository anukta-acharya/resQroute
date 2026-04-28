const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post("/analyze", (req, res) => {
  const { disaster, location } = req.body;

  const d = disaster.toLowerCase();
  const loc = location.toLowerCase();

  // ---- SMART RISK LOGIC ----
  let levels = ["Low", "Medium", "High", "Critical"];
  let risk_level = levels[Math.floor(Math.random() * levels.length)];

  if (d.includes("cyclone") || d.includes("tsunami")) {
    risk_level = Math.random() > 0.3 ? "Critical" : "High";
  }

  if (d.includes("flood")) {
    if (loc.includes("assam") || loc.includes("bihar")) {
      risk_level = "Critical";
    } else {
      risk_level = Math.random() > 0.5 ? "High" : "Medium";
    }
  }

  if (d.includes("earthquake")) {
    risk_level = Math.random() > 0.5 ? "High" : "Medium";
  }

  if (d.includes("landslide")) {
    risk_level = Math.random() > 0.6 ? "Medium" : "Low";
  }

  // ---- RESPONSES ----
  const evacuation = [
    "Move to nearest safe zone",
    "Avoid high-risk areas",
    "Carry essential supplies",
    "Follow government alerts"
  ];

  const resources = [
    `Relief camp near ${location}`,
    `Hospital near ${location}`,
    "Emergency helpline: 112"
  ];

  res.json({
    risk_level,
    risk_summary: `AI simulation indicates ${risk_level} risk of ${disaster} in ${location}.`,
    evacuation_steps: evacuation,
    nearest_resources: resources,
    alert_english: "Emergency alert! Follow instructions immediately.",
    alert_hindi: "आपातकालीन चेतावनी! तुरंत निर्देशों का पालन करें।"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
