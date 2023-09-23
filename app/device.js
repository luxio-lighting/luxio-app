import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import LuxioDeviceLarge from '../components/LuxioDeviceLarge.js';

import discovery from '../services/discovery';

export default function PageDevice() {
  const { id } = useLocalSearchParams();
  const device = discovery.getDevice(decodeURIComponent(id));
  if (!device) return (
    <Text>Device Not Found</Text>
  );

  return (
    <LuxioDeviceLarge device={device} />
  );
}

