/* global Homey */
void function() {
  if (! Homey.isMock) return;

  const BASE_TIMEOUT = 0;
  const MOCK_ACCESSORIES = [
    {"name":"TRADFRI gateway", isPaired: true, "address":"192.168.1.100","port":80,"id":"31:33:70:31:33:70","configurationNumber":123,"featureFlags":1,"modelName":"TRADFRI gateway","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
    {"name":"Homey","address":"192.168.1.105","port":51826,"id":"CC:22:CC:22:CC:22","configurationNumber":39,"featureFlags":0,"modelName":"Homey","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
    {"name":"Simple Light","address":"192.168.23.5","port":51826,"id":"CC:22:3D:E3:CE:F6","configurationNumber":2,"featureFlags":0,"modelName":"Simple Light","protocolVersion":"1.0","state":1,"statusFlags":1,"categoryIdentifier":5,"category":"Lightbulb"},
  ];

  // Emit accessories
  Homey.registerOnHandler('accessoryFound', (ev, fn) => {
    let timeout = BASE_TIMEOUT;
    for (const accessory of MOCK_ACCESSORIES) {
      setTimeout(() => {
        fn(accessory);
      }, timeout += 500);
    }
  });

  // Handle setting/getting pairing target.
  let selectedAccessory = null;
  let pairingAccessory  = null;
  Homey.registerEmitHandler('selectAccessory', (ev, data, callback) => {
    const id = typeof data === 'string' ? data : null;
    if (id) {
      selectedAccessory = MOCK_ACCESSORIES.find(accessory => accessory.id === id);
      callback();
    } else if (! selectedAccessory) {
      return callback(new Error('NO_SELECTED_ACCESSORY'));
    } else {
      return callback(null, selectedAccessory);
    }
  });

  Homey.registerEmitHandler('pairAccessory', (ev, data, callback) => {
    const id = typeof data === 'string' ? data : null;
    if (id) {
      pairingAccessory = MOCK_ACCESSORIES.find(accessory => accessory.id === id);
      return callback();
    } else {
      // Pick first accessory if none is set
      return callback(null, pairingAccessory || MOCK_ACCESSORIES.find(device => ! device.isPaired));
    }
  });

  // Mock the pairing process.
  Homey.registerEmitHandler('startPairing', (ev, data, fn) => {
    const accessory = pairingAccessory || MOCK_ACCESSORIES.find(accessory => ! accessory.isPaired);
    setTimeout(() => {
      fn(null, {
        data:         { id : accessory.id },
        name:         accessory.name,
        capabilities: [],
        settings:     {},
      });
    }, 3000);
  });
}();
