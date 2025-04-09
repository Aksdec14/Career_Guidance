const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const COUNTRY = 'us';

// ✅ PostgreSQL pool setup
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
});

// ✅ Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// ✅ Create users table
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log('✅ Users table ready');
  } catch (err) {
    console.error('❌ Error creating table:', err);
  }
};
createTable();

// ✅ Signup route
app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  console.log('Signup attempt:', username);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
    res.status(201).send('Sign up successful!');
  } catch (err) {
    console.error('❌ Signup error:', err);
    if (err.code === '23505') {
      res.status(400).send('Username already exists');
    } else {
      res.status(500).send('Server error');
    }
  }
});

// ✅ Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).send('Login successful!');
    } else {
      res.status(401).send('Incorrect password');
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).send('Server error');
  }
});

// ✅ Adzuna Job Search API
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

// ✅ Job Categories
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

// ✅ Location Suggestions
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

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
