// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [link, setLink] = useState('');
    const [videos, setVideos] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/videos', { link });
        setLink('');
        fetchData();
    };

    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1>Video Engagement Analysis</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter Video Link:
                    <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                </label>
                <button type="submit">Analyze</button>
            </form>
            <ul>
                {videos.map((video, index) => (
                    <li key={index}>
                        <p>Link: {video.link}</p>
                        <p>Earnings: ${video.earnings}</p>
                        {/* Display other metrics as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
