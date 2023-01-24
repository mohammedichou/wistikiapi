'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _errors = require('../modules/errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service for Firmwares
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
  * TODO: Description
  * @param params
  * @param callback
  */
	find: function find(params, callback) {
		return new _promise2.default(function (resolve, reject) {
			reject(new _errors.MethodNotImplemented());
		});
	},

	/**
  * Get user by id. Throws an error if none can be found
  *
  * @param id requested user id
  * @param params
  * @param callback
  */
	get: function get(id, params, callback) {
		return new _promise2.default(function (resolve, reject) {
			reject(new _errors.MethodNotImplemented());
		});
	},

	/**
  * TODO: Description
  * @param data
  * @param params
  * @param callback
  */
	create: function create(data, params, callback) {
		return new _promise2.default(function (resolve, reject) {
			reject(new _errors.MethodNotImplemented());
		});
	},

	/**
  * TODO: Description
  * @param id
  * @param data
  * @param params
  * @param callback
  */
	update: function update(id, data, params, callback) {
		return new _promise2.default(function (resolve, reject) {
			reject(new _errors.MethodNotImplemented());
		});
	},

	/**
  * TODO: Description
  * @param id
  * @param data
  * @param params
  * @param callback
  */
	patch: function patch(id, data, params, callback) {
		return new _promise2.default(function (resolve, reject) {
			reject(new _errors.MethodNotImplemented());
		});
	},

	/**
  * TODO: Description
  * @param id
  * @param params
  * @param callback
  */
	remove: function remove(id, params, callback) {
		return new _promise2.default(function (resolve, reject) {
			reject(new _errors.MethodNotImplemented());
		});
	},

	/**
  * TODO: Description
  * @param app
  * @param path
  */
	setup: function setup(app, path) {
		this.app = app;
		this.errors = this.app.errors;
		//Bind the apps service method to service to always look services up dynamically
		this.service = app.service.bind(app);
		this.filter(function (data, connection) {
			return false;
		});
	}
};

exports.default = Service;
//# sourceMappingURL=firmwares.js.map
