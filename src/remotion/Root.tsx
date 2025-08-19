import { Composition } from 'remotion';
import { MyVideo } from './MyComp/Main';

// const IMAGE_FILES = Array.from({ length: 15 }, (_, i) => `img_${i}.webp`);
// const DURATION_IN_SECONDS = IMAGE_FILES.length * 5;
// const FPS = 30;
// const totalFrames = Math.ceil(DURATION_IN_SECONDS * FPS);

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={500}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'Hello snavy',
      }}
    />
  );
};
