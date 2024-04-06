import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, TouchableOpacity, Button, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Skia from '@shopify/react-native-skia';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import lodash from 'lodash';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import LuxioUtil from '../lib/LuxioUtil';

export default function LuxioDeviceSettings(props) {
  const { device } = props;

  const [size, setSize] = useState(256);
  const [cursorSize, setCursorSize] = useState(32);
  const cursorX = useSharedValue(size / 2);
  const cursorY = useSharedValue(size / 2);
  const cursorColor = useSharedValue('#FFFFFF');
  // const [cursorX, setCursorX] = useState(size / 2);
  // const [cursorY, setCursorY] = useState(size / 2);
  // const [cursorColor, setCursorColor] = useState('#FFFFFF');

  useEffect(() => {
    device.connect()
      .then(() => {

      })
      .catch(err => Alert.alert('Error Connecting', err.message));

    device.addEventListener('led.state', (state) => {

    });
  }, []);

  const syncColor = useMemo(() => {
    return lodash.throttle(({ h, s, v }) => {
      // Convert to RGB
      const { r, g, b } = LuxioUtil.hsv2rgb({ h, s, v });

      device.led.setColor({
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
      }).catch(err => Alert.alert('Error Setting Color', err.message));

    }, 400, {
      leading: true,
      trailing: true,
    });
  }, []);

  const pan = Gesture.Pan()
    // .runOnJS(true)
    .averageTouches(true)
    .maxPointers(1)
    .activeOffsetX([0, 0])
    .activeOffsetY([0, 0])
    .minVelocityX(0)
    .minVelocityY(0)
    .onBegin(({ x }) => {
      // setCursorSize(36);
    })
    .onEnd(() => {
      // setCursorSize(32);
    })
    .onUpdate(({ x, y }) => {
      // Limit between bounds of the circle
      const dx = x - size / 2;
      const dy = y - size / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > size / 2) {
        const angle = Math.atan2(dy, dx);
        x = size / 2 + Math.cos(angle) * size / 2;
        y = size / 2 + Math.sin(angle) * size / 2;
      }

      cursorX.value = x;
      cursorY.value = y;

      // Get HSV from x, y
      const h = Math.round((Math.atan2(y - size / 2, x - size / 2) * 180 / Math.PI + 360) % 360);
      const s = Math.min(1, distance / (size / 2));
      const v = 1;

      function hsv2hsl(hsvH, hsvS, hsvV) {
        const hslL = (200 - hsvS) * hsvV / 100;
        const [hslS, hslV] = [
          hslL === 0 || hslL === 200 ? 0 : hsvS * hsvV / 100 / (hslL <= 100 ? hslL : 200 - hslL) * 100,
          hslL * 5 / 10
        ];
        return [hsvH, hslS, hslV];
      }

      const hsl = hsv2hsl(h, s * 100, v * 100);

      cursorColor.value = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

      runOnJS(syncColor)({ h, s, v });
    })

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackVisible: false,
          headerTitle: () => {
            return (
              <Text
                style={{
                  color: '#ffffff',
                  fontFamily: 'NunitoBold',
                  fontSize: 18,
                  textShadowColor: '#00000033',
                  textShadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  textShadowRadius: 4,
                }}
              >Color</Text>
            );
          },
          headerTransparent: true,
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{
                  marginRight: Platform.OS === 'android' ? 12 : 0,
                }}
              >
                <Ionicons name={
                  Platform.OS === 'ios'
                    ? 'chevron-down'
                    : 'chevron-back'
                } size={24} color='white' />
              </TouchableOpacity>
            );
          },
        }}
      />

      <View
        style={{
          backgroundColor: '#222222',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: useHeaderHeight(),
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
          }}
          onLayout={e => {
            setSize(Math.min(e.nativeEvent.layout.width, e.nativeEvent.layout.height) - 64);
          }}
        >
          <GestureDetector
            gesture={pan}
          >
            <Skia.Canvas style={{
              width: size + 32,
              height: size + 32,
            }}>
              <Skia.Circle cx={size / 2 + 16} cy={size / 2 + 16} r={size / 2}>
                <Skia.SweepGradient
                  c={Skia.vec(size / 2 + 16, size / 2 + 16)}
                  colors={Array(36).fill(0).map((_, i) => `hsl(${i * 10}, 100%, 50%)`)}
                />
              </Skia.Circle>
              <Skia.Circle cx={size / 2 + 16} cy={size / 2 + 16} r={size / 2}>
                <Skia.RadialGradient
                  c={Skia.vec(size / 2 + 16, size / 2 + 16)}
                  r={size / 2}
                  colors={["#FFFFFFFF", "#FFFFFF00"]}
                />
              </Skia.Circle>

              <Skia.RoundedRect
                width={cursorSize}
                height={cursorSize}
                x={cursorX}
                y={cursorY}
                r={cursorSize / 2}
                color={cursorColor}
              >
                <Skia.Shadow dx={0} dy={0} blur={2} color="#000000CC" />
                <Skia.Shadow dx={0} dy={7} blur={10} color="#00000033" />

              </Skia.RoundedRect>
            </Skia.Canvas>
          </GestureDetector>
        </View>

      </View>

    </>
  );
}

const styles = StyleSheet.create({
});
