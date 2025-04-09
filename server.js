const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const COUNTRY = 'us'; // Change to your desired country code

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

// 🔎 Job Search
app.get('/api/jobs', async (req, res) => {
  const {
    query,
    location,
    page = 1,
    results_per_page = 10,
    category,
    min_salary,
    max_salary
  } = req.query;

  const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/${page}`;
  const params = {
    app_id: process.env.ADZUNA_APP_ID,
    app_key: process.env.ADZUNA_APP_KEY,
    what: query,
    where: location,
    results_per_page,
    ...(category && { category }),
    ...(min_salary && { salary_min: min_salary }),
    ...(max_salary && { salary_max: max_salary })
  };

  try {
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    console.error('🔴 Job Search Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from Adzuna' });
  }
});

// 📁 Categories
app.get('/api/categories', async (req, res) => {
  const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/categories`;
  const params = {
    app_id: process.env.ADZUNA_APP_ID,
    app_key: process.env.ADZUNA_APP_KEY
  };

  try {
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    console.error('🔴 Category Fetch Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 📍 Location Suggestions
app.get('/api/locations', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Missing location query' });
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/autosuggest`;
  const params = {
    app_id: process.env.ADZUNA_APP_ID,
    app_key: process.env.ADZUNA_APP_KEY,
    what: location
  };

  try {
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    console.error('🔴 Location Suggestion Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch location suggestions' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
