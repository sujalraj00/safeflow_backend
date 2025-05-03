const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const predictionRoutes = require('./routes/prediction');
const waterbodyRoutes = require('./routes/waterbodyRoutes')
const floodRoutes = require('./routes/floodRoutes');

dotenv.config();

const app = express();
// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    //credentials: true
  }));
app.use(express.json());

// Routes
// app.use('/api', predictionRoutes);
// app.use('/api', waterbodyRoutes);

app.use('/api', floodRoutes);


app.get('/', (req, res) => {
    res.send('Flood backend running');
  });
  

  const deviceRoutes = require('./routes/deviceRoutes');
  const alertRoutes = require('./routes/alertRoutes');
  
  app.use('/api/device', deviceRoutes);
  app.use('/api/alert', alertRoutes);  

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log( `Server running on port ${PORT}`));