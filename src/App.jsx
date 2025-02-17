import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import Transcript from "./components/Transcript";
import ChatBot from "./components/ChatBot";
import Canvas from "./components/Canvas";
import "./App.css";

const App = () => {
  return (
    <div>
    <div className="heading">AI MATH TUTOR</div>
    <div className="container">
      <div className="left-panel">
        <ChatBot />
      </div>
      <div className="right-panel">
        <div className="video-transcript">
        <VideoPlayer />
        <Transcript />
        </div>
        <div className="canvas-tool">
        <Canvas />
        </div>
      </div>
    </div>
    </div>
  );
};

export default App;
