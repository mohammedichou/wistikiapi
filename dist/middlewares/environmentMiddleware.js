'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (req, res, next) {
	debug('request url: ', req.url);
	if (process.env.NODE_ENV == "development") return next();

	if (req.url && req.url.startsWith('/swagger')) {
		debug('request: ', req);
		debug('request headers: ', req.headers);
		debug('request ip: ', req.ip);
		debug('request x-forwarded-for ip: ', req.headers['x-forwarded-for']);
		if (_config2.default.swagger && _config2.default.swagger.firewall && _config2.default.swagger.firewall.allow) {
			if (_lodash2.default.indexOf(_config2.default.swagger.firewall.allow, req.ip) == -1 && _lodash2.default.indexOf(_config2.default.swagger.firewall.allow, req.headers['x-forwarded-for']) == -1) {
				debug('page restricted');
				return next(new _feathersErrors2.default.Unavailable('Page restricted'));
			}
		}
	}
	next();
};

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:middlewares:environment');
//# sourceMappingURL=environmentMiddleware.js.map
