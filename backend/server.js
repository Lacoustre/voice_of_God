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

const corsOptions = {
  origin: ['https://thevogministries.org', 'https://admin-c4rg.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes with /api prefix
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

// Routes without /api prefix (for compatibility)
app.use('/contact', contactRoutes);
app.use('/newsletter', newsletterRoutes);
app.use("/auth", authRoutes);
app.use("/admin", manageAdminRoutes);
app.use("/media", uploadMediaRoutes);
app.use("/events", eventRoutes);
app.use("/announcements", announcementRoutes);
app.use("/services", serviceRoutes);
app.use("/members", memberRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/carousel", carouselRoutes);

// Debug: Check if build directory exists
const buildPath = path.join(__dirname, '../client/build');
console.log('Build path:', buildPath);
console.log('Build directory exists:', require('fs').existsSync(buildPath));

// Serve static files from React build
app.use(express.static(buildPath));

// Handle React routing - send all non-API requests to React app
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/events') || 
      req.path.startsWith('/media') || 
      req.path.startsWith('/services') || 
      req.path.startsWith('/members') || 
      req.path.startsWith('/auth') || 
      req.path.startsWith('/admin') || 
      req.path.startsWith('/dashboard') || 
      req.path.startsWith('/carousel') || 
      req.path.startsWith('/contact') || 
      req.path.startsWith('/newsletter')) {
    return next();
  }
  
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});