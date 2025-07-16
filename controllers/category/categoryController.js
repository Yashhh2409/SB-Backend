const db = require("../../config/DB.js");

const addCategory = async (req, res) => {
  try {
    const { category_name, icon, parent_category_id, status } = req.body;

    if (!category_name)
      return res.status(400).json({ message: "Category is name required" });

    // Role-based validation only Admin (1) & Staff (3) can add categories
    const currentUserType = req.user?.userType;

    console.log("User info in controller:", req.user);

    console.log("curr usertype:", currentUserType);



if (currentUserType !== 1 && currentUserType !== 3) {
  return res.status(403).json({
    success: false,
    message: "You are not allowed to add categories",
  });
}

    

    await db.query(
      `INSERT INTO categories (category_name, icon, parent_category_id, status, created_by) VALUES (?, ?, ?, ?, ?)`,
      [category_name, icon || null, parent_category_id || null, status, req.user.id,]
    );

    return res
      .status(200)
      .json({ success: true, message: "Category added successfully" });
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
};

module.exports = {addCategory}