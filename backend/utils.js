// server/utils.js
function calculateEarnings(videoData) {
    const { subscriberCount, views, comments, likes } = videoData;
    return Math.min(subscriberCount, views) + 10 * comments + 5 * likes;
}

module.exports = { calculateEarnings };
