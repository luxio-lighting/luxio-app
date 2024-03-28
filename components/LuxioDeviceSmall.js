import { useState, useEffect, useMemo } from 'react';
import { Text, View, Switch, Platform, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import TouchableScale from 'react-native-touchable-scale';
import { router } from 'expo-router';
import Animated, { withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import lodash from 'lodash';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import LuxioUtil from '../lib/LuxioUtil.js';
import LuxioGradient from './LuxioGradient.js';
import { LuxioDiscoveryStrategyAP } from '@luxio-lighting/lib';

export default function LuxioDeviceSmall(props) {
  const { device } = props;

  const [connected, setConnected] = useState(device.isConnected());
  const [name, setName] = useState(device.name);
  const [on, setOn] = useState(device.led.state?.on ?? false);
  const [brightness, setBrightness] = useState(device.led.state?.brightness ?? null);
  const [gradient, setGradient] = useState(device.led.state?.colors ?? ['#222222', '#333333']);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(on ? 120 : 80, {
        duration: 300,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
      }),
    };
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(on ? 1 : 0, {
        duration: 300,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
      }),
    };
  });

  const setBrightnessThrottled = useMemo(() => {
    return lodash.throttle((value) => {
      setBrightness(value);

      device.led.setBrightness({
        brightness: value,
      }).catch(err => {
        Alert.alert('Error Setting Brightness', err.message);
      });
    }, 200);
  }, []);

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
      .catch(err => {
        Alert.alert('Error Connecting', err.message);
      });

    device.addEventListener('led.state', (state) => {
      setLedState(state);
    });
  }, []);

  const isHotspot = device.address === LuxioDiscoveryStrategyAP.ADDRESS;

  // Render
  return (
    <>
      {isHotspot && (
        <TouchableOpacity
          style={{
            marginHorizontal: 24,
            flexDirection: 'row',
            backgroundColor: '#FF7700',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push({
              pathname: 'newDevice',
              params: {
                id: device.id,
              },
            });
          }}
        >
          <FontAwesome5
            style={{
              marginRight: 12,
            }}
            name="wifi"
            size={20}
            color="white"
          />
          <Text
            style={{
              color: 'white',
              fontFamily: 'NunitoBold',
              fontSize: 16,
            }}
          >Connect to Wi-Fi</Text>
        </TouchableOpacity >
      )
      }

      <TouchableScale
        disabled={!connected}
        activeScale={0.975}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: 'device',
            params: {
              id: device.id,
            },
          });
        }}
      >
        <Animated.View
          style={[{
            flex: 1,
            marginHorizontal: 24,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowRadius: 12,
            borderRadius: 16,
            ...isHotspot
              ? {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }
              : {},
            backgroundColor: '#333333',
          }, animatedContainerStyle]}
        >
          <LuxioGradient
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 16,
              overflow: 'hidden',
            }}
            colors={on
              ? gradient
              : ['#000000', '#000000']}
          />
          <LinearGradient
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              borderRadius: 16,
              padding: 24,
              height: '100%',
            }}
            colors={connected
              ? ['#00000000', '#00000099']
              : ['#00000000', '#00000000']
            }
            start={[0, 0]}
            end={[0, 1]}
          />
          {/* <AnimatedGradient
            style={{
              borderRadius: 16,
              ...isHotspot
                ? {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }
                : {},
              height: '100%',
            }}
            colors={
              on
                ? gradient
                : ['#00000000', '#00000000']
            }
            start={[0, 1]}
            end={[1, 1]}
          /> */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexShrink: 0,
              padding: 24,
            }}
          >
            <View
              style={{
                flexGrow: 1,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'NunitoBold',
                  fontSize: 22,
                  textShadowColor: '#00000033',
                  textShadowRadius: 4,
                  textShadowOffset: {
                    width: 0,
                    height: 1,
                  },
                }}
              >{name}</Text>
            </View>

            <View
              style={{
                flexShrink: 0,
              }}
            >
              {!connected && (
                <View
                  style={{
                    width: 50,
                    height: 30,
                    borderRadius: 100,
                    backgroundColor: '#ffffff33',
                  }}
                />
              )}
              {connected && (
                <Switch
                  value={on}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setOn(value);

                    device.led.setOn({
                      on: !!value,
                    });
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
              )}
            </View>
          </View>
          {connected && (
            <Animated.View
              style={[{
                pointerEvents: on
                  ? 'auto'
                  : 'none',
                position: 'absolute',
                left: 24,
                right: 24,
                top: 64,
              }, animatedSliderStyle]}
            >
              {/* <LinearGradient
                  colors={['#FFFFFF00', '#FFFFFFFF', '#00000000', '#00000000']}
                  start={[0, 0]}
                  end={[1, 0]}
                  locations={[0, brightness, brightness, 1]}
                  style={{
                    height: 32,
                    borderRadius: 16,
                  }}
                > */}
              <Slider
                style={{
                  height: 32,
                }}
                onValueChange={(value) => {
                  setBrightnessThrottled(value);
                }}
                minimumValue={10}
                maximumValue={255}
                step={1}
                tapToSeek={true}
                value={brightness}
                minimumTrackTintColor="#FFFFFFAA"
                maximumTrackTintColor="#FFFFFF33"
              />
              {/* </LinearGradient> */}
            </Animated.View>
          )}
          {/* </LinearGradient> */}
        </Animated.View>
      </TouchableScale>
    </>
  );
}
