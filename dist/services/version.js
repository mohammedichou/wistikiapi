'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JwtStrategy = require('passport-jwt').Strategy;


/**
 * Service for Wistikis
 * @type {{
 * find: (function(*, *)),
 * get: (function(*, *, *)),
 * create: (function(*, *, *)),
 * update: (function(*, *, *, *)),
 * patch: (function(*, *, *, *)),
 * remove: (function(*, *, *)),
 * setup: (function(*=, *))
 * }}
 */

var Service = {

	/**
  * Position service
  * @param params
  * @param callback
  */
	find: function find(params, callback) {
		return _promise2.default.resolve({
			version: _package2.default.version,
			environment: process.env.NODE_ENV,
			build: process.env.BUILD_REV ? process.env.BUILD_REV.replace(/(?:\r\n|\r|\n)/g, '') : 'N.C'
		});
	},

	/**
  * TODO: Description
  * @param app
  * @param path
  */
	setup: function setup(app, path) {
		this.app = app;
		//Bind the apps service method to service to always look services up dynamically
		this.service = app.service.bind(app);
		this.filter(function (data, connection) {
			return false;
		});
	}
};

exports.default = Service;
//# sourceMappingURL=version.js.map
