const db = require("../../config/DB.js")

const getSatus = async(req, res) => {
    try {

        const [statuses] = await db.query(`SELECT * FROM status`);

        return res.status(200).json({
            success : true, data: statuses
        })
        
    } catch (error) {
        console.error("Error fetching status", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports = {getSatus};