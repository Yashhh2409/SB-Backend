const db = require("../config/DB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// const JWT_SECRET =  process.env.JWT_SECRET_KEY;

const signup = async (req, res) => {
  try {
    const { email, phone, password, userType } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Only allow userType = 3 (Customer) for public signup
    if (userType !== 2) {
      return res
        .status(403)
        .json({ message: "Only customers can sign up directly" });
    }

    // Check if email already exists
    const [existing] = await db.query(
      `SELECT id FROM auth_users WHERE email = ?`,
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO auth_users (email, phone, password, userType)
       VALUES (?, ?, ?, ?)`,
      [email, phone, hashedPassword, userType]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, email, userType },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
      userId,
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { email, phone, password, userType } = req.body;
    const createdBy = req.user;

    if (!email || !phone || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Role-based permissions
    if (createdBy.userType === 1) {
      // Admin can add anyone
    } else if (createdBy.userType === 2) {
      if (![3, 4].includes(userType)) {
        return res
          .status(403)
          .json({ message: "Vendors can only add staff or customers" });
      }
    } else if (createdBy.userType === 4) {
      if (userType !== 3) {
        return res
          .status(403)
          .json({ message: "Staff can only add customers" });
      }
    } else {
      return res.status(403).json({ message: "Customers cannot add users" });
    }

    const [existing] = await db.query(
      `SELECT id FROM user_data WHERE email = ?`,
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO user_data (email, phone, password, userType, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [email, phone, hashedPassword, userType, createdBy.id]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, email, userType },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "User added successfully",
      userId,
      token,
    });
  } catch (err) {
    console.error("AddUser Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
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

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );

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

const getAuthCustomers = async (req, res) => {
  try {
    // const userId = req.user.id;

    const query = `SELECT id, email, phone, password, role, created_at FROM auth_users WHERE role = "customer"`;

    db.query(query, (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user: results });
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { addUser, signup, login, getAuthCustomers };
