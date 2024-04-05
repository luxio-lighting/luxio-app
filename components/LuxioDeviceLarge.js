import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Switch, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import lodash from 'lodash';

import LuxioUtil from '../lib/LuxioUtil.js';
import LuxioGradient from './LuxioGradient.js';
import LuxioSlider from './LuxioSlider.js';

const PRESETS_EFFECTS = [
  {
    name: 'Rainbow',
    effect: 'rainbow',
    image: require('../assets/effects/rainbow.png'),
  },
  {
    name: 'Knight Rider',
    effect: 'knightrider',
    image: require('../assets/effects/knightrider.png'),
  },
  {
    name: 'Colorcycle',
    effect: 'colorcycle',
    image: require('../assets/effects/colorcycle.png'),
  },
];
const PRESET_GRADIENTS = [
  {
    name: 'Luxio',
    colors: [
      {
        r: 79, g: 255, b: 127, w: 0,
      },
      {
        r: 0, g: 210, b: 255, w: 0,
      },
    ],
  },
  {
    name: 'Aurora',
    colors: [
      {
        r: 0, g: 198, b: 255, w: 0,
      },
      {
        r: 0, g: 108, b: 255, w: 0,
      },
      {
        r: 175, g: 255, b: 0, w: 0,
      },
      {
        r: 63, g: 255, b: 160, w: 0,
      },
    ],
  },
  {
    name: 'Sunset',
    colors: [
      {
        r: 255, g: 0, b: 0, w: 0,
      },
      {
        r: 255, g: 170, b: 0, w: 0,
      },
      {
        r: 255, g: 51, b: 0, w: 0,
      },
      {
        r: 255, g: 170, b: 0, w: 0,
      },
      {
        r: 170, g: 51, b: 0, w: 0,
      },
    ],
  },
  {
    name: 'Morning',
    colors: [
      {
        r: 224, g: 179, b: 92, w: 0,
      },
      {
        r: 255, g: 170, b: 255, w: 0,
      },
      {
        r: 185, g: 240, b: 37, w: 0,
      },
      {
        r: 84, g: 59, b: 118, w: 0,
      },
      {
        r: 95, g: 70, b: 36, w: 0,
      },
    ],
  },
  {
    name: 'Northpole',
    colors: [
      {
        r: 125, g: 156, b: 205, w: 0,
      },
      {
        r: 255, g: 255, b: 255, w: 0,
      },
      {
        r: 17, g: 115, b: 146, w: 0,
      },
    ],
  },
  {
    name: 'Party',
    colors: [
      {
        r: 222, g: 0, b: 255, w: 0,
      },
      {
        r: 30, g: 0, b: 255, w: 0,
      },
      {
        r: 0, g: 180, b: 255, w: 0,
      },
    ],
  },
  {
    name: 'Grass',
    colors: [
      {
        r: 126, g: 146, b: 44, w: 0,
      },
      {
        r: 0, g: 255, b: 0, w: 0,
      },
      {
        r: 163, g: 244, b: 162, w: 0,
      },
      {
        r: 115, g: 133, b: 1, w: 0,
      },
    ],
  },
  {
    name: 'Candlelight',
    colors: [
      {
        r: 44, g: 7, b: 1, w: 0,
      },
      {
        r: 194, g: 55, b: 4, w: 0,
      },
      {
        r: 248, g: 193, b: 17, w: 0,
      },
      {
        r: 44, g: 7, b: 1, w: 0,
      },
    ],
  },
  {
    name: 'Spectrum',
    colors: [
      {
        r: 255, g: 0, b: 0, w: 0,
      },
      {
        r: 255, g: 255, b: 0, w: 0,
      },
      {
        r: 0, g: 255, b: 0, w: 0,
      },
      {
        r: 0, g: 255, b: 255, w: 0,
      },
      {
        r: 0, g: 0, b: 255, w: 0,
      },
      {
        r: 255, g: 0, b: 255, w: 0,
      },
    ],
  },
  {
    name: 'Focus',
    colors: [
      {
        r: 211, g: 247, b: 255, w: 0,
      },
      {
        r: 255, g: 255, b: 255, w: 0,
      },
      {
        r: 255, g: 255, b: 255, w: 0,
      },
      {
        r: 255, g: 255, b: 255, w: 0,
      },
      {
        r: 211, g: 247, b: 255, w: 0,
      },
    ],
  },
];
const PRESET_COLORS = [
  {
    name: 'Red',
    color: {
      r: 255, g: 0, b: 0, w: 0,
    },
  },
  {
    name: 'Orange',
    color: {
      r: 255, g: 165, b: 0, w: 0,
    },
  },
  {
    name: 'Yellow',
    color: {
      r: 255, g: 255, b: 0, w: 0,
    },
  },
  {
    name: 'Green',
    color: {
      r: 0, g: 255, b: 0, w: 0,
    },
  },
  {
    name: 'Cyan',
    color: {
      r: 0, g: 255, b: 255, w: 0,
    },
  },
  {
    name: 'Blue',
    color: {
      r: 0, g: 0, b: 255, w: 0,
    },
  },
  {
    name: 'Magenta',
    color: {
      r: 255, g: 0, b: 255, w: 0,
    },
  },
  {
    name: 'Pink',
    color: {
      r: 255, g: 20, b: 147, w: 0,
    },
  },
  {
    name: 'Purple',
    color: {
      r: 128, g: 0, b: 128, w: 0,
    },
  },
  {
    name: 'RGB White',
    color: {
      r: 255, g: 255, b: 255, w: 0,
    },
  },
  {
    name: 'RGBW White',
    rgbw: true,
    color: {
      r: 0, g: 0, b: 0, w: 255,
    },
  },
  {
    name: 'RGB+W White',
    rgbw: true,
    color: {
      r: 255, g: 255, b: 255, w: 255,
    },
  },
  {
    name: 'Warm White',
    rgbw: true,
    color: {
      r: 255, g: 0, b: 0, w: 255,
    },
  },
  {
    name: 'Cool White',
    rgbw: true,
    color: {
      r: 0, g: 0, b: 255, w: 255,
    },
  },
];

