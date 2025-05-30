const db = require("../../config/DB.js");
const axios = require("axios");

const SaveLocationLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required" });
    }

    // Get address from coordinates
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

    // Check if user already has a location log
    const [existingUser] = await db.query("SELECT * FROM location_logs WHERE user_id = ?", [userId]);

    if (existingUser.length > 0) {
      // Update existing location
      await db.query(
          `UPDATE location_logs 
           SET latitude = ?, longitude = ?, area = ?, city = ? 
           WHERE user_id = ?`,
          [latitude, longitude, area, city, userId]
        );

      return res.status(200).json({
        message: "Location updated",
        data: {
          user_id: userId,
          latitude,
          longitude,
          area,
          city,
        },
      });
    } else {
      // Insert new location
      const [result] = await db.query(
          `INSERT INTO location_logs (user_id, latitude, longitude, area, city) VALUES (?, ?, ?, ?, ?)`,
          [userId, latitude, longitude, area, city]
        );

      return res.status(201).json({
        message: "Location log saved",
        data: {
          id: result.insertId,
          user_id: userId,
          latitude,
          longitude,
          area,
          city,
        },
      });
    }
  } catch (error) {
    console.error("Reverse Geocoding Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getLocationLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
        `SELECT 
           location_logs.id,
           location_logs.user_id,
           CONCAT(user_data.fname, ' ', user_data.lname) AS user_name,
           location_logs.latitude,
           location_logs.longitude,
           location_logs.area,
           location_logs.city,
           location_logs.created_at
         FROM location_logs
         JOIN user_data ON location_logs.user_id = user_data.id
         ORDER BY location_logs.created_at DESC`
      );

    res.status(200).json({ message: "Location logs fetched", data: rows });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { SaveLocationLogs, getLocationLogs };
