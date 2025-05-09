const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = 8000;

// Enable CORS for all origins
app.use(cors());

app.use(bodyParser.json());
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
