const express = require('express');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/conatctRoute');
const newsletterRoutes = require('./routes/newsLetterRoute');
const manageAdminRoutes = require("./routes/manageAdminRoute");
const authRoutes = require("./routes/authRoute");
const uploadMediaRoutes = require('./routes/uploadMediaRoute');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: ['https://thevogministries.org'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", manageAdminRoutes);
app.use("/api/media", uploadMediaRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
