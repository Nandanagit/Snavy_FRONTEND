"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { Player } from "@remotion/player";
import { MyVideo } from "../../remotion/MyComp/Main";
import {
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";

interface Scene {
  id: number;
  title: string;
  content: string;
}

const GeneratedVideoPage = () => {
  const searchParams = useSearchParams();

  // Get domain from query
  const domainUrl = searchParams.get("domain") || "";

  // Parse scenes (sent as JSON string in query)
  const scenesParam = searchParams.get("scenes");
  let scenes: Scene[] = [];

  try {
    scenes = scenesParam ? JSON.parse(scenesParam) : [];
  } catch (err) {
    console.error("Invalid scenes data", err);
  }

  // ✅ Dummy fallback data if no scenes found
  if (scenes.length === 0) {
    scenes = [
      { id: 1, title: "Scene 1", content: "Intro scene with branding and tagline." },
      { id: 2, title: "Scene 2", content: "Showcase product features visually." },
      { id: 3, title: "Scene 3", content: "Closing scene with call-to-action." },
    ];
  }

  return (
    <div className="min-h-screen bg-[#020403] flex flex-col items-center">
      {/* Logo */}
      <div className="w-full max-w-7xl py-6 px-4">
        <h1 className="text-3xl font-signature text-violet-200">Snavy</h1>
      </div>

      {/* Content Card */}
      <div className="bg-violet-200 rounded-xl w-full max-w-8xl grid grid-cols-3 gap-6 p-10 border-50">
        {/* Left Panel */}
        <div className="col-span-1 space-y-6">
          {/* Domain */}
          <div>
            <h2 className="font-semibold mb-2">Domain</h2>
            <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] text-white p-3 rounded-lg">
              {domainUrl || "example.com"}
            </div>
          </div>

          {/* Scenes */}
          {scenes.map((scene) => (
            <div key={scene.id}>
              <h3 className="font-semibold mb-2">{scene.title}</h3>
              <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] text-white p-3 rounded-lg h-32 overflow-y-auto">
                {scene.content}
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="col-span-2 flex flex-col">
          <h2 className="font-semibold mb-2">Generated Video</h2>
          <div className="flex-1 bg-violet-950/70 backdrop-blur-md rounded-2xl shadow-8xl overflow-hidden border border-violet-900 flex items-center justify-center">
            <Player
              component={MyVideo}
              inputProps={defaultMyCompProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              className="w-full"
              controls
              autoPlay
              loop
            />
          </div>

          <div className="flex justify-end mt-4">
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedVideoPage;
