const axios = require('axios');

function parseLiveRatesData(rawData) {
  // Split the raw data by newlines
  const lines = rawData.split('\n');

  // Create an array to hold the parsed data
  const parsedData = [];

  // Loop through each line
  lines.forEach(line => {
    // Skip empty lines or lines that don't have enough data
    if (line.trim() === '' || line.split(/\s+/).length < 2) return;

    // Split by spaces or tabs (whitespace)
    const parts = line.trim().split(/\s+/);

    // Map the parts to an object (example structure, modify as needed)
    const data = {
      code: parts[0], // First column (e.g., "2927")
      item: parts[1], // Second column (e.g., "GOLD($)")
      prices: {
        buy: parts[2],   // Third column (buy price)
        sell: parts[3],  // Fourth column (sell price)
        high: parts[4],  // Fifth column (high price)
        low: parts[5]    // Sixth column (low price)
      }
    };

    parsedData.push(data);
  });

  return parsedData;
}

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins
app.use(cors());
const port = 5000;

app.get('/api/getLiveRates', async (req, res) => {
  try {
    // Fetch raw data from the API
    const response = await axios.get('http://bcast.surabibullion.net:7767/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/surabi');

    // Log the raw response
    console.log('Raw Data:', response.data);

    // Process the raw data to convert it into JSON
    const liveRates = parseLiveRatesData(response.data);

    // Log the processed JSON data
    console.log('Parsed JSON Data:', liveRates);

    // Send the parsed data as the response
    res.json(liveRates);
  } catch (error) {
    console.error('Error fetching live rates:', error);
    res.status(500).send('Error fetching live rates');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
