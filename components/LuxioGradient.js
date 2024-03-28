import { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
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
} from 'react-native-reanimated';

export default function LuxioGradient({
  colors = ["#FF0000", "#00FF00", "#0000FF"],
  style = {},
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [foregroundGradient, setForegroundGradient] = useState(colors);

  const canvasRef = useCanvasRef();
  const foregroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Take a snapshot of the canvas, and set that as background
    try {
      const snapshot = canvasRef.current?.makeImageSnapshot();
      setBackgroundImage(snapshot);
    } catch (err) {
      // Throws on first render
    }

    // Render the new colors
    setForegroundGradient(colors);

    // Animated foregroundOpacity to 100%
    foregroundOpacity.value = 0;
    foregroundOpacity.value = withTiming(1, { duration: 400 });
  }, [colors]);

  return (
    <View
      style={style}
    >
      <Canvas
        ref={canvasRef}
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
