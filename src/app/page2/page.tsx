// "use client";

// import { Player } from "@remotion/player";
// import type { NextPage } from "next";
// import React from "react";
// import { MyVideo } from "../../remotion/MyComp/Main";
// import {
//   defaultMyCompProps,
//   DURATION_IN_FRAMES,
//   VIDEO_FPS,
//   VIDEO_HEIGHT,
//   VIDEO_WIDTH,
// } from "../../types/constants";

// const container: React.CSSProperties = {
//   maxWidth: 768,
//   margin: "auto",
//   marginBottom: 20,
// };

// const outer: React.CSSProperties = {
//   borderRadius: "var(--geist-border-radius)",
//   overflow: "hidden",
//   boxShadow: "0 0 200px rgba(0, 0, 0, 0.15)",
//   marginBottom: 40,
//   marginTop: 60,
// };

// const player: React.CSSProperties = {
//   width: "100%",
// };

// const Home: NextPage = () => {
//   return (
//     <div>
//       <div style={container}>
//         <div className="cinematics" style={outer}>
//           <Player
//             component={MyVideo}
//             inputProps={defaultMyCompProps}
//             durationInFrames={DURATION_IN_FRAMES}
//             fps={VIDEO_FPS}
//             compositionHeight={VIDEO_HEIGHT}
//             compositionWidth={VIDEO_WIDTH}
//             style={player}
//             controls
//             autoPlay
//             loop
//           />
//       </div>
//       </div>
//     </div>
  
// );
// };
// export default Home;
"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React from "react";
import { MyVideo } from "../../remotion/MyComp/Main";
import {
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-violet-80 to-violet-90 p-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold text-white mb-9">
          Preview Your Video
        </h1>

        {/* Video Player Card */}
        <div className="bg-violet-950/70 backdrop-blur-md rounded-2xl shadow-8xl overflow-hidden border border-violet-900">
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

        {/* Footer */}
        <p className="text-center text-sm text-violet-900 mt-6">
          Powered by <span className="font-semibold text-violet-200">Snavy</span> ⚡
        </p>
      </div>
    </div>
  );
};

export default Home;
