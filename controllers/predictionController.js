const axios = require('axios');

const predictFlood = async (req, res) => {
  const { rainfall, temperature, humidity } = req.body;

  try {
    const mlResponse = await axios.post(
      'https://floodapi-demo.onrender.com/predict',
      {
        rainfall,
        temperature,
        humidity,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log({
      rainfall,
      temperature,
      humidity
    });
    
    return res.status(200).json({
      success: true,
      prediction: mlResponse.data,
    });
  } catch (err) {
    console.error('ML service error:', err.response?.status, err.response?.data);
    res.status(500).json({ success: false, message: 'Prediction failed' });
  }
};

module.exports = { predictFlood };
