import { LuxioDevice } from '@luxio-lighting/lib';
import Zeroconf from 'react-native-zeroconf'

export default class Discovery {

  devices = {};
  deviceCallbacks = new Set();

  constructor() {
    try {
      this.zeroconf = new Zeroconf();
      this.zeroconf.scan('luxio', 'tcp');
      this.zeroconf.on('resolved', service => {
        const id = service?.txt?.id;
        if (!id) return;

        const name = service.txt.name;
        if (!name) return;

        const address = service.addresses[0];
        if (!address) return;

        const version = Number.parseInt(service.txt.version);
        if (!version) return;

        if (this.devices[id]) {
          console.log(`Existing Device Discovered: ${name}`);

          this.devices[id].setAddress(service.addresses[0]);
        } else {
          console.log('New Device Discovered:', name, address);

          this.devices[id] = new LuxioDevice({
            id,
            name,
            address,
            version,
          });

          for (const callback of this.deviceCallbacks.values()) {
            callback(this.devices[id]);
          }
        }
      });
    } catch (err) {
      console.error(`Failed to initialize Discovery: ${err.message}`);
    }
  }

  getDevice(id) {
    const device = this.devices[id];
    if (!device) return null;

    return device;
  }

  getDevices() {
    return this.devices;
  }

  registerDeviceCallback(callback) {
    this.deviceCallbacks.add(callback);
  }

  unregisterDeviceCallback(callback) {
    this.deviceCallbacks.delete(callback);
  }

  enableDemo() {
    const device = new LuxioDevice({
      id: 'demo',
      name: 'Demo Luxio',
      address: '127.0.0.1',
      version: 999,
    });

    device.connect = async () => { };
    device.execute = async () => { };
    device.isConnected = () => true;
    device.system.state = {
      version: 999,
    }
    device.system.config = {
      id: 'demo',
      name: 'Demo Luxio',
    };

    device.system.setName = async ({ name }) => {
      device.system.config.name = name;
      device.__emit('system.config', device.system.config);
    };

    device.system.restart = async () => {
      throw new Error('A demo Luxio cannot restart, obviously!');
    };

    device.system.factoryReset = async () => {
      throw new Error('A demo Luxio cannot factory reset, obviously!');
    };

    device.wifi.config = {
      ssid: 'Demo Wi-Fi',
    };
    device.wifi.state = {
      ssid: 'Demo Wi-Fi',
      ip: '1.3.3.7',
      mac: 'DE:MO:DE:MO:DE:MO',
    };

    device.led.state = {
      on: true,
      brightness: 100,
      colors: [
        { r: 79, g: 255, b: 127, w: 0 },
        { r: 0, g: 210, b: 255, w: 0 },
      ],
    };
    device.led.config = {
      type: 'SK6812',
      count: 60,
      pin: 0,
    };

    device.led.setOn = async ({ on }) => {
      device.led.state.on = on;
      device.__emit('led.state', device.led.state);
    }

    device.led.setBrightness = async ({ brightness }) => {
      device.led.state.brightness = brightness;
      device.__emit('led.state', device.led.state);
    };

    device.led.setColor = async ({ r, g, b }) => {
      await device.led.setGradient({
        colors: [{ r, g, b }, { r, g, b }],
      });
    };

    device.led.setGradient = async ({ colors }) => {
      device.led.state.colors = colors;
      device.__emit('led.state', device.led.state);
    };

    this.devices['demo'] = device;

    for (const callback of this.deviceCallbacks.values()) {
      callback(this.devices['demo']);
    }
  }

}
