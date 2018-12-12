const assert              = require('assert');
const { toUUID }          = require('./utils');
const { Characteristics } = require('./data/hap-types.json');
const MAPPING             = require('./data/characteristics-to-capabilities.json');

const Characteristic = module.exports = class Characteristic {
  constructor(o) {
    Object.assign(this, o);
    this.uuid = toUUID(this.type);

    // Look up characteristic in HAP types table.
    const characteristic = Characteristics.find(c => c.UUID === this.uuid);
    assert(characteristic);
    this.name = characteristic.Name;
  }

  hasPermission(p) {
    return this.perms.includes(Characteristic.PERMISSIONS[p] || p);
  }

  toHomey() {
    return MAPPING[this.name];
  }
}

Characteristic.fromJSON = json => new Characteristic(json);

Characteristic.PERMISSIONS = {
  PAIRED_READ:     'pr',
  PAIRED_WRITE:    'pw',
  EVENTS:          'ev',
  ADDITIONAL_AUTH: 'aa',
  TIMED_WRITE:     'tw',
  HIDDEN:          'hd',
};
