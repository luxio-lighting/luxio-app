import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import LuxioDeviceColor from '../components/LuxioDeviceColor.js';

import discovery from '../services/discovery';

export default function PageDevice() {
  const { id } = useLocalSearchParams();
  const device = discovery.getDevice(decodeURIComponent(id));
  if (!device) {
    return (
      <Text>Device Not Found</Text>
    );
  }

  return (
    <LuxioDeviceColor device={device} />
  );
}
