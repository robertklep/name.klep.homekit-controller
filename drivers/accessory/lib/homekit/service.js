const assert         = require('assert');
const { toUUID }     = require('./utils');
const Characteristic = require('./characteristic');
const { Services }   = require('./data/hap-types.json');
const MAPPING        = require('./data/services-to-classes.json');

const Service = module.exports = class Service {
  constructor({ aid, iid, type, characteristics = null, hidden = false, primary = false }) {
    this.aid             = aid;
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

    // Determine name based on Name characteristic
    let name = this.getCharacteristicByName('Name');
    name = name ? name.value : this.name;

    // TODO: use accessory information
    return {
      name  : name,
      class : MAPPING[this.name],
      data  : {
        id  : `${ this.aid }:${ this.iid }`,
        aid : this.aid,
        iid : this.iid
      },
      capabilities : this.characteristics.map(c => c.toHomey()).filter(s => s),
    }
  }
}

Service.fromJSON = (aid, json) => {
  return new Service({
    aid:             aid,
    iid:             json.iid,
    type:            json.type,
    characteristics: (json.characteristics || []).map(characteristic => Characteristic.fromJSON(aid, json.iid, characteristic))
  });
};
