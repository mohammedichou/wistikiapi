'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeGeocoder = require('node-geocoder');

var _nodeGeocoder2 = _interopRequireDefault(_nodeGeocoder);

var _httpsadapter = require('node-geocoder/lib/httpadapter/httpsadapter');

var _httpsadapter2 = _interopRequireDefault(_httpsadapter);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var geocoderProvider = "google";
var extra = _config2.default.google.geocoder;

var geocoder = (0, _nodeGeocoder2.default)(geocoderProvider, (0, _httpsadapter2.default)(_http2.default), extra);

exports.default = geocoder;
//# sourceMappingURL=geocoder.js.map
