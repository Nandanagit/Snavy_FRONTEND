import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Img, Audio} from 'remotion';
import React, { useEffect, useState } from "react";
import GetSubtitles from "../../components/get-subtitles";
import GetImages from "../../components/get-images";

type Subtitle = { start: number; end: number; text: string };

export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [images, setImages] = useState<{url: string, start: number, end: number}[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');

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
    const activeSub = subtitles.find(
      (sub) => currentTimeMs >= sub.start && currentTimeMs < sub.end
    );

    setCurrentSubtitle(activeSub || null);
  }, [frame, subtitles]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageUrls = await GetImages();
        // Assign time ranges to each image (e.g., each image gets 5 seconds)
        const imageDuration = 5000; // 5 seconds per image in milliseconds
        const imagesWithTime = imageUrls.map((url: string, index: number) => ({
          url,
          start: index * imageDuration,
          end: (index + 1) * imageDuration
        }));
        setImages(imagesWithTime);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const currentTimeMs = (frame / fps) * 1000;
    const activeImage = images.find(
      (img) => currentTimeMs >= img.start && currentTimeMs < img.end
    );

    setCurrentImage(activeImage?.url || '');
  }, [frame, images]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src="http://localhost:4001/audio/audioo.mp3" />
      
      {currentImage && (
        <Img
          src={currentImage}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Render current subtitle */}
      {currentSubtitle && (
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            width: '100%',
            textAlign: 'center',
            color: 'white',
            fontSize: 30,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px black',
          }}
        >
          {currentSubtitle.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
