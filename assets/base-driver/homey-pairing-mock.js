if (! window.Homey) {
  window.Homey = new (class Homey {
    constructor() {
      this.isMock       = true;
      this.zone         = null;
      this._nextView    = null;
      this._prevView    = null;
      this.viewOptions  = {};
      this.emitHandlers = {};
      this.onHandlers   = {};
    }

    // Mock API
    registerEmitHandler(event, fn) {
      this.emitHandlers[event] = fn;
    }

    registerOnHandler(event, fn) {
      this.onHandlers[event] = fn;
    }

    setZone(zone) {
      this.zone = zone;
    }

    setNextView(view) {
      this._nextView = view;
    }

    setPrevView(view) {
      this._prevView = view;
    }

    setOptions(viewId, opts) {
      this.viewOptions[viewId] = opts;
    }

    // Regular API.
    emit(event, ...args) {
      const [ data, callback ] = args.length >= 2 ? args : [ {}, args[0] ];
      let handler = this.emitHandlers[event];
      handler && handler(event, data, callback);
    }

    on(event, cb) {
      let handler = this.onHandlers[event];
      handler && handler(event, cb);
    }

    setTitle(title) {
    }

    showView(view) {
      if (! view) {
        return this.alert('View not set', 'error');
      }
      location = view + '.html';
    }

    prevView() {
      return this.showView(this._prevView);
    }

    nextView() {
      return this.showView(this._nextView);
    }

    addDevice(device, cb) {
      console.log('should add device', device);
      return cb();
    }

    getZone(cb) {
      return cb(null, this.zone);
    }

    getOptions(viewId, cb) {
      return cb(null, this.viewOptions[viewId]);
    }

    setNavigationClose() {
      return this.done();
    }

    done() {
      return this.alert('Done', 'info');
    }

    alert(msg, icon, cb) {
      if (typeof icon === 'function') cb = icon, icon = null;
      alert(msg);
      cb && cb();
    }

    confirm(msg, icon, cb) {
      if (typeof icon === 'function') cb = icon, icon = null;
      let ret = confirm(msg);
      cb && cb(null, ret);
    }

    popup(url, { width = 400, height = 400 } = {}) {
      window.open(url, '', `width=${ width },height=${ height }`);
    }

    __(key, tokens) {
      return key;
    }
  })();
}
