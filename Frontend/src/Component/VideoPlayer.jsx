import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlayCircle } from "lucide-react";

const YT_KEYS = ["AIzaSyBsmqnBP9WZNUmjYt1rbGKr0qjFUL99cX0", 
                 "AIzaSyAd2p6nb8rxfeqDxSEof6fGj2ZHUBwfKIY", 
                 "AIzaSyAe3hVymhbj3NUMjUFBfw7N4nBGx4Ma0uk", 
                 "AIzaSyDa84Wm0BviEWd9cV7Uh70O04Y1JNT9hxs", 
                 "AIzaSyDE1OqnWoDDXZsbt6LmaOI8IBhX19yIFhc", 
                 "AIzaSyDZfWEljevWQiqJG1kpmK4J2IFPqFEbZmA",
                  "AIzaSyCCA30BSz1Qokn8bJy2WobQ6b-vOvx-BoA",
                   "AIzaSyCufmg0ySmwdy1z0YI3jq2Kfp_o6OFF8zQ", 
                   "AIzaSyA9EPGZNlNGLa-EAG3sjsXw8qkHBKbLFno", 
                   "AIzaSyCwfj45RGcF1a02GX_hXvM15TQTclRl7oA"];

let keyIndex = 0;
const getNextKey = () => {
  keyIndex = (keyIndex + 1) % YT_KEYS.length;
  return YT_KEYS[keyIndex];
};


const VideoPlayer = ({ topic, lessonId, onDurationFetched }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const searchQuery = `${topic} programming lecture tutorial`;
      const ytRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          maxResults: 1,       
          q: searchQuery,
          type: "video",
          key: getNextKey(),
          videoEmbeddable: true,
        },
      });

      if (ytRes.data.items.length === 0) {
        setVideos([]);
        return;
      }

      const topItem = ytRes.data.items[0];
      const videoId = topItem.id.videoId;

      const detailsRes = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "contentDetails",
          id: videoId,
          key: getNextKey(),
        },
      });

      const duration = detailsRes.data.items[0]?.contentDetails?.duration;

      if (duration && onDurationFetched) {
        onDurationFetched(duration);
      }

      setVideos([{
        videoId,
        title: topItem.snippet.title,
        source: "youtube",
      }]);

      setSelectedVideo({
        videoId,
        title: topItem.snippet.title,
        source: "youtube",
      });
    } catch (err) {
      console.error("Video fetch error:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic) fetchVideos();
  }, [topic]);

  const getEmbedUrl = (video) => {
    if (!video) return "";
    return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1`;
  };

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full text-white text-lg">
          Loading best lecture video...
        </div>
      ) : selectedVideo ? (
        <iframe
          className="w-full h-full"
          src={getEmbedUrl(selectedVideo)}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title="Lecture Video"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-lg">
          No suitable video found
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;