// const db = require("../../config/DB.js");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// // const JWT_SECRET =  process.env.JWT_SECRET_KEY;

// const signup = async (req, res) => {
//   try {
//     const { email, phone, password, userType } = req.body;

//     if (!email || !phone || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Only allow userType = 3 (Customer) for public signup
//     if (userType !== 2) {
//       return res
//         .status(403)
//         .json({ message: "Only customers can sign up directly" });
//     }

//     // Check if email already exists
//     const [existing] = await db.query(
//       `SELECT id FROM user_data WHERE email = ?`,
//       [email]
//     );
//     if (existing.length > 0) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await db.query(
//       `INSERT INTO user_data (email, phone, password, userType)
//        VALUES (?, ?, ?, ?)`,
//       [email, phone, hashedPassword, userType]
//     );

//     const userId = result.insertId;

//     const token = jwt.sign(
//       { id: userId, email, userType },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(201).json({
//       success: true,
//       message: "Signup successful",
//       userId,
//       token,
//     });
//   } catch (err) {
//     console.error("Signup Error:", err);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: err.message });
//   }
// };

// const addUser = async (req, res) => {
//   try {
//     const { email, phone, password, userType } = req.body;
//     const createdBy = req.user;

//     if (!email || !phone || !password || !userType) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Role-based permissions
//     if (createdBy.userType === 1) {
//       // Admin can add anyone
//     } else if (createdBy.userType === 2) {
//       if (![3, 4].includes(userType)) {
//         return res
//           .status(403)
//           .json({ message: "Vendors can only add staff or customers" });
//       }
//     } else if (createdBy.userType === 4) {
//       if (userType !== 3) {
//         return res
//           .status(403)
//           .json({ message: "Staff can only add customers" });
//       }
//     } else {
//       return res.status(403).json({ message: "Customers cannot add users" });
//     }

//     const [existing] = await db.query(
//       `SELECT id FROM user_data WHERE email = ?`,
//       [email]
//     );
//     if (existing.length > 0) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await db.query(
//       `INSERT INTO user_data (email, phone, password, userType, created_by)
//        VALUES (?, ?, ?, ?, ?)`,
//       [email, phone, hashedPassword, userType, createdBy.id]
//     );

//     const userId = result.insertId;

//     const token = jwt.sign(
//       { id: userId, email, userType },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(201).json({
//       success: true,
//       message: "User added successfully",
//       userId,
//       token,
//     });
//   } catch (err) {
//     console.error("AddUser Error:", err);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: err.message });
//   }
// };

// // const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     db.query(
// //       `SELECT * FROM user_data WHERE email = ?`,
// //       [email],

// //       async (err, results) => {
// //         if (err) {
// //           return res.status(500).json({ message: "DB Error", error: err });
// //         }

// //         if (results.length === 0) {
// //           return res.status(404).json({ message: "User not found" });
// //         }

// //         const user = results[0];
// //         let isMatch = false;

// //         // if (user.role === "admin") {
// //         //   isMatch = password === user.password;
// //         // } else {
// //         //   isMatch = await bcrypt.compare(password, user.password);
// //         // }



// //         if (!isMatch) {
// //           return res.status(401).json({ message: "Invalid credentials" });
// //         }

// //         const token = jwt.sign(
// //           { id: user.id, role: user.role },
// //           process.env.JWT_SECRET_KEY,
// //           {
// //             expiresIn: "7d",
// //           }
// //         );

// //         res.json({
// //           message: "Login successful",
// //           token,
// //           user: {
// //             id: user.id,
// //             email: user.email,
// //             role: user.role,
// //           },
// //         });
// //       }
// //     );
// //   } catch (error) {
// //     return res
// //       .status(500)
// //       .json({ message: "Something went wrong", error: error.message });
// //   }
// // };

// const getAuthCustomers = async (req, res) => {
//   try {
//     // const userId = req.user.id;

//     const query = `SELECT id, email, phone, password, role, created_at FROM auth_users WHERE role = "customer"`;

//     db.query(query, (err, results) => {
//       if (err) {
//         console.error("DB Error:", err);
//         return res.status(500).json({ message: "Database Error" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       return res.status(200).json({ user: results });
//     });
//   } catch (error) {
//     console.error("Server Error:", error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // const login = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;

// //         if (!email || !password) {
// //             return res.status(400).json({ message: "Please provide email and password" });
// //         }

// //         const [existingUser] = await db.query(`select * from user_data where email=?`, [email]);

// //         if (existingUser.length === 0) {
// //             return res.status(404).json({ message: "No email registered" });
// //         }

// //         // password matching
// //         const verifyPassword = await bcrypt.compare(password, existingUser[0].password);
// //         if (!verifyPassword) {
// //             return res.status(401).send({
// //                 success: false,
// //                 message: 'Invalid credentials'
// //             });
// //         }

