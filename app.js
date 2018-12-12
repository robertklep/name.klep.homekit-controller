const Homey           = require('homey');
const Log             = require('homey-log').Log;
const HomeyAppUpload  = require('homey-app-upload-lib');

module.exports = class HomeKitClientApp extends Homey.App {

  onInit() {
    this.log('HomeKitClientApp is running...');
    if (Homey.env.UPLOADER) {
      HomeyAppUpload(this.manifest);
    }
  }

}
