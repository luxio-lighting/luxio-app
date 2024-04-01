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

}
