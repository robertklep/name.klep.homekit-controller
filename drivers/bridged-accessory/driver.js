const Homey      = require('homey');
const BaseDriver = require('../base-driver/driver');

module.exports = class BridgedAccessoryDriver extends BaseDriver {

  onPair(socket) {
    socket.on('getBridges', (data, cb) => {
      // Retrieve paired bridges.
      const driver = Homey.ManagerDrivers.getDriver('bridge');

      cb(null, driver.getDevices());
    });
    return super.onPair(socket);
  }

  isAcceptableDevice(device) {
    return device.category !== 'Bridge';
  }

}
