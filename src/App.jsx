import React, { useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition } from "./components/VideoComposition";
import { motion } from "framer-motion";
import { FaPlus, FaFileExport } from "react-icons/fa";

const App = () => {
  const [overlays, setOverlays] = useState([
    { text: "", time: 0, animation: "fadeIn", font: "Inter", color: "#ffffff" },
  ]);
  const [exporting, setExporting] = useState(false);

  const FPS = 30; // Define FPS here
  const DURATION = 300;
  const handleExport = async () => {
    setExporting(true);
    try {
      const renderedVideo = await renderMedia({
        composition: "VideoComposition",
        component: VideoComposition,
        fps: FPS,
        durationInFrames: DURATION,
        width: 720,
        height: 1280,
        outputLocation: `out/video-${Date.now()}.mp4`,
        inputProps: { overlays, fps: FPS },
      });
      console.log("Video rendered:", renderedVideo);
      // Here you would typically provide a download link or further processing
      alert("Video exported successfully! Check the console for details.");
    } catch (err) {
      console.error("Error exporting video:", err);
      alert("Error exporting video. Check the console for details.");
    } finally {
      setExporting(false);
    }
  };

  const handleAddOverlay = () => {
    setOverlays([
      ...overlays,
      {
        text: "",
        time: 0,
        animation: "fadeIn",
        font: "Inter",
        color: "#ffffff",
      },
    ]);
  };

  const handleOverlayChange = (index, field, value) => {
    const updatedOverlays = [...overlays];
    updatedOverlays[index][field] =
      field === "time" ? parseFloat(value) : value;
    setOverlays(updatedOverlays);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col items-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        EngagexAI Video Editor
      </motion.h1>

      <div className="w-full max-w-4xl mb-12">
        <Player
          component={VideoComposition}
          durationInFrames={300}
          fps={FPS}
          compositionWidth={720}
          compositionHeight={1280}
          controls
          inputProps={{ overlays, fps: FPS }}
          className="rounded-2xl shadow-2xl max-h-[80vh]"
        />
      </div>

      <div className="w-full max-w-2xl mb-12 bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-lg">
        {overlays.map((overlay, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-wrap items-center mb-4 space-x-2"
          >
            <input
              type="text"
              placeholder="Text"
              value={overlay.text}
              onChange={(e) =>
                handleOverlayChange(index, "text", e.target.value)
              }
              className="flex-grow p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 transition"
            />
            <input
              type="number"
              placeholder="Time (s)"
              value={overlay.time}
              onChange={(e) =>
                handleOverlayChange(index, "time", e.target.value)
              }
              className="w-24 p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 transition"
            />
            <select
              value={overlay.animation}
              onChange={(e) =>
                handleOverlayChange(index, "animation", e.target.value)
              }
              className="p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value="fadeIn">Fade In</option>
              <option value="slideIn">Slide In</option>
              <option value="zoomIn">Zoom In</option>
              <option value="bounce">Bounce</option>
            </select>
            <select
              value={overlay.font}
              onChange={(e) =>
                handleOverlayChange(index, "font", e.target.value)
              }
              className="p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
            <input
              type="color"
              value={overlay.color}
              onChange={(e) =>
                handleOverlayChange(index, "color", e.target.value)
              }
              className="w-12 h-12 rounded-lg cursor-pointer"
            />
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddOverlay}
          className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center space-x-2"
        >
          <FaPlus />
          <span>Add Overlay</span>
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExport}
        disabled={exporting}
        className={`p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg hover:from-green-500 hover:to-blue-600 transition flex items-center space-x-2 ${
          exporting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FaFileExport />
        <span>{exporting ? "Exporting..." : "Export Video"}</span>
      </motion.button>
    </div>
  );
};

export default App;
