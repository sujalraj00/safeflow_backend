// require('dotenv').config();
// const { GoogleGenAI } = require('@google/genai');

// async function getNearbyWaterBodiesFromGemini(latitude, longitude) {
//   const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//   });

//   const model = 'gemini-1.5-flash';
//   const config = {
//     responseMimeType: 'text/plain',
//     systemInstruction: [
//       {
//         text: `Please provide information about nearby rivers and lakes in JSON format exactly following this structure:

// {
//   "rivers": [
//     {
//       "name": "string",
//       "distance": "string",
//       "coordinates": {
//         "latitude": number,
//         "longitude": number
//       },
//       "description": "string",
//       "nearbyLandmarks": ["string"]
//     }
//   ],
//   "lakes": [
//     {
//       "name": "string",
//       "distance": "string",
//       "coordinates": {
//         "latitude": number,
//         "longitude": number
//       },
//       "description": "string",
//       "nearbyLandmarks": ["string"]
//     }
//   ]
// }

// For coordinates 28.6692° N, 77.4538° E in South Delhi, provide:
// - All rivers within 30km radius
// - All lakes within 30km radius
// - Distance should be approximate range
// - Include coordinates of each water body
// - Include notable nearby landmarks
// - If no lakes are found, return empty array`,
//       },
//     ],
//   };

//   const contents = [
//     {
//       role: 'user',
//       parts: [{ text: 'river and lakes near to 28.6692° N, 77.4538° E' }],
//     },
//     {
//       role: 'model',
//       parts: [
//         {
//           text: `\`\`\`json
// {
//   "rivers": [
//     {
//       "name": "Yamuna River",
//       "distance": "10-15 km",
//       "coordinates": {
//         "latitude": 28.6100,
//         "longitude": 77.2300 
//       },
//       "description": "The Yamuna is one of the major rivers of India and a tributary of the Ganges.",
//       "nearbyLandmarks": ["Akshardham Temple", "India Gate"]
//     }
//   ],
//   "lakes": []
// }
// \`\`\``,
//         },
//       ],
//     },
//     {
//       role: 'user',
//       parts: [{ text: `rivers and lakes near ${latitude}° N, ${longitude}° E within 50 km radius`}],
//     },
//   ];

//   const stream = await ai.models.generateContentStream({
//     model,
//     config,
//     contents,
//   });

//   let result = '';
//   for await (const chunk of stream) {
//     if (chunk.text) result += chunk.text;
//   }

//   return result;
// }

// module.exports = { getNearbyWaterBodiesFromGemini };



require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function getNearbyWaterBodiesFromGemini(latitude, longitude) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = 'gemini-1.5-flash';
  const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `Please provide information about nearby rivers and lakes in JSON format exactly following this structure:

{
  "rivers": [
    {
      "name": "string",
      "distance": "string",
      "coordinates": {
        "latitude": number,
        "longitude": number
      },
      "description": "string",
      "nearbyLandmarks": ["string"]
    }
  ],
  "lakes": [
    {
      "name": "string",
      "distance": "string",
      "coordinates": {
        "latitude": number,
        "longitude": number
      },
      "description": "string",
      "nearbyLandmarks": ["string"]
    }
  ]
}

For coordinates 28.6692° N, 77.4538° E in South Delhi, provide:
- All rivers within 30km radius
- All lakes within 30km radius
- Distance should be approximate range
- Include coordinates of each water body
- Include notable nearby landmarks
- If no lakes are found, return empty array`,
      },
    ],
  };

  const contents = [
    {
      role: 'user',
      parts: [{ text: 'river and lakes near to 28.6692° N, 77.4538° E' }],
    },
    {
      role: 'model',
      parts: [
        {
          text: `\`\`\`json
{
  "rivers": [
    {
      "name": "Yamuna River",
      "distance": "10-15 km",
      "coordinates": {
        "latitude": 28.6100,
        "longitude": 77.2300 
      },
      "description": "The Yamuna is one of the major rivers of India and a tributary of the Ganges.",
      "nearbyLandmarks": ["Akshardham Temple", "India Gate"]
    }
  ],
  "lakes": []
}
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [{ text: `rivers and lakes near ${latitude}° N, ${longitude}° E within 50 km radius`}],
    },
  ];

  const stream = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let result = '';
  for await (const chunk of stream) {
    if (chunk.text) result += chunk.text;
  }

  // ✅ Extract JSON from markdown and parse it
  const jsonMatch = result.match(/```json([\s\S]*?)```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch (e) {
      console.error("Failed to parse Gemini response JSON:", e.message);
      throw new Error("Invalid JSON from Gemini");
    }
  } else {
    console.error("No JSON found in Gemini response");
    throw new Error("Malformed Gemini response");
  }
}

module.exports = { getNearbyWaterBodiesFromGemini };
