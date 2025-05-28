const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const categoryRoutes = require('./routes/categoryRoutes');
const recommendedRestarountsRoute = require('./routes/recommendedVendersRoute');
const userRoute = require('./routes/user/userRoute.js')
const logRoutes = require('./routes/customerLogsRoute')
// const db = require('./config/DB.js')
const locationLogRoutes = require('./routes/customerLocationLogsRoute.js')



const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// api routes
app.use('/api/categories', categoryRoutes);
app.use('/api/recommendations', recommendedRestarountsRoute);


// app.use('/api/auth', authRoutes);
app.use('', userRoute);

app.use('/api', logRoutes);

app.use("/api", locationLogRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});