export default function LuxioDeviceLarge(props) {
  const { device } = props;

  const [connected, setConnected] = useState(device.isConnected());
  const [name, setName] = useState(device.name);
  const [on, setOn] = useState(false);
  const [brightness, setBrightness] = useState(null);
  const [gradient, setGradient] = useState(null);
  const [type, setType] = useState(null);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      // height: withTiming(on ? 32 : 0, {
      //   duration: 300,
      // }),
      opacity: withTiming(on ? 1 : 0, {
        duration: 300,
      }),
    };
  });

  const setLedState = (ledState) => {
    // On
    const { on } = ledState;
    setOn(on);

    // Brightness
    const { brightness } = ledState;
    setBrightness(brightness);

    // Gradient
    const gradient = ledState.colors.map(LuxioUtil.rgbw2hex);
    if (gradient.length === 1) gradient.push(gradient[0]);
    setGradient(gradient);
  };

  const setLedConfig = (ledConfig) => {
    // Type
    const { type } = ledConfig;
    setType(type);
  };

  const setBrightnessThrottled = useMemo(() => {
    return lodash.throttle((value) => {
      setBrightness(value);

      device.led.setBrightness({
        brightness: Math.round(value),
      }).catch(err => {
        Alert.alert('Error Setting Brightness', err.message);
      });
    }, 200);
  }, []);

  useEffect(() => {
    device.connect()
      .then(() => {
        setConnected(true);
        setName(device.system.config?.name);
        setLedState(device.led.state);
        setLedConfig(device.led.config);
      })
      .catch(err => Alert.alert('Error Connecting', err.message));

    device.addEventListener('led.state', (state) => {
      setLedState(state);
    });

    device.addEventListener('led.config', (config) => {
      setLedConfig(config);
    });
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Ionicons name={
                    Platform.OS === 'ios'
                      ? 'chevron-down'
                      : 'chevron-back'
                  } size={24} color='white' />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#ffffff',
                    fontFamily: 'NunitoBold',
                    fontSize: 18,
                    marginLeft: 12,
                    textShadowColor: '#00000033',
                    textShadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    textShadowRadius: 4,
                  }}
                >{name}</Text>
              </>
            );
          },
          headerRight: () => {
            return (
              <>
                <TouchableOpacity
                  style={{
                    marginRight: 12,
                    backgroundColor: '#ffffff44',
                    padding: 4,
                    borderRadius: 100,
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: '/deviceSettings',
                      params: {
                        id: device.id,
                      },
                    });
                  }}
                >
                  <Ionicons name='cog-outline' size={22} color='white' />
                </TouchableOpacity>

                <Switch
                  value={on}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setOn(value);

                    device.led.setOn({
                      on: !!value,
                    }).catch(err => Alert.alert('Error', err.message));
                  }}
                  trackColor={{
                    false: '#ffffff33',
                    true: '#ffffff33',
                  }}
                  {...Platform.OS === 'ios' && ({
                    ios_backgroundColor: '#ffffff33',
                  })}
                  {...Platform.OS === 'android' && ({
                    thumbColor: '#ffffff',
                    style: {
                      marginTop: -8,
                    },
                  })}
                />
              </>
            );
          },
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#000',
        }}
      >
        <LuxioGradient
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          colors={on
            ? gradient
            : ['#000000', '#333333']
          }
        />
        <LinearGradient
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          colors={[
            '#00000055',
            '#000000AA',
          ]}
          start={[0, 0]}
          end={[1, 1]}
        />
      </View>

      <View
        style={{
          height: useHeaderHeight(),
        }}
      />

      <Animated.View
        style={[{
          marginBottom: 12,
          overflow: 'hidden',
        }, animatedContainerStyle]}
      >
        <LuxioSlider
          min={10}
          max={255}
          value={brightness}
          onValueChange={value => {
            setBrightnessThrottled(value);
          }}
        />
      </Animated.View>

      <ScrollView
        style={{
          height: '100%',
          padding: 12,
        }}
      >
        {/* <Text
          style={styles.presetsTitle}
        >Effects</Text>
        <View
          style={styles.presetsContainer}
        >
          {PRESETS_EFFECTS.map((preset, i) =>
            <TouchableScale
              key={`color-${preset.name}`}
              style={styles.presetContainer}
              activeScale={0.95}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                device.led.setAnimation({
                  id: preset.effect,
                }).catch(alert);
              }}
            >
              <Image
                style={[
                  styles.presetIcon,
                  {
                    backgroundColor: 'red',
                  },
                ]}
                source={preset.image}
                contentFit="cover"
              />
              <Text
                style={styles.presetText}
              >{preset.name}</Text>
            </TouchableScale>
          )}
        </View> */}

        <Text
          style={styles.presetsTitle}
        >Gradients</Text>
        <View
          style={styles.presetsContainer}
        >
          {PRESET_GRADIENTS.map((preset, i) =>
            <Animated.View
              key={`gradient-${preset.name}`}
              entering={FadeIn.duration(200).delay(i * 50)}
              style={{
                ...styles.presetContainer,
                // Honeycomb
                // marginTop: i % 3 === 1 ? 48 : 0,
                // marginBottom: i % 3 === 1 ? -12 : 0,
              }}
            >
              <TouchableScale
                activeScale={0.95}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                  device.led.setGradient({
                    colors: preset.colors,
                  }).catch(err => Alert.alert('Error Setting Gradient', err.message));
                }}
              >
                <View style={styles.presetIconWrap}>
                  <LinearGradient
                    style={styles.presetIconPreview}
                    colors={preset.colors.map(LuxioUtil.rgbw2hex)}
                    start={[0, 0]}
                    end={[1, 1]}
                  />
                  <LinearGradient
                    style={styles.presetIconOverlay}
                    colors={['#00000000', '#00000033']}
                    start={[0, 0]}
                    end={[1, 1]}
                  />
                </View>
                <Text
                  style={styles.presetText}
                >{preset.name}</Text>
              </TouchableScale>
            </Animated.View>
          )}
        </View>

        <Text
          style={styles.presetsTitle}
        >Solids</Text>
        <View
          style={styles.presetsContainer}
        >
          {PRESET_COLORS
            .filter(preset => {
              if (preset.rgbw && type !== 'SK6812') return false;
              return true;
            })
            .map((preset, i) =>
              <Animated.View
                key={`color-${preset.name}`}
                entering={FadeIn.duration(200).delay((Object.keys(PRESET_GRADIENTS).length + i) * 50)}
                style={styles.presetContainer}
              >
                <TouchableScale
                  activeScale={0.95}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    device.led.setColor(preset.color)
                      .catch(err => Alert.alert('Error Setting Color', err.message));
                  }}
                >
                  <View style={styles.presetIconWrap}>
                    <LinearGradient
                      style={styles.presetIconPreview}
                      colors={[
                        LuxioUtil.rgbw2hex(preset.color),
                        LuxioUtil.rgbw2hex(preset.color),
                      ]}
                    />
                    <LinearGradient
                      style={styles.presetIconOverlay}
                      colors={['#00000022', '#00000044']}
                      start={[0, 0]}
                      end={[1, 1]}
                    />
                  </View>
                  <Text
                    style={styles.presetText}
                  >{preset.name}</Text>
                </TouchableScale>
              </Animated.View>
            )}
        </View>

      </ScrollView >
    </>
  );
}

const styles = StyleSheet.create({
  presetsTitle: {
    color: '#ffffff',
    fontFamily: 'NunitoBold',
    fontSize: 28,
    marginHorizontal: 12,
    marginBottom: 12,
    textShadowColor: '#00000033',
    textShadowRadius: 4,
    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },
  presetsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  presetContainer: {
    marginBottom: 32,
    width: '33.333%',
  },
  presetIconWrap: {
    position: 'absolute',
    left: '50%',
    marginLeft: -72 / 2,
    width: 72,
    height: 72,
    backgroundColor: '#000000',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 12,
    borderRadius: 36,
  },
  presetIconPreview: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  presetIconOverlay: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  presetText: {
    marginTop: 72 + 12,
    color: '#fff',
    fontFamily: 'NunitoBold',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#00000033',
    textShadowRadius: 4,
    textShadowOffset: {
      width: 0,
      height: 1,
    },
  },
});
