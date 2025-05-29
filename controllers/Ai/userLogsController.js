const db = require("../../config/DB.js");

// Save user log
const saveUserLog = async (req, res) => {
  try {
    const { user_id, session_id, event, category, details, weather_info } =
      req.body;

    if (
      !user_id ||
      !session_id ||
      !event ||
      !category ||
      !details
    )
      return res.status(404).json({ message: "All fields required" });

    const [result] = await db.execute(
      `INSERT INTO user_logs (user_id, session_id, event, category, details, weather_info)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        session_id,
        event,
        category,
        JSON.stringify(details),
        weather_info ? JSON.stringify(weather_info) : null
      ]
    );

    res.status(201).json({ message: "Log saved", logId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get logs for all users
const getUserLogs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM user_logs ORDER BY created_at DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { saveUserLog, getUserLogs };
