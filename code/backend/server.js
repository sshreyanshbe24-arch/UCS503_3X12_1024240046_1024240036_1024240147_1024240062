require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const dashRoutes = require('./dashRoutes');
//const teamRoutes = require('./teamRoutes');
const postRoutes = require('./postRoutes');
//const notificationRoutes = require('./notificationRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashRoutes);
//app.use('/api/teams', teamRoutes);
app.use('/api/posts', postRoutes);
//app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Project Team Formation Portal API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});