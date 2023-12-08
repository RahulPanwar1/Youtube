// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { calculateEarnings } = require('./utils');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/videos', { useNewUrlParser: true, useUnifiedTopology: true });

const videoSchema = new mongoose.Schema({
    link: String,
    subscriberCount: Number,
    views: Number,
    comments: Number,
    likes: Number,
    earnings: Number
});

const Video = mongoose.model('Video', videoSchema);

// Routes

// Endpoint to fetch top-earning videos
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ earnings: -1 }).limit(10);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to add a new video
app.post('/api/videos', async (req, res) => {
    try {
        const { link } = req.body;

        // Fetch video data from YouTube API
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${link}&key=YOUR_YOUTUBE_API_KEY`);
        const videoData = response.data.items[0].statistics;

        // Calculate earnings
        const earnings = calculateEarnings(videoData);

        // Save video data to MongoDB
        const newVideo = new Video({
            link,
            subscriberCount: videoData.subscriberCount,
            views: videoData.views,
            comments: videoData.comments,
            likes: videoData.likes,
            earnings
        });
        await newVideo.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
