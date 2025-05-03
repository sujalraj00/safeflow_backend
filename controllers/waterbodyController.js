const waterBodies = require('../data/waterbodies.json');

function toRadians(deg) {
  return deg * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getNearbyWaterBodies = (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  const nearby = waterBodies
    .map(wb => {
      const distance = haversineDistance(latitude, longitude, wb.latitude, wb.longitude);
      return {
        name: wb.name,
        type: wb.type,
        distance: parseFloat(distance.toFixed(2))
      };
    })
    .filter(wb => wb.distance <= 100); // Only include within 100 km

  res.json({ success: true, nearby });
};

module.exports = { getNearbyWaterBodies };
