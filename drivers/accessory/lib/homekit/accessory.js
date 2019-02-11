const Service    = require('./service');
const { toUUID } = require('./utils');

const Accessory = module.exports = class Accessory {
  constructor({ aid, services = null }) {
    this.aid      = aid;
    this.services = services;
    this.primary  = aid === 1;
  }

  getServices() {
    return this.services;
  }

  getServiceById(iid) {
    return this.services.find(s => s.iid === iid);
  }

  getServiceByUUID(uuid) {
    return this.services.find(s => s.uuid === uuid);
  }

  getServiceByType(type) {
    return this.getServiceByUUID(toUUID(type));
  }

  getServiceByName(name) {
    return this.services.find(s => s.name === name);
  }

  getCharacteristicById(iid) {
    for (const service of this.services) {
      const characteristic = service.getCharacteristicById(iid);
      if (characteristic) return characteristic;
    }
    return null;
  }

  getCharacteristicByUUID(uuid) {
    for (const service of this.services) {
      const characteristic = service.getCharacteristicByUUID(uuid);
      if (characteristic) return characteristic;
    }
    return null;
  }

  getCharacteristicByName(name) {
    for (const service of this.services) {
      const characteristic = service.getCharacteristicByName(name);
      if (characteristic) return characteristic;
    }
    return null;
  }

  toHomey() {
    const info     = this.getServiceByName('Accessory Information');
    const _        = name => info ? (info.getCharacteristicByName(name) || {}).value : null;
    return {
      metadata : {
        name:         _('Name'),
        manufacturer: _('Manufacturer'),
        model:        _('Model'),
        serial:       _('Serial Number'),
        firmware:     _('Firmware Revision'),
      },
      devices : this.services.map(s => s.toHomey()).filter(s => s)
    };
  }
}

Accessory.fromJSON = json => {
  return new Accessory({
    aid:      json.aid,
    services: (json.services || []).map(service => Service.fromJSON(json.aid, service)),
  });
};
