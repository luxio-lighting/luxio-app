import { useState, useEffect } from 'react';
import { RefreshControl, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import alert from '../services/alert.js';

import discovery from '../services/discovery.js';

import LuxioDeviceSmall from '../components/LuxioDeviceSmall.js';

const POLL_INTERVAL = 5000;

export default function LuxioDevices() {
  const [devices, setDevices] = useState(null);
  const [discovering, setDiscovering] = useState(false);
  const [discoveringManually, setDiscoveringManually] = useState(false);

  const discover = async () => {
    if (discovering) return;

    setDiscovering(true);
    await discovery.discoverDevices()
      .then(devices => {
        setDevices(devices);
      })
      .catch(err => alert.error(err))
      .finally(() => {
        setDiscovering(false);
      })
  }

  const discoverManually = () => {
    setDiscoveringManually(true);
    discover()
      .finally(() => {
        setDiscoveringManually(false);
      });
  }

  useEffect(() => {
    discover();
    const discoverInterval = setInterval(discover, POLL_INTERVAL);
    return () => clearInterval(discoverInterval);
  }, []);

  return (
    <View
      style={{
        height: '100%',
      }}
    >
      {devices && Object.keys(devices).length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexGrow: 0,
            flexShrink: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 24,
            marginVertical: 24,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontFamily: 'NunitoBold',
              fontSize: 32,
              flexGrow: 1,
            }}
          >My Luxios</Text>

          <TouchableScale
            activeScale={0.975}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: 'newDevice',
              });
            }}
          >
            <AntDesign name="pluscircle" size={32} color="white" />
          </TouchableScale>
        </View>
      )}

      {!devices && discovering && (
        <View
          style={{
            height: '100%',
            marginHorizontal: 48,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            color="white"
            size="large"
            style={{
              marginBottom: 12,
            }}
          />
          {/* <MaterialCommunityIcons
            name="radar"
            size={42}
            color="white"
            style={{
              marginBottom: 12,
            }}
          /> */}
          <Text
            style={{
              fontFamily: 'NunitoBold',
              fontSize: 28,
              color: 'white',
              marginBottom: 16,
            }}
          >Searching...</Text>
          <Text
            style={{
              fontFamily: 'NunitoSemiBold',
              fontSize: 18,
              lineHeight: 28,
              color: 'white',
              marginBottom: 24,

            }}
          >Luxio devices are being discovered.</Text>
        </View>
      )}


      {devices && Object.keys(devices).length === 0 && (
        <View
          style={{
            height: '100%',
            marginHorizontal: 48,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="ios-warning-outline"
            size={42}
            color="white"
            style={{
              marginBottom: 2,
            }}
          />
          <Text
            style={{
              fontFamily: 'NunitoBold',
              fontSize: 28,
              color: 'white',
              marginBottom: 16,
            }}
          >No Luxios Found.</Text>
          <Text
            style={{
              fontFamily: 'NunitoSemiBold',
              fontSize: 18,
              lineHeight: 28,
              color: 'white',
              marginBottom: 36,

            }}
          >Make sure you're on the same Wi-Fi network, and that VPN is turned off.</Text>

          <TouchableScale
            activeScale={0.975}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: 'newDevice',
              });
            }}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 100,
              paddingVertical: 12,
              paddingHorizontal: 32,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowRadius: 12,
            }}
          >
            <Text
              style={{
                fontFamily: 'NunitoBold',
                fontSize: 18,
                color: 'black',
              }}
            >Setup new Luxio</Text>
          </TouchableScale>
        </View>
      )}

      {devices && Object.keys(devices).length > 0 && (
        <ScrollView
          style={{
            height: '100%',
          }}
          refreshControl={<RefreshControl
            tintColor={'#fff'}
            progressBackgroundColor={'#fff'}
            refreshing={discoveringManually}
            onRefresh={discoverManually}
          />}
        >
          {Object.entries(devices).map(([deviceId, device]) => (
            <LuxioDeviceSmall
              key={deviceId}
              device={device}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
