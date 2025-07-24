const express = require('express');
const cors = require('cors');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const multer = require('multer');
const multiparty = require('multiparty');



// const categoryRoutes = require('./routes/categoryRoutes');
const recommendedRestarountsRoute = require('./routes/recommendedVendersRoute');
const userRoute = require('./routes/user/userRoute.js')
const logRoutes = require('./routes/customerLogsRoute')
// const db = require('./config/DB.js')
const locationLogRoutes = require('./routes/customerLocationLogsRoute.js')
const categoryRoutes = require('./routes/category/categoryRouter.js')
const statusRoutes = require('./routes/common/statusRoutes.js')

const app = express();

const fs = require("fs");
const path = require("path");

app.use(express.urlencoded({ extended: true }));


// ----------------------- AI ---------------------------------
const userLogRoute = require('./routes/Ai/userLogsRoute.js')
const messageRoute = require('./routes/Ai/messageRoute.js')
const locationLogRoute = require('./routes/Ai/LocationLogsRoute.js')
const recVendors = require('./routes/Ai/getRecVendorsRoute.js')
const storeLogRoute = require('./routes/Ai/storeLogsRoute.js')
const riderLogRoute = require('./routes/Ai/riderLogsRoute.js')

// ------------------------------------------------------------



const PORT = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// api routes
// app.use('/api/categories', categoryRoutes);
app.use('/api/recommendations', recommendedRestarountsRoute);


app.use('/uploads', express.static('uploads'));


// app.use('/api/auth', authRoutes);
app.use('', userRoute);

// app.use('/api', logRoutes);

// app.use("/api", locationLogRoutes);

// ------------ Final Routes --------------
app.use('', categoryRoutes)
app.use('', statusRoutes)

// ------------ AI ------------

app.use('', userLogRoute)
app.use('', messageRoute)
app.use('', locationLogRoute)
app.use('', recVendors)
app.use('', storeLogRoute)
app.use('', riderLogRoute)
// ----------------------------



app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});




