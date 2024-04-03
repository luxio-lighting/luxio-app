import { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  Canvas,
  Rect,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  FadeIn,
} from 'react-native-reanimated';

export default function LuxioGradient({
  colors = ["#FF0000", "#00FF00", "#0000FF"],
  style = {},
  duration = 300,
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [gradients, setGradients] = useState([{
    colors: ['#000000', '#000000'],
    createdAt: Date.now(),
  }]);

  useEffect(() => {
    // Add new colors to gradients
    const gradientsNew = [...gradients, {
      colors,
      createdAt: Date.now(),
    }];

    // Remove oldest gradient
    if (gradientsNew.length >= 3) {
      gradientsNew.shift();
    }

    setGradients(gradientsNew);
  }, [colors]);

  return (
    <View
      style={style}
      collapsable={false}
      onLayout={e => {
        setWidth(e.nativeEvent.layout.width);
        setHeight(e.nativeEvent.layout.height);
      }}
    >
      {gradients.map(gradient => (
        <Animated.View
          key={String(gradient.createdAt)}
          entering={FadeIn.duration(duration)}
          width={width}
          height={height}
          style={{
            position: 'absolute',
          }}
        >
          <Canvas
            collapsable={false}
            style={{
              flex: 1,
              flexGrow: 1,
            }}
          >
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(width, height)}
                colors={gradient.colors}
              />
            </Rect>
          </Canvas>
        </Animated.View>
      ))}
    </View >
  );
};
