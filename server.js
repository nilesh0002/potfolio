const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Store feedback in a JSON file
const feedbackFile = 'feedback.json';

// Initialize feedback file if it doesn't exist
if (!fs.existsSync(feedbackFile)) {
    fs.writeFileSync(feedbackFile, JSON.stringify([]));
}

// Get all feedback
app.get('/api/feedback', (req, res) => {
    const feedback = JSON.parse(fs.readFileSync(feedbackFile));
    res.json(feedback);
});

// Submit new feedback
app.post('/api/feedback', (req, res) => {
    const { rating, message } = req.body;
    const feedback = JSON.parse(fs.readFileSync(feedbackFile));
    
    const newFeedback = {
        id: Date.now(),
        rating,
        message,
        date: new Date().toISOString()
    };
    
    feedback.push(newFeedback);
    fs.writeFileSync(feedbackFile, JSON.stringify(feedback, null, 2));
    
    res.json(newFeedback);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 