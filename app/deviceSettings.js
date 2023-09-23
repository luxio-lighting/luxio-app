import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import LuxioDeviceSettings from '../components/LuxioDeviceSettings.js';

import discovery from '../services/discovery';

export default function PageDevice() {
  const { id } = useLocalSearchParams();
  const device = discovery.getDevice(decodeURIComponent(id));
  if (!device) return (
    <Text>Device Not Found</Text>
  );

  return (
    <LuxioDeviceSettings device={device} />
  );
}

