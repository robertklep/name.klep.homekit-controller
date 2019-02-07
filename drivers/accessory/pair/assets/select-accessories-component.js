/* global Vue Homey */
window.SelectAccessoriesComponent = Vue.component('select.accessories', {
  template: '#select-accessories-template',
  mounted() {
    Homey.emit('getAccessories', this.bridge, (err, accessories) => {
      if (err) {
        console.log(err);
        return Homey.alert('Received an error retrieving accessories');
      }
      console.log('accessories');
      console.log(JSON.stringify(accessories, null, 2));
      this.accessories = accessories;
    });
  },
  data() {
    return {
      bridge:      this.$root.$data.selectedBridge,
      accessories: null,
    };
  }
});
