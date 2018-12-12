//
// a straightforward implementation of HKDF
//
// https://tools.ietf.org/html/rfc5869
//

var crypto = require("crypto");

function zeros(length) {
  var buf = new Buffer(length);

  buf.fill(0);

  return buf.toString();
}
// imk is initial keying material
function HKDF(hashAlg, salt, ikm) {
  this.hashAlg = hashAlg;

  // create the hash alg to see if it exists and get its length
  var hash = crypto.createHash(this.hashAlg);
  this.hashLength = hash.digest().length;

  this.salt = salt || zeros(this.hashLength);
  this.ikm = ikm;

  // now we compute the PRK
  var hmac = crypto.createHmac(this.hashAlg, this.salt);
  hmac.update(this.ikm);
  this.prk = hmac.digest();
}

HKDF.prototype = {
  derive: function(info, size, cb) {
    var prev = new Buffer(0);
    var output;
    var buffers = [];
    var num_blocks = Math.ceil(size / this.hashLength);
    info = new Buffer(info);

    for (var i=0; i<num_blocks; i++) {
      var hmac = crypto.createHmac(this.hashAlg, this.prk);
      hmac.update(prev);
      hmac.update(info);
      hmac.update(new Buffer([i + 1]));
      prev = hmac.digest();
      buffers.push(prev);
    }
    output = Buffer.concat(buffers, size);

    process.nextTick(function() {cb(output);});
  }
};

module.exports = HKDF;
