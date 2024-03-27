import { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, ScrollView, RefreshControl, Linking, Alert,
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { router, Stack } from 'expo-router';
import Dialog from 'react-native-dialog';
import { FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LuxioDiscovery, LuxioUtil } from '@luxio-lighting/lib';

const STATES = {
  SEARCHING_DEVICE: 'searching_device',
  SCANNING_NETWORKS: 'scanning_networks',
  RESCANNING_NETWORKS: 'rescanning_networks',
  GOT_NETWORKS: 'got_networks',
  CONNECTING: 'connecting',
};

export default function LuxioSetup(props) {
  const [device, setDevice] = useState(null);
  const [networks, setNetworks] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [ssidDialogValue, setSsidDialogValue] = useState('');
  const [ssidDialogVisible, setSsidDialogVisible] = useState(false);
  const [passDialogValue, setPassDialogValue] = useState('');
  const [passDialogVisible, setPassDialogVisible] = useState(false);
  const [state, setState] = useState(STATES.SEARCHING_DEVICE);

  const scanForNetworks = ({
    device,
  }) => {
    Promise.resolve().then(async () => {
      await device.wifi.scanNetworks();
      await LuxioUtil.wait(5000);
      let networks = await device.wifi.getNetworks()

      // Sort by RSSI
      networks.sort((a, b) => {
        return b.rssi - a.rssi;
      });

      // Remove Duplicate SSIDs
      const ssids = [];
      networks = networks.filter((network) => {
        if (ssids.includes(network.ssid)) return false;
        ssids.push(network.ssid);
        return true;
      });

      setNetworks(networks);
      setState(STATES.GOT_NETWORKS);
    }).catch(err => Alert.alert('Error Connecting', err.message));
  };

  const connectToNetwork = ({
    device,
    ssid,
    pass,
  }) => {
    console.log('connectToNetwork 1', device, { ssid, pass })
    device.wifi.connect({ ssid, pass })
      .then(() => {
        console.log('connectToNetwork 2')
        setState(STATES.CONNECTING);
      })
      .catch(err => Alert.alert('Error Connecting', err.message));
  };

  useEffect(() => {
    if (props.device) {
      setDevice(props.device);
      setState(STATES.SCANNING_NETWORKS);
      scanForNetworks({
        device: props.device,
      });
    } else {
      const pollInterval = setInterval(() => {
        Promise.resolve().then(async () => {
          const discovery = new LuxioDiscovery();
          const devices = await discovery.discoverDevices({
            ap: true,
            nupnp: false,
            mdns: false,
            timeout: 1500,
          });

          if (Object.keys(devices).length === 0) return;

          const [device] = Object.values(devices);

          clearInterval(pollInterval);
          setDevice(device);

          setState(STATES.SCANNING_NETWORKS);
          scanForNetworks({ device });
        }).catch(err => Alert.alert('Error', err.message));
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
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

      <Dialog.Container visible={ssidDialogVisible}>
        <Dialog.Title>Hidden Network</Dialog.Title>
        <Dialog.Description>Enter the Wi-Fi credentials.</Dialog.Description>
        <Dialog.Input
          value={ssidDialogValue}
          onChangeText={setSsidDialogValue}
          autoCapitalize="none"
          autoComplete="off"
          autoFocus={true}
          placeholder='SSID'
        />
        <Dialog.Input
          value={passDialogValue}
          onChangeText={setPassDialogValue}
          autoCapitalize="none"
          autoComplete="off"
          placeholder="Password"
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setSsidDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Connect"
          bold={true}
          onPress={() => {
            setSsidDialogVisible(false);
            connectToNetwork({
              device,
              ssid: ssidDialogValue,
              pass: passDialogValue || null,
            });
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={passDialogVisible}>
        <Dialog.Title>Wi-Fi Password</Dialog.Title>
        <Dialog.Description>Enter the password for {selectedNetwork?.ssid}</Dialog.Description>
        <Dialog.Input
          value={passDialogValue}
          onChangeText={setPassDialogValue}
          autoCapitalize="none"
          autoComplete="off"
          autoFocus={true}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setPassDialogVisible(false);
            setSsidDialogValue('');
          }}
        />
        <Dialog.Button
          label="Connect"
          bold={true}
          onPress={() => {
            setPassDialogVisible(false);
            connectToNetwork({
              device,
              ssid: selectedNetwork.ssid,
              pass: passDialogValue,
            });
          }}
        />
      </Dialog.Container>

      <View
        style={{
          height: '100%',
          paddingHorizontal: 24,
          paddingVertical: 48,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#333',
        }}
      >
        {state === STATES.SEARCHING_DEVICE && (
          <>
            <FontAwesome5
              name="wifi"
              color="white"
              size={48}
              style={{
                marginBottom: 12,
              }}
            />
            <Text
              style={{
                fontFamily: 'NunitoBold',
                fontSize: 28,
                color: 'white',
                marginBottom: 16,
              }}
            >Setup new Luxio</Text>
            <Text
              style={{
                fontFamily: 'NunitoSemiBold',
                fontSize: 18,
                lineHeight: 28,
                color: 'white',
                marginBottom: 36,
              }}
            >
              <Text>Connect your Wi-Fi to </Text>
              <MaterialCommunityIcons
                name="wifi-strength-4"
                size={18}
                color="white"
              />
              <Text
                style={{
                  fontFamily: 'NunitoBold',
                }}
              > Luxio-XXXXXX</Text>
              <Text>.</Text>
            </Text>
            <TouchableScale
              activeScale={0.975}
              onPress={() => {
                Linking.openSettings();
                // Promise.resolve().then(async () => {
                //   await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                //   console.log(1);
                //   // const ssid = await WifiManager.getCurrentWifiSSID();
                //   // console.log(2, 'ssid', ssid);

                //   if (Platform.OS === 'ios') {
                //     console.log(3);
                //     await WifiManager.connectToSSIDPrefix('Luxio-')
                //     console.log(4);
                //     // .then(result => {
                //     //   console.log('OK', result);
                //     // })
                //     // .catch(err => {
                //     //   console.error('ERR', err);
                //     // })
                //   }

                //   if (Platform.OS === 'android') {
                //     IntentLauncherAndroid.startActivityAsync(IntentLauncherAndroid.ACTION_WIFI_SETTINGS);
                //   }
                // }).catch(err => {
                //   console.error('ERR', err);
                // })
              }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 100,
                paddingVertical: 12,
                paddingHorizontal: 32,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowRadius: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: 'NunitoBold',
                  fontSize: 18,
                  color: 'black',
                }}
              >Open Settings</Text>
            </TouchableScale>
          </>
        )}

        {state === STATES.SCANNING_NETWORKS && (
          <>
            <ActivityIndicator
              color="white"
              size="large"
              style={{
                marginBottom: 12,
              }}
            />
            <Text
              style={{
                fontFamily: 'NunitoBold',
                fontSize: 28,
                color: 'white',
                marginBottom: 16,
              }}
            >{device.name}</Text>
            <Text
              style={{
                fontFamily: 'NunitoSemiBold',
                fontSize: 18,
                lineHeight: 28,
                color: 'white',
                marginBottom: 36,
              }}
            >Scanning for Wi-Fi Networks...</Text>
          </>
        )}

        {(state === STATES.GOT_NETWORKS || state === STATES.RESCANNING_NETWORKS) && (
          <>
            <Text
              style={{
                fontFamily: 'NunitoBold',
                fontSize: 28,
                color: 'white',
                marginBottom: 16,
              }}
            >Wi-Fi Network</Text>
            <Text
              style={{
                fontFamily: 'NunitoSemiBold',
                fontSize: 18,
                lineHeight: 28,
                color: 'white',
                marginBottom: 36,
              }}
            >Please select your Wi-Fi network.</Text>

            <ScrollView
              style={{
                width: '100%',
              }}
              refreshControl={<RefreshControl
                tintColor={'#fff'}
                progressBackgroundColor={'#fff'}
                refreshing={state === STATES.RESCANNING_NETWORKS}
                onRefresh={() => {
                  setState(STATES.RESCANNING_NETWORKS);
                  scanForNetworks({ device });
                }}
              />}
            >
              {networks.map((network) => (
                <View
                  key={network.ssid}
                  style={{
                    paddingVertical: 12,
                    borderBottomColor: '#ffffff33',
                    borderBottomWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 12,
                    }}
                    onPress={() => {
                      setSelectedNetwork(network);

                      if (network.encryption) {
                        setSsidDialogValue(network.ssid);
                        setPassDialogVisible(true);
                      } else {
                        connectToNetwork({
                          device,
                          ssid: network.ssid,
                          pass: null,
                        });
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{
                        marginRight: 12,
                      }}
                      name={(() => {
                        if (network.security && network.rssi < -70) return 'wifi-strength-1-lock';
                        if (network.security && network.rssi < -60) return 'wifi-strength-2-lock';
                        if (network.security && network.rssi < -50) return 'wifi-strength-3-lock';
                        if (network.security) return 'wifi-strength-4-lock';
                        if (network.rssi < -70) return 'wifi-strength-1';
                        if (network.rssi < -60) return 'wifi-strength-2';
                        if (network.rssi < -50) return 'wifi-strength-3';
                        return 'wifi-strength-4';
                      })()}
                      size={24}
                      color="white"
                    />
                    <Text
                      style={{
                        fontFamily: 'NunitoBold',
                        fontSize: 16,
                        color: 'white',
                      }}
                    >{network.ssid}</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                key="hidden"
                style={{
                  flexDirection: 'row',
                  paddingVertical: 24,
                }}
                onPress={() => {
                  setSsidDialogVisible(true);
                }}
              >
                <MaterialCommunityIcons
                  style={{
                    marginRight: 12,
                  }}
                  name="wifi-strength-outline"
                  size={24}
                  color="white"
                />
                <Text
                  style={{
                    fontFamily: 'NunitoBold',
                    fontSize: 16,
                    color: 'white',
                  }}
                >Hidden Network</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}

        {state === STATES.CONNECTING && (
          <>
            <Text
              style={{
                fontFamily: 'NunitoBold',
                fontSize: 28,
                color: 'white',
                marginBottom: 16,
              }}
            >Connecting...</Text>
            <Text
              style={{
                fontFamily: 'NunitoSemiBold',
                fontSize: 18,
                lineHeight: 28,
                color: 'white',
                marginBottom: 36,
              }}
            >
              <Text>Luxio is connecting to </Text>
              <MaterialCommunityIcons
                name="wifi-strength-4"
                size={18}
                color="white"
              />
              <Text
                style={{
                  fontFamily: 'NunitoBold',
                }}
              > {ssidDialogValue}</Text>
              <Text>
                {'\n\n'}If the connection was succesful, this Luxio can be found on your Wi-Fi network.
                {`\n\n`}You can now close this dialog.</Text>
            </Text>
          </>
        )}
      </View >
    </>
  );
}
