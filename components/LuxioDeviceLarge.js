import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import LuxioUtil from '../lib/LuxioUtil.js';
import LuxioGradient from './LuxioGradient.js';

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
    color: {
      r: 0, g: 0, b: 0, w: 255,
    },
  },
  {
    name: 'RGB+W White',
    color: {
      r: 255, g: 255, b: 255, w: 255,
    },
  },
  {
    name: 'Warm White',
    color: {
      r: 255, g: 0, b: 0, w: 255,
    },
  },
  {
    name: 'Cool White',
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

  useEffect(() => {
    device.connect()
      .then(() => {
        setConnected(true);
        setName(device.system.config?.name);
        setLedState(device.led.state);
      })
      .catch(err => Alert.alert('Error Connecting', err.message));

    device.addEventListener('led.state', (state) => {
      setLedState(state);
    });
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name='chevron-down' size={24} color='white' />
              </TouchableOpacity>
            );
          },
          headerRight: () => {
            return (
              <TouchableOpacity
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
                <Ionicons name='settings-outline' size={24} color='white' />
              </TouchableOpacity>
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
            : null
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

      <ScrollView
        style={{
          height: '100%',
          padding: 24,
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
            <TouchableScale
              key={`color-${preset.name}`}
              style={styles.presetContainer}
              activeScale={0.95}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                device.led.setGradient({
                  colors: preset.colors,
                }).catch(err => Alert.alert('Error Setting Gradient', err.message));
              }}
            >
              <LinearGradient
                colors={preset.colors.map(LuxioUtil.rgbw2hex)}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.presetIcon}
              >
                <LinearGradient
                  style={{
                    height: '100%',
                    borderRadius: 36,
                  }}
                  colors={['#00000000', '#00000033']}
                  start={[0, 0]}
                  end={[1, 1]}
                />
              </LinearGradient>
              <Text
                style={styles.presetText}
              >{preset.name}</Text>
            </TouchableScale>
          )}
        </View>

        <Text
          style={styles.presetsTitle}
        >Solids</Text>
        <View
          style={styles.presetsContainer}
        >
          {PRESET_COLORS.map((preset) =>
            <TouchableScale
              key={`color-${preset.name}`}
              style={styles.presetContainer}
              activeScale={0.95}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                device.led.setColor(preset.color)
                  .catch(err => Alert.alert('Error Setting Color', err.message));
              }}
            >
              <LinearGradient
                colors={[
                  LuxioUtil.rgbw2hex(preset.color),
                  LuxioUtil.rgbw2hex(preset.color),
                ]}
                style={styles.presetIcon}
              >
                <LinearGradient
                  style={{
                    height: '100%',
                    borderRadius: 36,
                  }}
                  colors={['#00000022', '#00000044']}
                  start={[0, 0]}
                  end={[1, 1]}
                />
              </LinearGradient>
              <Text
                style={styles.presetText}
              >{preset.name}</Text>
            </TouchableScale>
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
    width: '33.3%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#00000033',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 12,
  },
  presetIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  presetText: {
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
