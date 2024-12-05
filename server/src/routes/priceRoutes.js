//server/src/routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/simple/price', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    console.error('CoinGecko API error:', error);
    // Return dummy data as fallback
    const dummyResponse = {};
    const ids = (req.query.ids || '').split(',');
    ids.forEach(id => {
      dummyResponse[id] = {
        usd: 0,
        usd_24h_change: -1,
        usd_market_cap: 0
      };
    });
    res.json(dummyResponse);
  }
});

module.exports = router;