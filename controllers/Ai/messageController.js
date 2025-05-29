const db = require("../../config/DB.js")

const saveMessage = async (req, res) => {
  try {
    const { type, sender, content, message } = req.body;

    if (!type || !sender || !content) {
      return res.status(400).json({ message: "Type, sender, and content are required" });
    }

    const [result] = await db.execute(
      `INSERT INTO messages (type, sender, content, message) VALUES (?, ?, ?, ?)`,
      [type, sender, content, message || null]
    );

    res.status(201).json({ message: "Message saved", messageId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM messages ORDER BY timestamp DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {saveMessage, getAllMessages}