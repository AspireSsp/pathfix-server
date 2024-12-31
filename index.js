const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// API credentials from .env file
const API_URL = process.env.API_URL;
const USER_ID = process.env.USER_ID;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PFX_NONCE = process.env.PFX_NONCE;

// Endpoint to call the Pathfix API
app.post('/tweet', async (req, res) => {
    const tweetText = req.body.text; // Get tweet text from the request body

    if (!tweetText) {
        return res.status(400).json({ message: 'Tweet text is required' });
    }

    try {
        const url = `${API_URL}?user_id=${USER_ID}&public_key=${PUBLIC_KEY}&pfx_nonce=${PFX_NONCE}`
        console.log("url---->",url);
        
        const response = await axios.post(url,
            {
                url: 'https://api.twitter.com/2/tweets',
                method: 'POST',
                payload: {
                    text: tweetText,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({ message: 'Tweet posted successfully!', data: response.data });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: 'Error posting the tweet',
            error: error.response?.data || error.message,
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
