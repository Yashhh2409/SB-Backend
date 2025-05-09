const db = require('../config/DB');

// Add new category
exports.addCategory = (req, res) => {
  const { category_name, icon, parent_category_id, label } = req.body;

  const query = `
    INSERT INTO categories (category_name, icon, parent_category_id, label)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [category_name, icon, parent_category_id || null, label || null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Category added successfully', id: result.insertId });
    }
  );
};

// Get all categories
exports.getAllCategories = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database fetch failed' });
    }
    res.json(results);
  });
};
