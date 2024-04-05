import { useEffect, useState, useRef, useCallback } from 'react';
import { View, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const thumbSize = 24;
// const thumbMargin = 8;

export default function LuxioSlider({
  min = 0,
  max = 255,
  value = 0,
  onValueChange = () => { },
  style = {},
}) {
  const viewRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const trackBackgroundRef = useRef(null);

  const [trackBackgroundWidth, setTrackBackgroundWidth] = useState(0);
  const trackBackgroundWidthRef = useRef(null);
  useEffect(() => { trackBackgroundWidthRef.current = trackBackgroundWidth; }, [trackBackgroundWidth]);

  const [trackBackgroundOffset, setTrackBackgroundOffset] = useState(0);
  const trackBackgroundOffsetRef = useRef(null);
  useEffect(() => { trackBackgroundOffsetRef.current = trackBackgroundOffset; }, [trackBackgroundOffset]);

  const [trackForegroundWidth, setTrackForegroundWidth] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);

  const handleMove = useCallback((locationX) => {
    const trackBackgroundWidth = trackBackgroundWidthRef.current;
    const trackbackgrounfOffset = trackBackgroundOffsetRef.current;

    // Calculate the scaled locationX. This value will be in pixels.
    let scaledLocationX = locationX - trackbackgrounfOffset;
    if (scaledLocationX < 0) scaledLocationX = 0;
    if (scaledLocationX > trackBackgroundWidth) scaledLocationX = trackBackgroundWidth;

    const value = Math.min(max, Math.max(min, min + (max - min) * scaledLocationX / trackBackgroundWidth));
    onValueChange(value);

    const valuePercentage = (value - min) / (max - min);
    setTrackForegroundWidth(trackBackgroundWidth * valuePercentage);
    setThumbLeft(trackBackgroundWidth * valuePercentage - 16 * valuePercentage + 8);
  }, []);

  const pan = Gesture.Pan()
    .onBegin(({ x }) => {
      runOnJS(handleMove)(x);
      runOnJS(setIsDragging)(true);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onEnd(() => {
      runOnJS(setIsDragging)(false);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate(({ x }) => {
      runOnJS(handleMove)(x);
    })

  useEffect(() => {
    if (isDragging) return;

    const valuePercentage = (value - min) / (max - min);
    setTrackForegroundWidth(trackBackgroundWidth * valuePercentage);
    setThumbLeft(trackBackgroundWidth * valuePercentage - 16 * valuePercentage + 8);
  }, [value, min, max, trackBackgroundWidth]);

  return (
    <GestureDetector
      gesture={pan}
    >
      <View
        // {...panResponder.panHandlers}
        ref={viewRef}
        style={{
          ...style,
          height: 32,
        }}
      >

        {/* Track Background Border */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 12,
            right: 12,
            height: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#00000009',
          }}
        />

        {/* Track Background */}
        <View
          ref={trackBackgroundRef}
          onLayout={e => {
            trackBackgroundRef.current.measure((x, y, width, height, pageX, pageY) => {
              setTrackBackgroundWidth(width);
              setTrackBackgroundOffset(pageX);
            });
          }}
          style={{
            position: 'absolute',
            top: 8,
            left: 12,
            right: 12,
            height: 8,
            backgroundColor: '#00000033',
            borderRadius: 4,
          }}
        >

          {/* Track Foreground */}
          <LinearGradient
            start={[0, 0]}
            end={[1, 0]}
            colors={['#ffffff33', '#ffffffff']}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: trackForegroundWidth,
              borderRadius: 16,
            }}
          />

          {/* Thumb */}
          <View
            style={{
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: '#ffffff',
              position: 'absolute',
              left: thumbLeft,
              top: -8,
              marginLeft: -thumbSize / 2,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.25,
              transform: [
                isDragging
                  ? { scale: 0.95 }
                  : { scale: 1 },
              ],
            }}
          />
        </View>

      </View >

    </GestureDetector>
  );
}