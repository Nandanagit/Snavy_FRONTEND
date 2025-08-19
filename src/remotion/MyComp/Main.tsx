import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {Img,Audio} from 'remotion';
import React, { useEffect, useState } from "react";
import GetSubtitles from "../../components/get-subtitles";

type Subtitle = { start: number; end: number; text: string };

export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const data = await GetSubtitles();
        setSubtitles(data);
        
      } catch (err) {
        console.error("Failed to fetch subtitles:", err);
      }
    };
  
    fetchSubtitles();
  }, []);

  useEffect(() => {
    if (subtitles.length === 0) return;
  
    const currentTimeMs = (frame / fps) * 1000;
    console.log("subtitle:",subtitles)
    const activeSub = subtitles.find(
      (sub) => currentTimeMs >= sub.start && currentTimeMs < sub.end
    );
  
    setCurrentSubtitle(activeSub || null);
  }, [frame, subtitles]);

 
  return (
    <AbsoluteFill>
      <Audio src="http://localhost:4001/audio/audioo.mp3" />
      <Img src={`http://localhost:4001/images/image_2.png`}  width={1080} height={1920} />
      <Img src={`http://localhost:4001/images/image_2.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_3.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_4.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_5.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_6.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_7.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_8.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_9.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>
      <Img src={`http://localhost:4001/images/image_10.png`}  width={1080} height={1920} style={{ objectFit: 'contain' }}/>

      {currentSubtitle && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
            zIndex: 10,
            display: "flex",
          }}
        >
          <div
            style={{
              fontSize: 50,
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "0.4em 1em",
              borderRadius: 12,
              textAlign: "center",
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
              maxWidth: "80%",
              lineHeight: 1.4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            {currentSubtitle.text}
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
