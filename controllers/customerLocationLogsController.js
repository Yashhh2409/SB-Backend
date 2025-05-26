const db = require("../config/DB.js");
const axios = require("axios");

const SaveLocationLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if ((!latitude, !longitude)) {
      return res
        .status(400)
        .json({ message: "Lattitude and Longitude are required" });
    }

    // Reverse Geocoding using OpenStreetMap
    const geoURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    const response = await axios.get(geoURL, {
      headers: { "User-Agent": "StreetBuddy" },
    });

    const address = response.data.address;
    const area =
      address.suburb ||
      address.neighbourhood ||
      address.village ||
      address.town ||
      null;
    const city =
      address.city || address.country || address.state_district || null;

    const query = `INSERT INTO location_logs (user_id, latitude, longitude, area, city) VALUES (?, ?, ?, ?, ?)`;

    const values = [userId, latitude, longitude, area, city];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(201).json({
        message: "Location log saved",
        data: {
          id: result.insertId,
          latitude,
          longitude,
          area,
          city,
        },
      });
    });
  } catch (error) {
    console.error("Reverse Geocoding Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { SaveLocationLogs };
