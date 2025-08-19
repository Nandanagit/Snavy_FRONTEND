"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { MyVideo } from "../../remotion/MyComp/Main";

export default function HomePage() {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      {!showPlayer ? (
        <button
          onClick={() => setShowPlayer(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg"
        >
          Generate
        </button>
      ) : (
        <Player
          component={MyVideo}
          inputProps={{ title: "Generated via Button!" }}
          durationInFrames={150}
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          controls
        />
      )}
    </main>
  );
}
