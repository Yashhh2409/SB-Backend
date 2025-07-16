const db = require("../../config/DB.js");

// Save user log
const saveUserLog = async (req, res) => {
  try {
    const { user_id, session_id, event, details, catid } =
      req.body;

    if (
      !user_id ||
      !session_id ||
      !event ||
      !details ||
      !catid
    )
      return res.status(404).json({ message: "All fields required" });

    const [result] = await db.execute(
      `INSERT INTO user_event_logs (user_id, session_id, event, details, catid)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        session_id,
        event,
        JSON.stringify(details),
        catid,
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
      `SELECT * FROM user_event_logs ORDER BY created_at DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { saveUserLog, getUserLogs };
