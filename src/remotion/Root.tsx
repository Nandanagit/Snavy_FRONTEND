import { Composition } from 'remotion';
import { MyVideo } from './MyComp/Main';

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        title: 'Hello World',
      }}
    />
  );
};
