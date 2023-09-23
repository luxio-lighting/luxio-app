import { useState } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, TouchableOpacity, Button } from 'react-native';
import { router, Stack } from 'expo-router';
import Dialog from 'react-native-dialog';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';

export default function LuxioDeviceSettings(props) {
  const { device } = props;

  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [nameDialogValue, setNameDialogValue] = useState(device.name);
  const [name, setName] = useState(device.name);

  const [pixelsDialogVisible, setPixelsDialogVisible] = useState(false);
  const [pixelsDialogValue, setPixelsDialogValue] = useState(String(device.pixels));
  const [pixels, setPixels] = useState(device.pixels);

  return (
    <>
      <Stack.Screen
        options={{
          title: device.name,
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
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setNameDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Save"
          bold={true}
          onPress={() => {
            Promise.resolve().then(async () => {
              device.name = nameDialogValue;
              await device.sync();
            })
              .catch(err => {
                Alert.alert('Error', err.message)
              })
              .finally(() => {
                setNameDialogVisible(false);
              });
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={pixelsDialogVisible}>
        <Dialog.Title>Pixels</Dialog.Title>
        <Dialog.Input
          value={pixelsDialogValue}
          onChangeText={setPixelsDialogValue}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setPixelsDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Save"
          bold={true}
          onPress={() => {
            Promise.resolve().then(async () => {
              device.pixels = Number(pixelsDialogValue);
              await device.sync();
            })
              .then(() => {
                setPixels(pixelsDialogValue);
                Alert.alert('Saved', 'You need to restart the device for this change to take effect.');
              })
              .catch(err => {
                Alert.alert('Error', err.message)
              })
              .finally(() => {
                setPixelsDialogVisible(false);
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
            <Text style={styles.rowValue}>{device.name ?? '-'}</Text>
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
            <Text style={styles.rowValue}>{device.version ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Wi-Fi SSID</Text>
            <Text style={styles.rowValue}>{device.wifiSsid ?? '-'}</Text>
          </View>
          <View style={styles.rowContainerEdit}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/newDevice',
                  params: {
                    id: device.id,
                  }
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
            <Text style={styles.rowValue}>{device.address ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowContainerValue}>
            <Text style={styles.rowLabel}>Wi-Fi MAC</Text>
            <Text style={styles.rowValue}>{device.id ?? '-'}</Text>
          </View>
        </View>

        <View style={{
          flexGrow: 1,
        }} />

        <Button
          title="Restart Device"
          color="#ff0000"
          onPress={() => {
            device.restart()
              .catch(console.error);
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