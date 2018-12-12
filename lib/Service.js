const assert         = require('assert');
const { toUUID }     = require('./utils');
const Characteristic = require('./Characteristic');
const { Services }   = require('./data/hap-types.json');
const MAPPING        = require('./data/services-to-classes.json');

const Service = module.exports = class Service {
  constructor({ iid, type, characteristics = null, hidden = false, primary = false }) {
    this.iid             = iid;
    this.type            = type;
    this.uuid            = toUUID(type);
    this.characteristics = characteristics;
    this.hidden          = hidden;
    this.primary         = primary;

    // Look up service in HAP types table.
    const service = Services.find(s => s.UUID === this.uuid);
    assert(service);
    this.name = service.Name;
  }

  getCharacteristics() {
    return this.characteristics;
  }

  getCharacteristicById(iid) {
    return this.characteristics.find(c => c.iid === iid);
  }

  getCharacteristicByUUID(uuid) {
    return this.characteristics.find(c => c.uuid === uuid);
  }

  getCharacteristicByName(name) {
    return this.characteristics.find(c => c.name === name);
  }

  toHomey() {
    if (! MAPPING[this.name]) return null;
    // TODO: use accessory information
    return {
      class        : MAPPING[this.name],
      capabilities : this.characteristics.map(c => c.toHomey()).filter(s => s),
    }
  }
}

Service.fromJSON = json => {
  return new Service({
    iid:             json.iid,
    type:            json.type,
    characteristics: json.characteristics.map(characteristic => Characteristic.fromJSON(characteristic))
  });
};
