import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, TouchableOpacity, Button } from 'react-native';
import { router, Stack } from 'expo-router';
import Dialog from 'react-native-dialog';
import { Ionicons, Feather } from '@expo/vector-icons';
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

  const [typeDialogVisible, setTypeDialogVisible] = useState(false);
  const [typeDialogSaving, setTypeDialogSaving] = useState(false);
  const [type, setType] = useState(device.led.config.type);

  useEffect(() => {
    device.connect()
      .then(() => {
        setName(device.system.config?.name);
        setPixels(device.led.config?.count);
        setType(device.led.config?.type);
      })
      .catch(err => Alert.alert('Error Connecting', err.message));

    device.addEventListener('system.config', (config) => {
      setName(config?.name);
    });

    device.addEventListener('led.config', (config) => {
      setPixels(config?.count);
      setType(config?.type);
    });
  }, []);

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
                <Ionicons name='chevron-down' size={24} color='white' />
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
        <Dialog.Title>Number of LEDs</Dialog.Title>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              let value = Number(pixelsDialogValue);
              if (isNaN(value)) value = 0;
              value = value - 1;
              if (value < 1) value = 1;

              setPixelsDialogValue(String(value));
              setPixelsDialogSaving(true);

              device.led.setCount({
                count: value,
              })
                .catch(err => Alert.alert('Error Saving', err.message))
                .finally(() => setPixelsDialogSaving(false));
            }}
          >
            <Ionicons name='remove-circle-outline' size={24} color='#aaa' />
          </TouchableOpacity>

          <Dialog.Input
            value={pixelsDialogValue}
            onChangeText={setPixelsDialogValue}
            autoFocus={true}
            wrapperStyle={{
              flexGrow: 1,
              marginHorizontal: 8,
              marginBottom: 0,
            }}
          />

          <TouchableOpacity
            onPress={() => {
              let value = Number(pixelsDialogValue);
              if (isNaN(value)) value = 0;
              value = value + 1;
              if (value < 1) value = 1;

              setPixelsDialogValue(String(value));

              device.led.setCount({
                count: value,
              })
                .catch(err => Alert.alert('Error Saving', err.message))
                .finally(() => setPixelsDialogSaving(false));
            }}
          >
            <Ionicons name='add-circle-outline' size={24} color='#aaa' />
          </TouchableOpacity>

        </View>
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
          style={{
            opacity: pixelsDialogSaving
              ? 0.5
              : 1
          }}
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

      <Dialog.Container
        visible={typeDialogVisible}
        verticalButtons={true}
      >
        <Dialog.Title>LED Type</Dialog.Title>
        <Dialog.Button
          label="WS2812 (RGB)"
          bold={type === 'WS2812'}
          onPress={() => {
            if (typeDialogSaving) return;

            setTypeDialogSaving(true);
            device.led.setType({
              type: 'WS2812',
            })
              .catch(err => Alert.alert('Error Saving', err.message))
              .finally(() => {
                setTypeDialogSaving(false);
                setTypeDialogVisible(false);
              });
          }}
        />
        <Dialog.Button
          label="SK6812 (RGBW)"
          bold={type === 'SK6812'}
          onPress={() => {
            if (typeDialogSaving) return;

            setTypeDialogSaving(true);
            device.led.setType({
              type: 'SK6812',
            })
              .catch(err => Alert.alert('Error Saving', err.message))
              .finally(() => {
                setTypeDialogSaving(false);
                setTypeDialogVisible(false);
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
            <Text style={styles.rowLabel}>LED Count</Text>
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
            <Text style={styles.rowLabel}>LED Type</Text>
            <Text style={styles.rowValue}>{device.led.config.type ?? '-'}</Text>
          </View>
          <View style={styles.rowContainerEdit}>
            <TouchableOpacity
              onPress={() => {
                setTypeDialogVisible(true);
              }}
            >
              <Feather name="edit" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Firmware Version</Text>
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
