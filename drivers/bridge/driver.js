const Homey      = require('homey');
const BaseDriver = require('../base-driver');

module.exports = class BridgeDriver extends BaseDriver {

  isAcceptableDevice(device) {
    return device.category === 'Bridge';
  }

};
