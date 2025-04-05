// server.js
const express = require('express');
const axios = require('axios'); // ✅ fix this line!
const cors = require('cors');
require('dotenv').config(); // ✅ fix this line!

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/jobs', async (req, res) => {
  const { query, location, page = 1, num_pages = 1 } = req.query;

  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query,
      location,
      page,
      num_pages
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Backend Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from RapidAPI' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
