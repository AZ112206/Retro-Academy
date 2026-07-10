const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using the stable Gemini 1.5 Flash model (ideal for quick, free-tier text generation)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

/**
 * Calls the Gemini AI to generate a highly detailed, unique student roster.
 * @param {number} count - How many students to generate
 */
export const fetchAIStudentRoster = async (count = 5) => {
  if (!API_KEY) {
    console.error("API Key is missing! Check your .env.local file.");
    return [];
  }

  // We explicitly guide the AI on how to build the data and formatting rules
  const prompt = `
    Generate a JSON array containing exactly ${count} unique, fictional school students for a retro simulator game.
    Each student object must strictly follow this exact JSON structure:
    {
      "name": "Full Name",
      "trait": "One word archetype like Overachiever, Class Clown, Slacker, Rebel, Anxious Prodigy, or Average Joe",
      "bio": "A creative, humorous 2-sentence background story describing their campus reputation, secret habits, or academic motivations.",
      "grades": A random integer between 40 and 100 fitting their archetype,
      "behavior": A random integer between 20 and 100 fitting their archetype,
      "attendance": A random integer between 60 and 100,
      "appearance": {
        "hairStyle": "Must be exactly one of: Messy Bedhead, Neat Side-Part, Buzzcut, Long Waves, High Ponytail, Curly Afro, Spiky Retro Gel, Curtain Bangs",
        "hairColor": "Must be exactly one of: Neon Pink, Jet Black, Bleach Blonde, Auburn, Emerald Green, Chestnut Brown, Silver-Grey",
        "clothing": "Must be exactly one of: Oversized Vintage Hoodie, Thrifted Corduroy Jacket, Preppy Blazer & Tie, Graphic Band Tee, Denim Vest with Patches, Plain Turtleneck Sweater",
        "accessory": "Must be exactly one of: Thick Rimmed Glasses, Wireless Headphones Hanging on Neck, Beanie Pulled Low, Dangle Earrings, Stack of Friendship Bracelets, None",
        "expression": "Must be exactly one of: Slightly Bored, Laser Focused, Daydreaming Out the Window, Smug Smirk, Nervous Sweat-Drop, Yawning"
      }
    }
    Respond ONLY with the raw JSON array. Do not include markdown blocks like \`\`\`json or any conversational text.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // Extract the text response from the Gemini JSON envelope
    const rawText = data.candidates[0].content.parts[0].text.trim();
    
    // Parse the clean text directly into a JavaScript array
    const studentRoster = JSON.parse(rawText);
    
    // Inject a frontend unique ID for React lists
    return studentRoster.map(student => ({
      ...student,
      id: crypto.randomUUID()
    }));

  } catch (error) {
    console.error("Error generating AI roster:", error);
    return []; // Return empty array as fallback if API fails or throttles
  }
};