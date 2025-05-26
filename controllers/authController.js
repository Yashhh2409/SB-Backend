const db = require("../config/DB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()


const allowedSignupRoles = ["customer", "vendor", "staff", "manager"];

const signup = async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;

    if (!allowedSignupRoles.includes(role.toLowerCase())) {
      return res
        .status(403)
        .json({ message: "Signup is not allowed for this role" });
    }

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO auth_users (email, phone, password, role) VALUES (?, ?, ?, ?)`,
      [email, phone || null, hashedPassword, role],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }
          return res.status(500).json({ message: "DB Error", error: err });
        }

        const insertedID = result.insertId;

        const token = jwt.sign({ id: insertedID, role }, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });

        res.status(201).json({
          message: "User registered successfully",
          token,
          role,
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    db.query(
      `SELECT * FROM auth_users WHERE email = ?`,
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: "DB Error", error: err });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        let isMatch = false;

        if (user.role === "admin") {
          isMatch = password === user.password;
        } else {
          isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });

        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { signup, login };
