import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Img, Audio, Video } from 'remotion';
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
  const [videoFiles, setVideoFiles] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string>('');

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
    const fetchVideoFiles = async () => {
      try {
        const response = await fetch("http://localhost:6001/video-files");
        if (response.ok) {
          const videos = await response.json();
          setVideoFiles(videos);
        }
      } catch (err) {
        console.error("Failed to fetch video files:", err);
      }
    };
    fetchVideoFiles();
  }, []);

  useEffect(() => {
    if (videoFiles.length === 0) return;
    const currentTimeMs = (frame / fps) * 1000;
    const videoDuration = 5000; // 5 seconds per video
    const videoIndex = Math.floor(currentTimeMs / videoDuration) % videoFiles.length;
    setCurrentVideo(videoFiles[videoIndex] || '');
  }, [frame, videoFiles]);

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
      <Audio src="http://localhost:6001/audio/audioo.wav" />
      
      {currentVideo ? (
        <Video
          src={currentVideo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      ) : currentImage && (
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
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {currentSubtitle.text}
        </div>
      )}
    </AbsoluteFill>
  );
};
