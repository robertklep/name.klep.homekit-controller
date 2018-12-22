/* global Homey */
void function() {
  if (! Homey.isMock) return;

  const BASE_TIMEOUT = 1000;
  const MOCK_DEVICES = [
    {"name":"TRADFRI gateway", isPaired: true, "address":"192.168.1.100","port":80,"id":"31:33:70:31:33:70","configurationNumber":123,"featureFlags":1,"modelName":"TRADFRI gateway","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
    {"name":"Homey","address":"192.168.1.105","port":51826,"id":"CC:22:CC:22:CC:22","configurationNumber":39,"featureFlags":0,"modelName":"Homey","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
    {"name":"TRADFRI gateway", isPaired: true, "address":"::1","port":80,"id":"31:33:70:31:33:70","configurationNumber":123,"featureFlags":1,"modelName":"TRADFRI gateway","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
  ];

  // Emit accessories
  Homey.registerOnHandler('accessoryFound', (ev, fn) => {
    let timeout = BASE_TIMEOUT;
    for (const device of MOCK_DEVICES) {
      setTimeout(() => {
        fn(device);
      }, timeout += 1000);
    }
  });

  // Handle setting/getting pairing target.
  let pairingTarget = null;
  Homey.registerEmitHandler('setPairingTarget', (ev, target, fn) => {
    pairingTarget = MOCK_DEVICES.find(device => device.id === target);
    fn();
  });

  Homey.registerEmitHandler('getPairingTarget', (ev, data, fn) => {
    fn(null, pairingTarget || MOCK_DEVICES.find(device => ! device.isPaired));
  });

  // Mock the pairing process.
  Homey.registerEmitHandler('startPairingProcess', (ev, data, fn) => {
    const device = pairingTarget || MOCK_DEVICES.find(device => ! device.isPaired);
    setTimeout(() => {
      fn(null, {
        data:         { id : device.id },
        name:         device.name,
        capabilities: [],
        settings:     {},
      });
    }, 3000);
  });
}();
