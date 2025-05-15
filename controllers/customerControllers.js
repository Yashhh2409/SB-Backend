const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/DB");
const dotenv = require("dotenv").config();

// Signup Controller
const signup = async (req, res) => {
  const { email, phone, password } = req.body;

  // check if user exists
  try {
    const query = `SELECT * FROM customers WHERE email = ?`;
    pool.query(query, [email], async (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error occured during signup", error: err.message });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const inseartQuery = `INSERT INTO customers(email, phone, password) VALUES (?, ?, ?)`;

      pool.query(
        inseartQuery,
        [email, phone, hashedPassword],
        (err, result) => {
          if (err) {
            res.status(500).json({
              message: "Error occured during signup",
              error: err.message,
            });
          }

          // Generate JWT Token
          const token = jwt.sign(
            {
              userId: result.insertId,
              email,
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: "1h"}
          )

          res.status(201).json({
            message: "User created successfully",
            token,
          });
        }
      );
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error occured during signup", error: err.message });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM customers WHERE email = ?`;
    pool.query(query, [email], async (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error occured during login", error: err.message });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = result[0];

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email pr password" });
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({message: 'Login successful', token});
    });
  } catch (error) {
    res.status(500).json({message: 'Error occured during login', error: error.message});
  }
};

module.exports = {signup, login};
