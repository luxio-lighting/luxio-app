import { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  Skia,
  Canvas,
  Image,
  Rect,
  LinearGradient,
  vec,
  useCanvasRef,
} from '@shopify/react-native-skia';
import {
  withTiming,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';

const imageBlackData = Skia.Data.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='); // 1px by 1px black image
const imageBlack = Skia.Image.MakeImageFromEncoded(imageBlackData);

export default function LuxioGradient({
  colors = ["#FF0000", "#00FF00", "#0000FF"],
  style = {},
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(imageBlack);
  const [foregroundGradient, setForegroundGradient] = useState(colors);

  const canvasRef = useCanvasRef();
  const foregroundOpacity = useSharedValue(1);

  useEffect(() => {
    // cancelAnimation(foregroundOpacity);

    // // Take a snapshot of the canvas, and set that as background
    // try {
    //   const snapshot = canvasRef.current?.makeImageSnapshot();
    //   setBackgroundImage(snapshot);
    // } catch (err) {
    //   // Throws on first render
    // }

    // Render the new colors
    setForegroundGradient(colors);

    // Animated foregroundOpacity to 100%
    // foregroundOpacity.value = 0;
    // foregroundOpacity.value = withTiming(1, { duration: 300 });
  }, [colors]);

  return (
    <View
      style={style}
      collapsable={false}
    >
      <Canvas
        ref={canvasRef}
        collapsable={false}
        onLayout={e => {
          setWidth(e.nativeEvent.layout.width);
          setHeight(e.nativeEvent.layout.height);
        }}
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      >
        <Image
          x={0}
          y={0}
          width={width}
          height={height}
          image={backgroundImage}
          fit="cover"
        />
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={foregroundOpacity}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={foregroundGradient}
          />
        </Rect>
      </Canvas>
    </View>
  );
};
