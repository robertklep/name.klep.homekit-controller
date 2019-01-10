const Homey      = require('homey');
const BaseDriver = require('../base-driver/driver');

module.exports = class BridgedAccessoryDriver extends BaseDriver {

  onPair(socket) {
    const driver = Homey.ManagerDrivers.getDriver('bridge');

    socket.on('getBridges', (data, cb) => {
      // Retrieve paired bridges from driver and pass the contents of their
      // store (which contains all relevant information for display purposes).
      cb(null, driver.getDevices().map(d => d.getStore()));
    });
    return super.onPair(socket);
  }

  isAcceptableDevice(device) {
    return device.category !== 'Bridge';
  }

}
