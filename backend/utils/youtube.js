import axios from "axios";

export async function fetchYouTubeVideos(query) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        key: API_KEY,
        maxResults: 3,
        type: "video",
      },
    });

    return response.data.items.map((v) => ({
      title: v.snippet.title,
      url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
      thumbnail: v.snippet.thumbnails.default.url,
    }));
  } catch (error) {
    console.error("❌ YouTube Fetch Error:", error.response?.data || error.message);
    return [];
  }
}
