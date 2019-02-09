const Homey = require('homey');
const Log   = require('homey-log').Log;

module.exports = class HomeKitControllerApp extends Homey.App {

  onInit() {
    this.log('HomeKitControllerApp is running...');
  }

}
