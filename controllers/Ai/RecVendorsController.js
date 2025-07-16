const db = require('../../config/DB.js')

const getRecVendors = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM recommended_vendors`);
    res.status(200).json(rows)
    
  } catch (error) {
    console.error("Error getting Vendors");
    res.status(404).json({message: "Failed", error: error.message})
  }
}

module.exports = {getRecVendors};