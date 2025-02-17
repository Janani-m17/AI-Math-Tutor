import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "../App.css";

const VideoPlayer = () => {
    const [videoUrl, setVideoUrl] = useState("https://youtu.be/naz_9njI0I0?feature=shared");
  return (
    <div className="video-player">
        <ReactPlayer url={videoUrl} width="100%" height="100%" controls />
    </div>
  );
};

export default VideoPlayer;
