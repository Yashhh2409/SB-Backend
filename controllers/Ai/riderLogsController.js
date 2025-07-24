const db = require("../../config/DB.js");

// Save user log
const saveRiderLog = async (req, res) => {
  try {
    const { rider_id, session_id, event, details } =
      req.body;

    if (
      !rider_id ||
      !session_id ||
      !event ||
      !details
    )
      return res.status(404).json({ message: "All fields required" });

    const [result] = await db.execute(
      `INSERT INTO rider_event_logs (rider_id, session_id, event, details)
       VALUES (?, ?, ?, ?)`,
      [
        rider_id,
        session_id,
        event,
        JSON.stringify(details),
      ]
    );

    res.status(201).json({ message: "Log saved", logId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get logs for all users
const getRiderLogs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM rider_event_logs ORDER BY created_at DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { saveRiderLog, getRiderLogs };
