import { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, View, Switch, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedGradient } from '../components/AnimatedGradient';
import Slider from '@react-native-community/slider';
import TouchableScale from 'react-native-touchable-scale';
import { router } from 'expo-router';
import Animated, {
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import lodash from 'lodash';
import alert from '../services/alert.js';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LuxioUtil } from 'luxio';

const POLL_INTERVAL = 1000;

export default function LuxioDeviceSmall(props) {
  const { device } = props;

  const [synced, setSynced] = useState(device.synced);
  const [name, setName] = useState(device.name);
  const [on, setOn] = useState(device.synced ? device.on : null);
  const [brightness, setBrightness] = useState(device.synced ? device.brightness : null);
  const [gradient, setGradient] = useState(device.synced ? device.gradient : ['#222222', '#333333']);
  const [effect, setEffect] = useState(device.synced ? device.effect : null);

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
      .catch(err => console.error(err));
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

  const isAP = `http://${device.address}` === LuxioUtil.AP_ADDRESS;

  // Render
  return (
    <>
      {isAP && (
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
        disabled={!synced}
        activeScale={0.975}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: `device`,
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
            ...isAP
              ? {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }
              : {},
            backgroundColor: '#333333',
          }, animatedContainerStyle]}
        >
          <AnimatedGradient
            style={{
              borderRadius: 16,
              ...isAP
                ? {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }
                : {},
              height: '100%',
            }}
            colors={gradient}
            start={[0, 1]}
            end={[1, 1]}
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
            colors={synced
              ? ['#00000000', '#00000099']
              : ['#00000000', '#00000000']
            }
            start={[0, 0]}
            end={[0, 1]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexShrink: 0,
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                }}
              >
                {!synced && (
                  <View
                    style={{
                      width: 160,
                      height: 30,
                      borderRadius: 100,
                      backgroundColor: '#ffffff33',
                    }}
                  />
                )}
                {synced && (
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
                )}
              </View>

              <View
                style={{
                  flexShrink: 0,
                }}
              >
                {!synced && (
                  <View
                    style={{
                      width: 50,
                      height: 30,
                      borderRadius: 100,
                      backgroundColor: '#ffffff33',
                    }}
                  />
                )}
                {synced && (
                  <Switch
                    value={on}
                    onValueChange={value => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setOn(value);
                      device.on = value;
                      syncThrottled();
                    }}
                    trackColor={{
                      false: '#ffffff33',
                      true: '#ffffff33',
                    }}
                    {...Platform.OS === 'ios' && ({
                      ios_backgroundColor: '#ffffff33'
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
            {synced && (
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
                  onValueChange={value => {
                    setBrightness(value);
                    device.brightness = value;
                    syncThrottled();
                  }}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.01}
                  tapToSeek={true}
                  value={brightness}
                  minimumTrackTintColor="#FFFFFFAA"
                  maximumTrackTintColor="#FFFFFF33"
                />
                {/* </LinearGradient> */}
              </Animated.View>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableScale>
    </>
  );
}