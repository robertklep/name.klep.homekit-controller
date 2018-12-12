const Homey = require('homey');
const {HttpClient, IPDiscovery} = require('hap-controller');

const discovery = new IPDiscovery();

const pin = '668-55-459';

module.exports = class HomeKitClientApp extends Homey.App {

  onInit() {
    this.log('HomeKitClientApp is running...');

    discovery.on('serviceUp', (service) => {
      if (service.name !== 'TRADFRI gateway') return;
      console.log('Found device!', service);

      const client = new HttpClient(service.id, service.address, service.port);
      client.pairSetup(pin).then(() => {
        console.log('Paired! Keep the following pairing data safe:');
        console.log(JSON.stringify(client.getLongTermData(), null, 2));
      }).catch((e) => console.error(e));
    });
    discovery.start();

  }

}
