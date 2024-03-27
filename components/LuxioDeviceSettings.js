import { useState } from 'react';
import {
  StyleSheet, View, Text, Alert, ScrollView, TouchableOpacity, Button,
} from 'react-native';
import { router, Stack } from 'expo-router';
import Dialog from 'react-native-dialog';
import { Entypo, Feather } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';

export default function LuxioDeviceSettings(props) {
  const { device } = props;

  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [nameDialogSaving, setNameDialogSaving] = useState(false);
  const [nameDialogValue, setNameDialogValue] = useState(device.system.config?.name ?? '-');
  const [name, setName] = useState(device.system.config.name);

  const [pixelsDialogVisible, setPixelsDialogVisible] = useState(false);
  const [pixelsDialogSaving, setPixelsDialogSaving] = useState(false);
  const [pixelsDialogValue, setPixelsDialogValue] = useState(String(device.led.config?.count ?? '-'));
  const [pixels, setPixels] = useState(device.led.config.count);

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerTransparent: true,
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Entypo name='chevron-down' size={32} color='white' />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Dialog.Container visible={nameDialogVisible}>
        <Dialog.Title>Name</Dialog.Title>
        <Dialog.Input
          value={nameDialogValue}
          onChangeText={setNameDialogValue}
          autoFocus={true}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setNameDialogVisible(false);
          }}
        />
        <Dialog.Button
          label={nameDialogSaving ? 'Saving...' : 'Save'}
          disabled={nameDialogSaving === true}
          bold={true}
          onPress={() => {
            if (nameDialogSaving) return;

            setNameDialogSaving(true);
            device.system.setName({
              name: nameDialogValue,
            })
              .then(() => {
                setName(nameDialogValue);
                setNameDialogVisible(false);
              })
              .catch(err => Alert.alert('Error Saving', err.message))
              .finally(() => {
                setNameDialogSaving(false);
              });
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={pixelsDialogVisible}>
        <Dialog.Title>Pixels</Dialog.Title>
        <Dialog.Input
          value={pixelsDialogValue}
          onChangeText={setPixelsDialogValue}
          autoFocus={true}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setPixelsDialogVisible(false);
          }}
        />
        <Dialog.Button
          label={pixelsDialogSaving ? 'Saving...' : 'Save'}
          disabled={pixelsDialogSaving === true}
          bold={true}
          onPress={() => {
            setPixelsDialogSaving(true);
            device.led.setCount({
              count: Number(pixelsDialogValue),
            })
              .then(() => {
                setPixels(pixelsDialogValue);
                setPixelsDialogVisible(false);
              })
              .catch((err) => Alert.alert('Error Saving', err.message))
              .finally(() => {
                setPixelsDialogSaving(false);
              });
          }}
        />
      </Dialog.Container>

      <View
        style={{
          height: useHeaderHeight(),
        }}
      />

      <ScrollView
        style={{
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#222222',
          paddingTop: 24,
        }}
      >

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue}>{name ?? '-'}</Text>
          </View>
          <View style={styles.rowContainerEdit}>
            <TouchableOpacity
              onPress={() => {
                setNameDialogVisible(true);
              }}
            >
              <Feather name="edit" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Pixels</Text>
            <Text style={styles.rowValue}>{String(pixels ?? '-')}</Text>
          </View>
          <View style={styles.rowContainerEdit}>
            <TouchableOpacity
              onPress={() => {
                setPixelsDialogVisible(true);
              }}
            >
              <Feather name="edit" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Firmware</Text>
            <Text style={styles.rowValue}>{device.system.state.version ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Wi-Fi SSID</Text>
            <Text style={styles.rowValue}>{device.wifi.state.ssid ?? '-'}</Text>
          </View>
          <View style={styles.rowContainerEdit}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/newDevice',
                  params: {
                    id: device.id,
                  },
                });
              }}
            >
              <Feather name="edit" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Wi-Fi Address</Text>
            <Text style={styles.rowValue}>{device.wifi.state.ip ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Wi-Fi MAC</Text>
            <Text style={styles.rowValue}>{device.wifi.state.mac ?? '-'}</Text>
          </View>
        </View>

        <View style={{
          flexGrow: 1,
        }} />

        <Button
          title="Restart"
          color="#ffffff"
          onPress={() => {
            device.system.restart()
              .then(() => Alert.alert('Restarting', 'The device will restart shortly.'))
              .catch(err => Alert.alert('Error Restarting', err.message));
          }}
        />

        <Button
          title="Factory Reset"
          color="#ff0000"
          onPress={() => {
            Alert.alert('Factory Reset', 'This will clear all Settings & Wi-Fi.\nAre you sure you want to continue?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Factory Reset',
                style: 'destructive',
                onPress: () => {
                  device.system.factoryReset()
                    .then(() => Alert.alert('Factory Reset', 'The device has been reset to factory settings.'))
                    .catch(err => Alert.alert('Error Resetting', err.message));
                },
              },
            ]);

          }}
        />

      </ScrollView >
    </>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    marginHorizontal: 28,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainerValue: {
    flexGrow: 1,
  },
  rowContainerEdit: {
    flexGrow: 0,
    flexShrink: 0,
  },
  rowLabel: {
    flexGrow: 1,
    color: '#ffffff',
    fontFamily: 'NunitoBold',
    fontSize: 18,
  },
  rowValue: {
    color: '#ffffff99',
    fontFamily: 'NunitoBold',
    fontSize: 18,
  },
});
