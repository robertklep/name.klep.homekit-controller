/* global Homey */
void function() {
  if (! Homey.isMock) return;
  const BRIDGES = [
    {"name":"TRADFRI gateway", "address":"192.168.1.100","port":80,"id":"31:33:70:31:33:70","configurationNumber":123,"featureFlags":1,"modelName":"TRADFRI gateway","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
    {"name":"Homey","address":"192.168.1.105","port":51826,"id":"CC:22:CC:22:CC:22","configurationNumber":39,"featureFlags":0,"modelName":"Homey","protocolVersion":"1.0","state":1,"statusFlags":0,"categoryIdentifier":2,"category":"Bridge"},
  ];

  const ACCESSORIES = [];

  Homey.registerEmitHandler('getBridges', (ev, cb) => {
    setTimeout(() => cb(null, Object.assign([], BRIDGES)), 1000);
  });

  Homey.registerEmitHandler('getAccessories', (ev, id, cb) => {
    setTimeout(() => cb(null, Object.assign([], ACCESSORIES)), 1000);
  });

}();
