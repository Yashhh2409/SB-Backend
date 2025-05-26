const db = require("../config/DB");

const SaveCustomerLogs = async (req, res) => {
  try {
    const { session_id, event, category, details = {}, weather_info = {}} =
      req.body;
      const user_id = req.user?.id;

    if (!user_id || !event) {
      return res.status(404).json({ message: "user_id and event required." });
    }

    const query = `INSERT INTO customer_logs (user_id, session_id, event, category, details, weather_info) VALUES (?, ?, ?, ?, ?, ?)`;
    const value = [
      user_id,
      session_id || null,
      event,
      category || null,
      JSON.stringify(details),
      JSON.stringify(weather_info),
    ];

    db.query(query, value, (err, result) => {
        if(err) {
            console.error("Error inserting log:", err);
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(201).json({message: "Log created", logId: result.insertId})
    });
  } catch (error) {}
};

module.exports = { SaveCustomerLogs };
