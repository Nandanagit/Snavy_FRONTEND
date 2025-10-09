"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Player } from "@remotion/player";
import { MyVideo } from "../../../remotion/MyComp/Main";
import {
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../types/constants";

interface Scene {
  id: number;
  title: string;
  content: string;
}

const GeneratedVideoPage = () => {
  const searchParams = useSearchParams();
  const domainUrl = searchParams.get("url");


  // Fetch scenes from backend
  const [scenes, setScenes] = React.useState<Scene[]>([]);
  const [loadingScenes, setLoadingScenes] = React.useState(true);
  const [scenesError, setScenesError] = React.useState<string|null>(null);

  React.useEffect(() => {
    console.log("useEffect running");
    console.log("domainUrl",domainUrl);
    const fetchScenes = async () => {
      setLoadingScenes(true);
      setScenesError(null);
      
      try {
        console.log("domainUrl",domainUrl)
        const response = await fetch(`http://localhost:6001/mongo/scenes?domain=${encodeURIComponent(domainUrl)}`);
        console.log("hii",response)
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const scenes = await response.json();
        console.log("hiii",scenes)
        if (Array.isArray(scenes)) {
          setScenes(scenes);
        } else {
          setScenes([]);
        }
      } catch (e: any) {
        setScenesError(e?.message || 'Failed to fetch scenes');
        setScenes([]);
      } finally {
        setLoadingScenes(false);
      }
    };
    if (domainUrl) fetchScenes();
    else setLoadingScenes(false);
  }, [domainUrl]);


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
