const assert         = require('assert');
const { HttpClient } = require('../../../modules/hap-controller');
const { Accessory }  = require('./homekit');

const CATEGORIES = {
  1: 'Other', 2: 'Bridge', 3: 'Fan', 4: 'Garage',
  5: 'Lightbulb', 6: 'Door Lock', 7: 'Outlet', 8: 'Switch', 9: 'Thermostat',
  10: 'Sensor', 11: 'Security System', 12: 'Door', 13: 'Window',
  14: 'Window Covering', 15: 'Programmable Switch', 16: 'Range Extender',
  17: 'IP Camera', 18: 'Video Door Bell', 19: 'Air Purifier'
};

const PAIRING_ERRORS = {
  0x01 : 'Unknown Error',
  0x02 : 'Authentication Error',
  0x03 : 'Backoff Error',
  0x04 : 'MaxPeers Error',
  0x05 : 'MaxTries Error',
  0x06 : 'Unavailable Error',
  0x07 : 'Busy Error',
};

const HAPAccessory = module.exports = class HAPAccessory {
  constructor(data) {
    this.name                = data.name;
    this.address             = data.address;
    this.port                = data.port;
    this.id                  = data.id;
    this.configurationNumber = data['c#'];
    this.featureFlags        = data.ff;
    this.modelName           = data.md;
    this.protocolVersion     = data.pv;
    this.state               = data['s#'];
    this.statusFlags         = data.sf;
    this.categoryIdentifier  = data.ci;
    this.category            = CATEGORIES[data.ci] || 'Reserved';
  }

  async pair(pin) {
    const client = new HttpClient(this.id, this.address, this.port);
    try {
      await client.pairSetup(pin);
      this.pairingData = client.getLongTermData();
      console.log('pairing data', this.pairingData);
      return this;
    } catch(e) {
      e = e || Error(PAIRING_ERRORS[0x01]);
      console.log('pairing error', e);
      throw e;
    }
  }

  async getAccessories() {
    assert(this.pairingData, 'NO_PAIRING_DATA');
    const client      = new HttpClient(this.id, this.address, this.port, this.pairingData);
    const accessories = await client.getAccessories();
    if ('accessories' in accessories) {
      return accessories.accessories.map(acc => Accessory.fromJSON(acc));
    }
    return [];
  }

  toHomey() {
    return {
      data:         { id : this.id },
      name:         this.name,
      capabilities: [],
      store:        this,
    };
  }
}

HAPAccessory.fromJSON = json => new HAPAccessory(json);
