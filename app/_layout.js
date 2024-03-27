import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
        />
        <Stack.Screen
          name="device"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTransparent: true,
            headerTintColor: '#ffffff',
          }}
        />
        <Stack.Screen
          name="deviceSettings"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#222222',
            },
            headerTintColor: '#ffffff',
          }}
        />
        <Stack.Screen
          name="newDevice"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            presentation: 'modal',
          }}
        />
      </Stack >
    </>
  );
}
