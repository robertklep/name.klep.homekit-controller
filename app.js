const Homey = require('homey');
const Log   = require('homey-log').Log;

module.exports = class HomeKitClientApp extends Homey.App {

  onInit() {
    this.log('HomeKitClientApp is running...');
  }

}
