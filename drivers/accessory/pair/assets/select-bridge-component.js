/* global Vue Homey */
window.SelectBridgeComponent = Vue.component('select-bridge', {
  template: '#select-bridge-template',
  data() {
    return { bridges: null }
  },
  mounted() {
    Homey.emit('getBridges', (err, bridges) => {
      if (err) {
        console.log(err);
        return Homey.alert('Received an error retrieving bridges');
      }
      this.bridges = bridges;
    });
  },
  methods : {
    selectBridge(bridge) {
      console.log('selected', bridge.id);
      this.$root.$data.selectedBridge = bridge;
      this.$root.$data.currentPage    = 'select-accessories';
    }
  }
});
