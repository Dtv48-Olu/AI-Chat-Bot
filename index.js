const OpenAI = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const token = process.env.TOKEN;

// Create OpenAI instance with OpenRouter configuration
const openai = new OpenAI({
  apiKey: token,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL, // Add this to your .env file
    "X-Title": process.env.YOUR_APP_NAME, // Add this to your .env file
  },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/message", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "liquid/lfm-40b:free", // Updated to match provided SDK model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: req.body.prompt,
            },
            // If an image URL is provided in the request
            ...(req.body.imageUrl
              ? [
                  {
                    type: "image_url",
                    image_url: {
                      url: req.body.imageUrl,
                    },
                  },
                ]
              : []),
          ],
        },
      ],
    });

    res.json({
      message: completion.choices[0].message,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
