const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// Load environment variables
// const HOST = process.env.HOST;
// const USER = process.env.USER;
// const PASSWORD = process.env.PASSWORD;
// const DATABASE = process.env.DATABASE;

// console.log("host", HOST);

// Create a MySQL connection pool
const db = mysql.createPool({
  // host: HOST,
  // user: USER,
  // password: PASSWORD,
  // database: DATABASE,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0

  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,

  // console.log("host is", host);
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("MySQL connected...");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db;
