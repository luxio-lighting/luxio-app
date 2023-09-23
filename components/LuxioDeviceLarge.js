import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';
import TouchableScale from 'react-native-touchable-scale';
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedGradient } from '../components/AnimatedGradient';
import * as Haptics from 'expo-haptics';
import lodash from 'lodash';
import alert from '../services/alert.js';

const POLL_INTERVAL = 1000;
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
    gradient: [
      '#4FFF7F',
      '#00D2FF',
    ],
  },
  {
    name: 'Aurora',
    gradient: [
      '#00C6FF',
      '#006CFF',
      '#AFFF00',
      '#3FFFA0'
    ]
  },
  {
    name: 'Sunset',
    gradient: [
      '#FF0000',
      '#FFAA00',
      '#FF3300',
      '#FFAA00',
      '#AA3300'
    ]
  },
  {
    name: 'Morning',
    gradient: [
      '#E0B35C',
      '#FFAAFF',
      '#B9F025',
      '#543B76',
      '#5F4624'
    ]
  },
  {
    name: 'Northpole',
    gradient: [
      '#7D9CCD',
      '#FFFFFF',
      '#117392'
    ]
  },
  {
    name: 'Party',
    gradient: [
      '#DE00FF',
      '#1E00FF',
      '#00B4FF'
    ]
  },
  {
    name: 'Grass',
    gradient: [
      '#7E922C',
      '#00FF00',
      '#A3F4A2',
      '#738501'
    ]
  },
  {
    name: 'Candlelight',
    gradient: [
      '#2C0701',
      '#C23704',
      '#F8C111',
      '#2C0701'
    ]
  },
  {
    name: 'Spectrum',
    gradient: [
      '#FF0000',
      '#FFFF00',
      '#00FF00',
      '#00FFFF',
      '#0000FF',
      '#FF00FF'
    ]
  },
  {
    name: 'Focus',
    gradient: [
      '#D3F7FF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#D3F7FF'
    ]
  },
];
const PRESET_COLORS = [
  {
    name: 'Red',
    color: '#FF0000',
  },
  {
    name: 'Orange',
    color: '#FFA500',
  },
  {
    name: 'Yellow',
    color: '#FFFF00',
  },
  {
    name: 'Green',
    color: '#00FF00',
  },
  {
    name: 'Cyan',
    color: '#00FFFF',
  },
  {
    name: 'Blue',
    color: '#0000FF',
  },
  {
    name: 'Magenta',
    color: '#FF00FF',
  },
  {
    name: 'Pink',
    color: '#FF1493',
  },
  {
    name: 'Purple',
    color: '#800080',
  },
  {
    name: 'White',
    color: '#FFFFFF',
  },
];

export default function LuxioDeviceLarge(props) {
  const { device } = props;

  const [synced, setSynced] = useState(device.synced);
  const [name, setName] = useState(device.name);
  const [on, setOn] = useState(device.synced ? device.on : null);
  const [brightness, setBrightness] = useState(device.synced ? device.brightness : null);
  const [gradient, setGradient] = useState(device.synced && device.gradient
    ? device.gradient
    : ['#000000', '#000000']);
  const [effect, setEffect] = useState(device.synced ? device.effect : null);

  const sync = useCallback(() => {
    device.sync()
      .then(() => {
        setSynced(true);
        setName(device.name);
        setOn(device.on);
        setBrightness(device.brightness);
        setEffect(device.effect);
        setGradient(device.on && device.gradient
          ? device.gradient
          : ['#333333', '#444444']
        );
      })
      .catch(alert.error);
  }, []);

  const syncThrottled = useCallback(lodash.throttle(() => {
    sync();
  }, 200), [sync]);

  // Sync every POLL_INTERVAL
  useEffect(() => {
    sync();
    const syncInterval = setInterval(syncThrottled, POLL_INTERVAL);
    return () => clearInterval(syncInterval);
  }, [sync]);

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
                <Entypo name='chevron-down' size={32} color='white' />
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
                    }
                  });
                }}
              >
                <Ionicons name='ios-settings-outline' size={24} color='white' />
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
        <AnimatedGradient
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.2 + brightness * 0.8,
          }}
          colors={gradient}
          start={[0, 0]}
          end={[0, 1]}
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
        <Text
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

                device.on = true;
                device.effect = preset.effect;
                syncThrottled();
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
              {/* <LinearGradient
                colors={['#00000033', '#00000099']}
                style={styles.presetIcon}
              /> */}
              <Text
                style={styles.presetText}
              >{preset.name}</Text>
            </TouchableScale>)}

        </View >

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

                device.on = true;
                device.gradient = preset.gradient;
                syncThrottled();
              }}
            >
              <LinearGradient
                colors={preset.gradient}
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
            </TouchableScale>)}
        </View>

        <Text
          style={styles.presetsTitle}
        >Solids</Text>
        <View
          style={styles.presetsContainer}
        >
          {PRESET_COLORS.map(preset =>
            <TouchableScale
              key={`color-${preset.name}`}
              style={styles.presetContainer}
              activeScale={0.95}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                device.on = true;
                device.gradient = [preset.color, preset.color];
                syncThrottled();
              }}
            >
              <LinearGradient
                colors={[preset.color, preset.color]}
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
            </TouchableScale>)}
        </View>

      </ScrollView >
    </>
  );
};

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
  }
});