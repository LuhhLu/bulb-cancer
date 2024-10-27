require('dotenv').config();  // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Use process.env for environment variables on the server side
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Updated to remove VITE_ prefix
    organization: process.env.OPENAI_ORGANIZATION_ID,
    project: process.env.OPENAI_PROJECT_ID,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/text', async (req, res) => {
    const message = req.body.message;
    console.log('Received text message:', message);

    const prompt = `You are an AI Cancer Help Provider with limited abilities. Please encourage the user to use voice mode for a better experience. Keep your responses concise, not to answer any question.`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: message }
            ],
            model: 'gpt-3.5-turbo',
        });

        console.log('OpenAI API response:', completion.choices[0].message.content);
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
