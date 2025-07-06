const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoute');
const newsletterRoutes = require('./routes/newsLetterRoute');
const manageAdminRoutes = require("./routes/manageAdminRoute");
const authRoutes = require("./routes/authRoute");
const uploadMediaRoutes = require('./routes/uploadMediaRoute');
const eventRoutes = require('./routes/eventRoute');
const announcementRoutes = require('./routes/announcementRoute');
const serviceRoutes = require('./routes/serviceRoute');
const memberRoutes = require('./routes/memberRoute');
const dashboardRoutes = require("./routes/statsRoute");
const carouselRoutes = require('./routes/carouselRoute');


const app = express();
const PORT = process.env.PORT;

// CORS configuration
const corsOptions = {
  origin: ['https://thevogministries.org', 'https://admin-c4rg.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", manageAdminRoutes);
app.use("/api/media", uploadMediaRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/carousel", carouselRoutes);

// Debug: Check if build directory exists
const buildPath = path.join(__dirname, '../client/build');
console.log('Build path:', buildPath);
console.log('Build directory exists:', require('fs').existsSync(buildPath));

// Serve static files from React build
app.use(express.static(buildPath));

// Handle React routing - send all non-API requests to React app
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});