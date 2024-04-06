import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            name="deviceColor"
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
    </GestureHandlerRootView>
  );
}
