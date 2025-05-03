

// Mock function - replace with AI/Gemini integration
// const getNearbyWaterBodies = async (lat, lon) => {
//   return {
//     rivers: [
//       {
//         name: "Yamuna River",
//         distance: "5-7 km",
//         direction: "west",
//         notes: "Major river; flows through Delhi.",
//         coordinates: { lat: 28.61, lon: 77.23 }
//       },
//       {
//         name: "Hindon River",
//         distance: "25-30 km",
//         direction: "east",
//         notes: "Tributary of the Yamuna River; flows through Noida and Ghaziabad.",
//         coordinates: { lat: 28.67, lon: 77.45 }
//       }
//     ]
//   };
// };

const { aiResponse } = require('../utils/airesponse.js');
const axios = require('axios');
const { getNearbyWaterBodiesFromGemini } = require('../utils/getNearbyWaterBodiesFromGemini');




// Fetch weather from OpenWeatherMap
const getWeatherData = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  //const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const { data } = await axios.get(url);

  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
  };
};

// send to ml model for rainfall prediction
const predictRainfall = async (lat, lon) => {
  console.log('ML Rainfall API:', process.env.RAINFALL_ML_MODEL_URL);
  const rainfallUrl = process.env.RAINFALL_ML_MODEL_URL || "https://rainfall-pred-1.onrender.com/predict" ;
  try {
    const { data } = await axios.post(rainfallUrl, { 
      Latitude: lat,
      Longitude: lon
    }, {
      timeout: 8000
    });

    console.log("Rainfall ML API response:", data);

    if (!data.prediction) {
      throw new Error("Missing 'predictedRainfall' in response");
    }

    return data.prediction;
  } catch (error) {
    console.error('Rainfall prediction error:', error.message);
    throw new Error('Failed to predict rainfall');
  }
};



// Send weather to ML model for flood prediction
const sendToMLModel = async (rainfall, temperature, humidity) => {
  const mlUrl = process.env.ML_API_URL;

  // Log the data to confirm it's correctly formatted
  console.log("Sending to Flood ML model:", { Rainfall: rainfall, Temperature: temperature, Humidity: humidity });

  try {
    const { data } = await axios.post(mlUrl, {
      Rainfall: rainfall,     // Make sure the casing matches exactly with Postman
      Temperature: temperature,
      Humidity: humidity
    });

    console.log("Flood Prediction API response:", data);
    return data;
  } catch (error) {
    console.error("Flood ML model error response:", error.response?.data || error.message);
    throw new Error("Flood prediction failed");
  }
};


// Controller method
exports.analyzeFloodRisk = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Step 1: Get nearby rivers using Gemini API
   const waterBodies = await getNearbyWaterBodiesFromGemini(latitude, longitude);
   console.log("Water bodies from Gemini:", waterBodies);

   if (!waterBodies || !Array.isArray(waterBodies.rivers)) {
    throw new Error('Invalid Gemini response format: ' + JSON.stringify(waterBodies));
  }
  

   //const waterBodies = await aiResponse(latitude, longitude);

   console.log("Calling Rainfall Prediction API...");
 // Step 2: Predict rainfall for the original location
 const rainfall = await predictRainfall(latitude, longitude);
 console.log("Predicted rainfall:", rainfall);

    // Step : For each river, fetch weather and run flood risk prediction
    // const riversWithAnalysis = await Promise.all(
    //   waterBodies.rivers.map(async (river) => {
    //    // const { lat, lon } = river.coordinates;

    //     // console.log("Sending to Flood ML model:", {
    //     //   rainfall,
    //     //   temperature: weather.temperature,
    //     //   humidity: weather.humidity
    //     // });
        
    //     const weather = await getWeatherData(latitude, longtitude);
    //     const floodPrediction = await sendToMLModel(rainfall, weather.temperature, weather.humidity);

    //     return {
    //       ...river,
    //       weather,
    //       floodPrediction
    //     };
    //   })
    // );


    const riversWithAnalysis = await Promise.all(
      waterBodies.rivers.map(async (river) => {
        const coordinates = river.coordinates;
        console.log('River coordinates:', coordinates); // Log the coordinates
    
        const lat = coordinates.latitude;
        const lon = coordinates.longitude;
    
        // Ensure lat and lon are defined
        if (!lat || !lon) {
          console.error('Invalid coordinates for river:', river.name, 'Latitude:', lat, 'Longitude:', lon);
          return { ...river, weather: null, floodPrediction: null };
        }
    
        // Ensure weather is fetched correctly
        let weather;
        try {
          weather = await getWeatherData(lat, lon);
        } catch (error) {
          console.error('Error fetching weather for river:', river.name, error.message);
          return { ...river, weather: null, floodPrediction: null };
        }
    
        const floodPrediction = await sendToMLModel(rainfall, weather.temperature, weather.humidity);
    
        return {
          ...river,
          weather,
          floodPrediction
        };
      })
    );
    

   
   // Step 3: Send to frontend in proper format
    res.json({ rivers: riversWithAnalysis });

// // Final Response
// res.json({
//     status: 'success',
//     originalLocation: {
//       coordinates: { latitude, longitude },
//       predictedRainfall: rainfall,
//       weather: {
//         temperature: weather.temperature,
//         humidity: weather.humidity
//       },
//       floodPrediction
//     },
//     nearbyRivers: riversWithAnalysis,
//     timestamp: new Date().toISOString()
//   });

  } catch (error) {
    console.error('Flood analysis error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
