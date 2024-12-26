const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require("./routes/contactRoutes");
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// MongoDB connection
connectDB();

// Initialize Express app
const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['https://portfolio-website-frontend-gray.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api', contactRoutes);

// Export the app for Vercel
module.exports = app;
