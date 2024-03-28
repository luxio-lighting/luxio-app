import { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import LuxioDevices from '../components/LuxioDevices.js';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    NunitoMedium: require('../assets/fonts/Nunito-Medium.ttf'),
    NunitoSemiBold: require('../assets/fonts/Nunito-SemiBold.ttf'),
    NunitoBold: require('../assets/fonts/Nunito-Bold.ttf'),
  });

  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      onLayout={onLayoutRootView}
      style={{
        flex: 1,
        backgroundColor: '#222',
      }}>
      <LinearGradient
        colors={['#00000000', '#00000099']}
        start={[0, 0]}
        end={[0, 1]}
        style={{
          height: '100%',
        }}
      >
        <SafeAreaProvider>
          <SafeAreaView>
            <StatusBar style="light" />
            <LuxioDevices />
          </SafeAreaView>
        </SafeAreaProvider>
      </LinearGradient>
    </View>
  );
}
