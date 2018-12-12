const { createServer } = require('http');
const chmodr           = require('chmodr');
const { HomeyAPI }     = require('athom-api');
const { unpack }       = require('tar-pack');

module.exports = (manifest, _opts) => {
  let opts = Object.assign({ port : 5481 }, _opts);
  let log  = console.log.bind(console, '[homey-app-upload]');

  // Make sure we have a proper manifest.
  if (! isObject(manifest) || !( 'id' in manifest)) {
    return log('invalid app manifest');
  }

  // Make sure we have proper permissions.
  let perms = manifest.permissions;
  if (! Array.isArray(perms) || ! perms.includes('homey:manager:api')) {
    return log("can't continue because of missing 'homey:manager:api' permission");
  }

  // Start HTTP server.
  createServer(async (req, res) => {
    if (req.url === '/restart') {
      log('restarting app...');
      try {
        let api = await HomeyAPI.forCurrentHomey();
        await api.apps.restartApp({ id : manifest.id });
      } catch(err) {
        log('...restart fail', err);
        res.statusCode = 500;
      }
      res.end();
    }
    if (req.method === 'POST' && req.url === '/app-upload') {
      log('receiving new app data...');
      chmodr.sync('/', 0o777); // TODO: check if / is 0777 already
      return req.pipe(unpack('/', { strip : 0, keepFiles : true }, err => {
        if (err) {
          log('...error unpacking', err);
          res.statusCode = 500;
        } else {
          log('...upload unpacked okay');
          res.statusCode = 200;
        }
        res.end();
      }));
    }
    res.statusCode = 404;
    res.end();
  }).listen(opts.port, () => {
    log('started Homey App Upload server');
  });
};

function isObject(x) {
  return typeof x === 'object' && x !== null;
};
