const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConnection');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    // Use the FRONTEND_URL env var; strip any trailing slash so it matches
    // the browser origin (e.g. http://localhost:5173)
    origin: (() => {
      const url = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
      return url;
    })(),
    credentials: true,
  })
);

//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});