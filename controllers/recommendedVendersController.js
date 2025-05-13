const db = require("../config/DB");

// Temp token replaces by real JWT Token
const TEMP_TOKEN = "Bearer TEMP_TOKEN_FOR_SB";

const saveRecommendation = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (authHeader !== TEMP_TOKEN) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const { user_id, vendor_id, shop_name, category, content } = req.body;

  if (!user_id || !vendor_id || !shop_name || !category || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // check if user exists
    db.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id],

      (err, userResult) => {
        if (err) {
          console.error("Error querying user:", err);

          return res.status(500).json({ message: "Database error" });
        }

        if (userResult.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        // Inseart recommended restarounts
        const sql = `INSERT INTO recommended_vendors (user_id, vendor_id, shop_name, category, content) VALUES (?, ?, ?, ?, ?)`;

        db.query(
          sql,
          [user_id, vendor_id, shop_name, category, JSON.stringify(content)],
          (err, result) => {
            if (err) {
              console.error("Error inserting recommended venders:", err);
              return res
                .status(500)
                .json({ message: "Error saving recommended venders" });
            }

            res
              .status(201)
              .json({ message: "Recommended venders saved successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRecommendations = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (authHeader !== TEMP_TOKEN) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const user_id = req.params.user_id;

  if (!user_id) {
    res.status(400).json({ message: "User ID is required" });
  }

  const query = `SELECT * FROM recommended_vendors WHERE user_id = ?`;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching recommended vendors:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No Recommended Vendors Found" });
    }

    res.status(200).json({ recommendedVendors: results });
  });
};

module.exports = { saveRecommendation, getRecommendations };
