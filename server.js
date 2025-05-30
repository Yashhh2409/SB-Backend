const express = require('express');
const cors = require('cors');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
// const categoryRoutes = require('./routes/categoryRoutes');
const recommendedRestarountsRoute = require('./routes/recommendedVendersRoute');
const userRoute = require('./routes/user/userRoute.js')
const logRoutes = require('./routes/customerLogsRoute')
// const db = require('./config/DB.js')
const locationLogRoutes = require('./routes/customerLocationLogsRoute.js')
const categoryRoutes = require('./routes/category/categoryRouter.js')


// ----------------------- AI ---------------------------------
const userLogRoute = require('./routes/Ai/userLogsRoute.js')
const messageRoute = require('./routes/Ai/messageRoute.js')
const locationLogRoute = require('./routes/Ai/LocationLogsRoute.js')

// ------------------------------------------------------------


const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// api routes
// app.use('/api/categories', categoryRoutes);
app.use('/api/recommendations', recommendedRestarountsRoute);


// app.use('/api/auth', authRoutes);
app.use('', userRoute);

// app.use('/api', logRoutes);

// app.use("/api", locationLogRoutes);

// ------------ Final Routes --------------
app.use('', categoryRoutes)
// ----------------------------

// ------------ AI --------------

app.use('', userLogRoute)
app.use('', messageRoute)
app.use('', locationLogRoute)

// ----------------------------





// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));

// // Authorization credentials
// const USERNAME = '8991000920721585892';
// const PASSWORD = 'dk_hICbAXnAeNoxudYh';

// app.post('/keybox/bootup', (req, res) => {
//   const user = basicAuth(req);
//   const headers = req.headers;
//   const bat = req.body.bat;

//   // Check Basic Auth
//   if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
//     return res.status(401).send('Unauthorized');
//   }

//   // Check for required header
//   if (headers['x-app-version'] !== '3.00') {
//     return res.status(400).send('Invalid App Version');
//   }

//   // Generate UTC time
//   const now = new Date();
//   const formattedUTC = now.toISOString().replace('T', ' ').substring(0, 19);

//   // Sample response logic
//   const response = `utc=${formattedUTC} 4&plan=1&manager=9,198`;
//   res.status(200).send(response);
// });

app.post('/keybox/bootup', (req, res) => {
  const bat = req.body.bat;

  // Generate UTC time
  const now = new Date();
  const formattedUTC = now.toISOString().replace('T', ' ').substring(0, 19);

  // Sample response logic
  const response = `utc=${formattedUTC} 4&plan=1&manager=9,198`;
  res.status(200).send(response);
});




app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});




