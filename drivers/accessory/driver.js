const Homey            = require('homey');
const { HAPAccessory } = require('./lib');
const { IPDiscovery }  = require('../../modules/hap-controller');

module.exports = class AccessoryDriver extends Homey.Driver {

  onPair(socket) {
    let discoveredAccessories = {};
    let selectedAccessory     = null;
    let pairingAccessory      = null;

    socket.on('startDiscovery', data => {
      this.log('Starting discovery...');

      const discovery = new IPDiscovery();
      discovery.on('serviceUp', accessory => {
        accessory = HAPAccessory.fromJSON(accessory);
        discoveredAccessories[accessory.id] = accessory;

        this.log('Discovered', accessory.name, '→', JSON.stringify(accessory));

        // Check if accessory has already been paired with Homey.
        const pairingData = Homey.ManagerSettings.get('pairing.data.' + accessory.id);
        if (pairingData) {
          accessory.isPaired    = true;
          accessory.pairingData = pairingData;
        } else {
          accessory.isPaired = false;
        }

        return socket.emit('accessoryFound', accessory);
      }).start();

    }).on('selectAccessory', (data, callback) => {
      const id = typeof data === 'string' ? data : null;
      if (id) {
        if (! (id in discoveredAccessories)) {
          const msg = `Trying to select undiscovered accessory with id ${ id }`;
          this.log(msg);
          return callback(Error(msg));
        }
        selectedAccessory = discoveredAccessories[id];
        this.log('Selected target:', selectedAccessory.name);
        return callback();
      } else if (! selectedAccessory) {
        const msg = `Trying to get selected accessory when none has been set`;
        this.log(msg);
        return callback(Error(msg));
      } else {
        callback(null, selectedAccessory);
      }
    }).on('pairAccessory', (data, callback) => {
      const id = typeof data === 'string' ? data : null;
      if (id) {
        if (! (id in discoveredAccessories)) {
          const msg = `Trying to pair undiscovered accessory with id ${ id }`;
          this.log(msg);
          return callback(Error(msg));
        }
        pairingAccessory = discoveredAccessories[id];
        this.log('Pairing target:', pairingAccessory.name);
        callback();
      } else if (! pairingAccessory) {
        const msg = `Trying to get pairing accessory when none has been set`;
        this.log(msg);
        return callback(Error(msg));
      } else {
        callback(null, pairingAccessory);
      }
    }).on('startPairing', async (pin, cb) => {
      this.log(`Going to pair with ${ pairingAccessory.name } using pin ${ pin }`);
      try {
        await pairingAccessory.pair(pin);
        this.log('Pairing success');

        // Save pairing data as setting.
        Homey.ManagerSettings.set('pairing.data.' + pairingAccessory.id, pairingAccessory.pairingData);

        // Set as selected accessory.
        selectedAccessory = pairingAccessory;

        // Return "Homeyfied" accessory data to pairing template.
        return cb(null, pairingAccessory.toHomey());
      } catch(e) {
        this.log('Pairing failed', e);
        return cb(e.message);
      }
    }).on('getAccessories', async (data, cb) => {
      this.log(`Going to get accessories for ${ selectedAccessory.name }`);
      if (! selectedAccessory.pairingData) {
        selectedAccessory.pairingData = Homey.ManagerSettings.get('pairing.data.' + selectedAccessory.id);
      }
      try {
        const accessories = await selectedAccessory.getAccessories();
        console.log('%j', accessories.map(a => a.toHomey()));
        return cb(null, accessories.map(a => a.toHomey()));
      } catch(e) {
        this.log('Accessory retrieval failed', e);
        return cb(e.message);
      }
    });
  }

};
