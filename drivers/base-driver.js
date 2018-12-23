const Homey           = require('homey');
const { IPDiscovery } = require('../modules/hap-controller');
const { Device }      = require('../lib');

module.exports = class BaseDriver extends Homey.Driver {

  // Should be overloaded by specific driver.
  isAcceptableDevice() {
    return false;
  }

  onPair(socket) {
    let discoveredDevices = {};
    let pairingTarget     = null;

    socket.on('startDiscovery', data => {
      this.log('Starting discovery...');

      const discovery = new IPDiscovery();
      discovery.on('serviceUp', accessory => {
        const device = Device.fromJSON(accessory);
        if (! this.isAcceptableDevice(device)) return;

        discoveredDevices[device.id] = device;

        this.log('  - got accessory:', accessory.name);
        this.log('                 :', JSON.stringify(device));

        // Check if device has already been paired with Homey.
        device.isPaired = this.getDevice({ id : device.id }) instanceof Homey.Device;

        return socket.emit('accessoryFound', device);
      }).start();

    }).on('setPairingTarget', (id, cb) => {
      if (! (id in discoveredDevices)) {
        const msg = `Trying to set undiscovered device with id ${ id } as pairing target`;
        this.log(msg);
        return cb(Error(msg));
      }
      pairingTarget = discoveredDevices[id];
      this.log('Setting pairing target:', pairingTarget.name);
      cb();
    }).on('getPairingTarget', (data, cb) => {
      if (! pairingTarget) {
        const msg = `Trying to get pairing target when none has been set`;
        this.log(msg);
        return cb(Error(msg));
      }
      this.log('Getting pairing target:', pairingTarget);
      cb(null, pairingTarget);
    }).on('startPairingProcess', async (pin, cb) => {
      this.log(`Going to pair with ${ pairingTarget.name } using pin ${ pin }`);
      try {
        await pairingTarget.pair(pin);
        this.log('Pairing success');
        return cb(null, pairingTarget.toHomey());
      } catch(e) {
        this.log('Pairing failed', e);
        return cb(e.message);
      }
    });
  }

};

