import { LuxioDiscovery } from '@luxio-lighting/lib';

export default class Discovery {

  constructor() {
    this.discovery = new LuxioDiscovery();
  }

  getDevice(id) {
    const devices = this.getDevices();
    return devices[id] ?? null;
  }

  getDevices() {
    // return dummyDevices;
    return this.discovery.getDevices();
  }

  async discoverDevices() {
    await this.discovery.discoverDevices();
    return this.getDevices();
  }

}

const dummy1 = {
  id: 'AA:BB:CC:DD:EE:FF',
  name: 'Luxio Bedroom',
  on: true,
  brightness: 1,
  gradient: ['#4FFF7F', '#00D2FF'],
  pixels: 60,
  version: 33,
  wifiSsid: 'Home Wi-Fi',
  address: '192.168.0.100',
  async sync() {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }
};
const dummy2 = {
  id: 'dummy2',
  name: 'Luxio Hallway',
  on: true,
  brightness: 0.75,
  gradient: ['#E0B35C', '#FFAAFF'],
  async sync() {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }
};
const dummy3 = {
  id: 'dummy3',
  name: 'Luxio Kitchen',
  on: false,
  brightness: 1,
  gradient: ['#4FFF7F', '#00D2FF'],
  async sync() {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }
};

const dummyDevices = {
  [dummy1.id]: dummy1,
  [dummy2.id]: dummy2,
  [dummy3.id]: dummy3,
}