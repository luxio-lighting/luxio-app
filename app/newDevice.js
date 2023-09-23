import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import LuxioSetup from '../components/LuxioSetup.js';

import discovery from '../services/discovery';

export default function PageDevice() {
  const { id } = useLocalSearchParams();
  if (id) {
    const device = discovery.getDevice(decodeURIComponent(id));
    if (!device) return (
      <Text>Device Not Found</Text>
    );

    return (
      <LuxioSetup device={device} />
    );
  }

  return (
    <LuxioSetup device={null} />
  );
}

