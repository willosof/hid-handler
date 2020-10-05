'use strict';

var legacyUtil = require('util')
  , fs = require('fs')
  , p = require('hw-promise')
  , assert = require('assert')
  , HID = require(process.env['TRAVIS'] ? './fake/node-hid' : 'node-hid')
  , _ = require('lodash')
  , util;

p.promisifyAll(fs);

util = {
  decToHex: function (dec) {
    var hex = typeof dec === 'number' ? dec.toString(16) : dec;
    hex = _.padstart(hex.toUpperCase(), 2, '0');
    return hex;
  },
  getDeviceKey: function (vendorId, productId) {
    var deviceKey;
    if (typeof productId === 'undefined' && typeof vendorId === 'object') {
      (function (device) {
        vendorId = device.vendorId;
        productId = device.productId;
      })(vendorId);
    }
    assert.ok(vendorId, 'vendorId is not ok');
    assert.ok(productId, 'productId is not ok');
    deviceKey = {
      vendorId: _.padstart(vendorId.toString(16), 4, '0'),
      productId: _.padstart(productId.toString(16), 4, '0')
    };
    deviceKey.toString = function () {
      return [this.vendorId, this.productId].join(':');
    };
    return deviceKey;
  },
  hasBit: function (value, bit) {
    /* jshint -W016: true */
    return !!(value & Math.pow(2, bit));
  },
  hexToDec: function (hex) {
    return parseInt(util.format('0x%s', hex), 16);
  },
  isEmpty: function (o) {
    if (Array.isArray(o) || typeof o === 'string') {
      return o.length === 0;
    } else if (typeof o === 'object') {
      return Object.keys(o).length === 0 || _.compact(_.values(o)).length === 0;
    } else {
      return !o;
    }
  },
  logObject: function (o) {
    return util.inspect(o, {depth: null});
  },
  scanDevices: function () {
    return HID.devices();
  }
};

Object.keys(legacyUtil).forEach(function (key) {
  if (typeof legacyUtil[key] === 'function' && typeof util[key] === 'undefined') {
    util[key] = legacyUtil[key].bind(legacyUtil);
  }
});

exports = module.exports = util;
