'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _errors = require('../modules/errors');

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service for Softwares
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
			reject(new MethodNotImplemented());
		});
	},

	/**
  * Get software by id. Throws an error if none can be found
  *
  * @param id requested user id
  * @param params
  * @param callback
  */
	get: function get(id, params, callback) {
		var _this = this;

		return new _promise2.default(function (resolve, reject) {
			_db.Software.findById(id).then(function (software) {
				return !software ? reject(new _this.errors.NotFound('Software ' + id + ' not found')) : resolve(software);
			}).catch(function (err) {
				return reject(new _this.errors.FeathersError(err));
			});
		});
	},

	/**
  * TODO: Description
  * @param data
  * @param params
  * @param callback
  */
	create: function create(data, params, callback) {
		var _this2 = this;

		return new _promise2.default(function (resolve, reject) {
			_db.Software.findById(data.version).then(function (software) {

				if (software) {
					return reject(new _this2.errors.Conflict('Software ' + data.version + ' already exist'));
				}

				_db.Model.findById(data.model_id).then(function (model) {
					if (!model) {
						reject(new _this2.errors.BadRequest('Software ' + data.model_id + ' doesn\'t exist'));
					}

					_db.Software.create(data).then(function (software) {
						return resolve(software);
					}).catch(function (err) {
						return reject(new _this2.errors.FeathersError(err));
					});
				}).catch(function (err) {
					return reject(new _this2.errors.FeathersError(err));
				});
			}).catch(function (err) {
				return reject(new _this2.errors.FeathersError(err));
			});
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
		var _this3 = this;

		return new _promise2.default(function (resolve, reject) {
			_db.Software.findById(data.version).then(function (software) {

				if (!software) {
					return reject(new _this3.errors.NotFound('Model ' + data.version + ' doesn\'t exist'));
				}

				if (id != data.version) {
					return reject(new _this3.errors.BadRequest('Version ' + id + ' in url is different of version in software object (' + data.version + ')'));
				}

				_db.Software.update(data, { where: { version: id } }).then(function (software) {
					_db.Software.findById(id).then(function (software) {
						return resolve(software);
					}).catch(function (err) {
						return reject(new _this3.errors.FeathersError(err));
					});
				}).catch(function (err) {
					return reject(new _this3.errors.FeathersError(err));
				});
			}).catch(function (err) {
				return reject(new _this3.errors.FeathersError(err));
			});
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
			reject(new MethodNotImplemented());
		});
	},

	/**
  * TODO: Description
  * @param id
  * @param params
  * @param callback
  */
	remove: function remove(id, params, callback) {
		var _this4 = this;

		return new _promise2.default(function (resolve, reject) {
			_db.Software.findById(id).then(function (software) {

				if (!software) {
					reject(new _this4.errors.NotFound('Software ' + id + ' not found'));
				}

				_db.Software.destroy({ where: { version: id } }).then(resolve(new _errors.NoContent('Software ' + id + ' deleted with success'))).catch(function (err) {
					return reject(new _this4.errors.FeathersError(err));
				});
			}).catch(function (err) {
				return reject(new _this4.errors.FeathersError(err));
			});
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
//# sourceMappingURL=software.js.map
