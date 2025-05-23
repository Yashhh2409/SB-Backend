const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Load environment variables
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

// Create a MySQL connection pool
const db = mysql.createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('MySQL connected...');
        connection.release(); // Release the connection back to the pool
    }
});

module.exports = db;
