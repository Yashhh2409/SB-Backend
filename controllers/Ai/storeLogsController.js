const db = require("../../config/DB.js");

// Save user log
const saveStoreLog = async (req, res) => {
  try {
    const { store_id, session_id, event, details, catid } =
      req.body;

    if (
      !store_id ||
      !session_id ||
      !event ||
      !details ||
      !catid
    )
      return res.status(404).json({ message: "All fields required" });

    const [result] = await db.execute(
      `INSERT INTO store_event_logs (store_id, session_id, event, details, catid)
       VALUES (?, ?, ?, ?, ?)`,
      [
        store_id,
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
const getStoreLogs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM store_event_logs ORDER BY created_at DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { saveStoreLog, getStoreLogs };
