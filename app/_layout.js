import { Stack } from 'expo-router';
import DropdownAlert, { DropdownAlertType } from 'react-native-dropdownalert';
import alert from '../services/alert.js';

export default function Layout() {
  return (
    <>
      <DropdownAlert alert={fn => {
        alert.error = err => {
          fn({
            type: DropdownAlertType.Error,
            title: 'Error',
            message: err.message || err.toString(),
          });
        };
      }} />
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