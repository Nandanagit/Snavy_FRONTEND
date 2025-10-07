import {
  AbsoluteFill,
  Sequence,
  Video,
  Audio,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { interpolate } from "remotion";
import React, { useEffect, useState } from "react";

// Local type for subtitle words
type Word = {
  start: number;
  end: number;
  word: string;
};

const videoClips = [
  "http://localhost:4000/video/video_string_1756882243498_0_0.mp4",
  "http://localhost:4000/video_string_1756882289908_1_0.mp4",
  "http://localhost:4000/video/video_string_1756882336055_2_0.mp4",
  "http://localhost:4000/video/video_string_1756882372688_3_0.mp4",
];

const AUDIO_DURATION_SECONDS = 15;
const VIDEO_FPS = 30;
const TOTAL_FRAMES = AUDIO_DURATION_SECONDS * VIDEO_FPS;
const FADE_DURATION = 15;

export const VideoAd: React.FC = () => {
  // Subtitles: array per clip, each is an array of Word
  const [subtitles, setSubtitles] = useState<Word[][]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);
  const [subsError, setSubsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      process.env.NEXT_PUBLIC_SUBTITLES_URL || "http://localhost:6001/fetch-subtitles";

    const load = async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Expecting Word[][]; attempt a minimal runtime shape check
        const safe: Word[][] = Array.isArray(data)
          ? data.map((arr: any) =>
              Array.isArray(arr)
                ? arr
                    .filter((w: any) =>
                      w && typeof w.start === "number" && typeof w.end === "number" && typeof w.word === "string"
                    )
                    .map((w: any) => ({ start: w.start, end: w.end, word: w.word }))
                : []
            )
          : [];
        if (!cancelled) setSubtitles(safe);
      } catch (e: any) {
        if (!cancelled) setSubsError(e?.message ?? "Failed to fetch subtitles");
      } finally {
        if (!cancelled) setLoadingSubs(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <Audio src={staticFile("bev_ad.wav")} />

      {videoClips.map((clip, i) => {
        const baseDuration = Math.floor(TOTAL_FRAMES / videoClips.length);
        const isLast = i === videoClips.length - 1;
        const duration = isLast
          ? TOTAL_FRAMES - baseDuration * (videoClips.length - 1)
          : baseDuration;
        const from = i * baseDuration;

        return (
          <Sequence key={clip} from={from} durationInFrames={duration}>
            <FadeVideo
              src={clip}
              fadeIn={FADE_DURATION}
              fadeOut={FADE_DURATION}
              totalFrames={duration}
            />
            <WordCaptions words={subtitles[i] ?? []} />
          </Sequence>
        );
      })}
      {subsError && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "6px 10px",
            background: "rgba(255,0,0,0.6)",
            color: "#fff",
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {`Subtitles error: ${subsError}`}
        </div>
      )}
    </AbsoluteFill>
  );
};

const FadeVideo: React.FC<{
  src: string;
  fadeIn: number;
  fadeOut: number;
  totalFrames: number;
}> = ({ src, fadeIn, fadeOut, totalFrames }) => {
  const frame = useCurrentFrame();
  const opacity =
    frame < fadeIn
      ? interpolate(frame, [0, fadeIn], [0, 1])
      : frame > totalFrames - fadeOut
      ? interpolate(frame, [totalFrames - fadeOut, totalFrames], [1, 0])
      : 1;

  return (
    <Video
      src={src}
      style={{
        width: 1080,
        height: 1920,
        objectFit: "cover",
        opacity,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

const WordCaptions: React.FC<{ words: Word[]; }> = ({ words }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const time = (frame ) / fps;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 950,
        textAlign: "center",
        fontSize: 70,
        fontWeight: 700,
        color: "#fff",
        textShadow: "0 2px 10px #000, 0 0 20px #000",
        fontFamily: "Arial, Helvetica, sans-serif",
        transition: "opacity 0.5s",
        overflow: "hidden",
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: 1.15,
        padding: "12px 0",
        boxSizing: "border-box",
        zIndex: 10,
        borderRadius: 20,
        background: "rgba(0,0,0,0.01)",
      }}
    >
      {words.map((w, i) => {
        const isActive = time >= w.start && time <= w.end;
        return (
          <span
            key={i}
            style={{
              padding: isActive ? "12px 20px" : "0px 8px",
              backgroundColor: isActive
                ? "rgba(243,235,235,0.6)"
                : "transparent",
              borderRadius: isActive ? "16px" : "0px",
              margin: "0 6px",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              verticalAlign: "middle",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
            }}>{w.word}</span>
          </span>
        );
      })}
    </div>
  );
};
