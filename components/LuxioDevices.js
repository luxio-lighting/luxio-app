import { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import TouchableScale from 'react-native-touchable-scale';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import discovery from '../services/discovery.js';

import LuxioDeviceSmall from './LuxioDeviceSmall.js';

export default function LuxioDevices() {
  const [devices, setDevices] = useState(null);

  useEffect(() => {
    discovery.registerDeviceCallback(() => {
      const devices = discovery.getDevices();
      setDevices({ ...devices });
    });

    const devices = discovery.getDevices();
    if (Object.keys(devices).length > 0) {
      setDevices({ ...devices });
    } else {
      setTimeout(() => {
        const devices = discovery.getDevices();
        setDevices({ ...devices });
      }, 5000); // Show 'No Luxios Found' after 5 seconds
    }
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

      {!devices && (
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
              textAlign: 'center',

            }}
          >Searching for Luxios on Wi-Fi...</Text>
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
            name="warning-outline"
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
          >No Luxios Found</Text>
          <Text
            style={{
              fontFamily: 'NunitoSemiBold',
              fontSize: 18,
              textAlign: 'center',
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
