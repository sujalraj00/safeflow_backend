const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io'); // ✅ Correct import

// Import routes
const predictionRoutes = require('./routes/prediction');
const waterbodyRoutes = require('./routes/waterbodyRoutes');
const floodRoutes = require('./routes/floodRoutes');
const sosRoutes = require('./routes/sosRoutes');
//const tokenRoutes = require('./routes/TokenRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const alertRoutes = require('./routes/alertRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Enable CORS for all REST API routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api', floodRoutes);
//app.use('/api', tokenRoutes);
app.use('/api', sosRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/alert', alertRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send('🌊 Flood backend running');
});

// Store connected clients
let activeUsers = [];

// ✅ Socket.IO logic
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  activeUsers.push(socket);

  socket.on('sendSOS', () => {
    console.log('🚨 SOS Alert triggered');
    activeUsers.forEach(user => {
      user.emit('alert', '🚨 Emergency: Flood risk detected!');
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    activeUsers = activeUsers.filter(user => user !== socket);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
