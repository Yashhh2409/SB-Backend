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

// ------ without auth ---

app.post('/keybox/bootup', (req, res) => {
  const bat = req.body.bat;

  // Generate UTC time
  const now = new Date();
  const formattedUTC = now.toISOString().replace('T', ' ').substring(0, 19);

  // Sample response logic
  const response = `utc=${formattedUTC} 4&plan=1&manager=9,198`;
  res.status(200).send(response);
});


// --- track at commands

app.post("/track-at-command", (req, res) => {
  const { step, status, message } = req.body;

  const logLine = `[${new Date().toISOString()}] STEP: ${step || "N/A"} | STATUS: ${status || "N/A"} | MESSAGE: ${message || "None"}\n`;

  // Path to the log file
  const logFilePath = path.join(__dirname, "at_command_log.txt");

  // Append the log line to the file
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
      return res.status(500).json({ success: false, message: "Failed to write log" });
    }

    console.log("Logged:", logLine.trim());
    res.status(200).json({ success: true, message: "Log saved successfully" });
  });
});


// ----------------- Image upload --------------------

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });


// app.post('/keybox/bootup/img', upload.single('image'), (req, res) => {
//   // Build the public URL for the uploaded file
//   let fileUrl = null;
//   if (req.file) {
//     const protocol = req.protocol;
//     const host = req.get('host');
//     fileUrl = `${protocol}://${host}/uploads/${encodeURIComponent(req.file.filename)}`;
//   }

//   const allData = {
//     ...req.body, // All form fields (e.g. bat, name, etc.)
//     file_url: fileUrl, // Publicly accessible URL
//     utc: new Date().toISOString().replace('T', ' ').substring(0, 19)
//   };

//   res.status(200).json(allData);
// });
// ---------------------------------------------------

// Middleware to parse JSON and urlencoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));

// 1. Declare storage and upload first
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ------------------------------------------------------

app.post('/keybox/img/text', upload.single('image'), (req, res) => {
  let fileUrl = null;
  if (req.file) {
    const protocol = req.protocol;
    const host = req.get('host');
    fileUrl = `${protocol}://${host}/uploads/${encodeURIComponent(req.file.filename)}`;
    const utc = new Date().toISOString().replace('T', ' ').substring(0, 19);
    res.status(200).send(`Image is uploaded: ${fileUrl} at ${utc}`);
  } else {
    res.status(400).send('No image uploaded.');
  }
});


// ------------------------------------------------------




// API endpoint
app.post('/keybox/bootup/imageBase64', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  // 1. Convert buffer to base64
  const base64Image = req.file.buffer.toString('base64');

  // 2. Decode base64 back to buffer
  const imageBuffer = Buffer.from(base64Image, 'base64');

  // 3. Generate filename
  const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}.jpg`;
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const filePath = path.join(uploadDir, filename);

  // 4. Save buffer as JPG file
  fs.writeFile(filePath, imageBuffer, err => {
    if (err) {
      return res.status(500).send('Error saving image.');
    }

    // 5. Build public URL
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${encodeURIComponent(filename)}`;

    // 6. Respond with the image URL
    res.status(200).json({
      message: 'Image uploaded, converted, and saved as JPG.',
      file_url: fileUrl
    });
  });
});

// ------------------------------------------------------


app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});




