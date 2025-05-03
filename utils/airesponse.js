const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get water bodies near specified coordinates
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {number} [radiusKm=30] - Search radius in kilometers (default: 30km)
 * @returns {Promise<Object>} - Object containing rivers and lakes data
 */
async function aiResponse(latitude, longitude) {
  try {
    // Validate coordinates
    if (!latitude || !longitude) {
      throw new Error("Latitude and longitude are required");
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error("Invalid coordinates");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Return ONLY a JSON object with rivers and lakes near ${latitude}° N, ${longitude}° E within 50 km radius using this exact format:
    {
      "rivers": [{
        "name": "",
        "distance": "",
        "coordinates": {"latitude": 0, "longitude": 0},
        "description": "",
        "nearbyLandmarks": []
      }],
      "lakes": []
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    // Extract and parse the response
    const response = await result.response;
    const jsonString = response.candidates[0].content.parts[0].text;
    const waterBodies = JSON.parse(jsonString);

    // Add the original coordinates to the response
    return {
      ...waterBodies,
      searchCoordinates: { latitude, longitude },
      searchRadiusKm: radiusKm
    };

  } catch (error) {
    console.error("Error in getWaterBodies:", error.message);
    throw error;
  }
}


module.exports = { aiResponse };