// //         // Create JWT token
// //         const token = jwt.sign(
// //             { id: existingUser[0].id, userType: existingUser[0].userType},
// //             process.env.JWT_SECRET_KEY,
// //             { expiresIn: '9h' }
// //         );
// //         const user_data = existingUser[0];
// //         // delete user_data.password;
// //         res.status(200).send({
// //             success: true,
// //             message: 'Login successful',
// //             token,
// //         });

// //     } catch (error) {
// //         console.log(error);
// //         res.status(500).send({
// //             success: false,
// //             message: 'Error in login user API',
// //             details: error.message
// //         });

// //     }
// // }



// module.exports = { addUser, signup, login, getAuthCustomers };


const db = require("../../config/DB.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET =  process.env.JWT_SECRET_KEY;

const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ msg: "Email and password required." });

  try {
    const [rows] = await db.query('SELECT * FROM user_data WHERE email = ?', [email]);

    if (rows.length === 0) return res.status(401).json({ msg: "Invalid credentials." });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials." });

    // Check user status
    if (user.status_id !== 1) return res.status(403).json({ msg: "Account is not active." });

    const token = jwt.sign({ id: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
};

// const addUser = async (req, res) => {
//   try {
//     const {
//       profile_image,
//       fname,
//       lname,
//       email,
//       phone,
//       password,
//       company,
//       designation,
//       website,
//       vat,
//       address,
//       description,
//       userType,
//       status_id
//     } = req.body;

//     // Required fields validation
//     if (!email || !phone || !password) {
//       return res.status(400).json({ message: "Email, phone, and password are required" });
//     }

//     // Role-based validation
//     const currentUserType = req.user.userType;

//     if (currentUserType === 2 && userType !== 4) {
//       return res.status(403).json({ message: "Vendors can only add customers" });
//     }

//     if (currentUserType === 4) {
//       return res.status(403).json({ message: "Customers are not allowed to add users" });
//     }

//     // Check if email already exists
//     const [existing] = await db.query("SELECT * FROM user_data WHERE email = ?", [email]);
//     if (existing.length > 0) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Created by current user
//     const created_by = req.user.id;

//     // Insert into database
//     await db.query(`
//       INSERT INTO user_data (
//         profile_image, fname, lname, email, phone, password, company,
//         designation, website, vat, address, description,
//         userType, status_id, created_by
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       profile_image || null,
//       fname || null,
//       lname || null,
//       email,
//       phone,
//       hashedPassword,
//       company || null,
//       designation || null,
//       website || null,
//       vat || null,
//       address || null,
//       description || null,
//       userType,
//       status_id || null,
//       created_by
//     ]);

//     return res.status(201).json({ success: true, message: "User added successfully" });

//   } catch (error) {
//     console.error("AddUser Error:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

const addUser = async (req, res) => {
  try {
    const {
      profile_image,
      fname,
      lname,
      email,
      phone,
      password,
      company,
      designation,
      website,
      vat,
      address,
      description,
      userType,
      status_id,
      business_name,
      state,
      city,
      certificate_images,
      category_id
    } = req.body;

    // Required fields validation
    if (!email || !phone || !password) {
      return res.status(400).json({ message: "Email, phone, and password are required" });
    }

    // Role-based validation
    const currentUserType = req.user.userType;

    if (currentUserType === 2 && userType !== 4) {
      return res.status(403).json({ message: "Vendors can only add customers" });
    }

    if (currentUserType === 4) {
      return res.status(403).json({ message: "Customers are not allowed to add users" });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT * FROM user_data WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Created by current user
    const created_by = req.user.id;

    // Insert into database
    await db.query(`
      INSERT INTO user_data (
        profile_image, fname, lname, email, phone, password, company,
        designation, website, vat, address, description, userType,
        status_id, business_name, state, city, certificate_images, category_id, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      profile_image || null,
      fname || null,
      lname || null,
      email,
      phone,
      hashedPassword,
      company || null,
      designation || null,
      website || null,
      vat || null,
      address || null,
      description || null,
      userType,
      status_id || null,
      business_name || null,
      state || null,
      city || null,
      certificate_images || null,
      category_id || null,
      created_by,
    ]);

    return res.status(201).json({ success: true, message: "User added successfully" });

  } catch (error) {
    console.error("AddUser Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        id, profile_image, fname, lname, email, phone, company, designation, 
        website, vat, address, description, userType, status_id, 
        business_name, state, city, certificate_images, category_id, created_by 
      FROM user_data
    `);

    return res.status(200).json({ success: true, users });

  } catch (error) {
    console.error("getAllUsers Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



module.exports = { loginWithEmail, addUser, getAllUsers };