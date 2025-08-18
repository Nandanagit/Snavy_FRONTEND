// remotion/MyVideo.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import {Img} from 'remotion';
export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();

  // Simple animation: fade in text
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill>
          <Img src={`http://localhost:6001/images/image_1.png`}  width={1000} height={1400} style={{ objectFit: 'contain' }}/>
          <h1 style={{ color: 'white', fontSize: 80, opacity }}>{title}</h1>
        </AbsoluteFill>
  );
};
