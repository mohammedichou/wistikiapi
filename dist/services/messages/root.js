'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _db = require('../../db');

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _aclMiddleware = require('../../middlewares/aclMiddleware');

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
	/**
  * Returns all messages stored in db
  *
  * @param params
     */
	find: function find(params) {
		return _promise2.default.reject(new _index2.default.NotImplemented('METHOD_NOT_IMPLEMENTED'));
	},


	/**
  *
  * @param id
  * @param params
  * @returns {*}
     */
	get: function get(id, params) {
		return _db.Message.findById(id, {
			include: [{
				as: 'author',
				model: _db.User,
				attributes: {
					exclude: _config.sensibleData.user
				}
			}, {
				as: 'thread',
				model: _db.Thread,
				attributes: {
					exclude: ['user_email']
				},
				include: [{
					model: _db.User,
					as: 'creator',
					attributes: {
						exclude: _config.sensibleData.user
					}
				}, {
					model: _db.User,
					as: 'participants',
					attributes: {
						exclude: _config.sensibleData.user
					}
				}, {
					model: _db.Message,
					as: 'last_message',
					attributes: {
						exclude: ['user_email', 'thread_id']
					},
					include: [{
						as: 'author',
						model: _db.User,
						attributes: {
							exclude: _config.sensibleData.user
						}
					}, {
						as: 'states',
						model: _db.MessageHasStatus,
						attributes: {
							exclude: ['message_id', 'user_email']
						},
						include: [{
							model: _db.User,
							attributes: {
								exclude: _config.sensibleData.user
							}
						}]

					}]

				}]
			}, {
				as: 'states',
				model: _db.MessageHasStatus,
				attributes: {
					exclude: ['message_id', 'user_email']
				},
				include: [{
					model: _db.User,
					attributes: {
						exclude: _config.sensibleData.user
					}
				}]

			}]
		}).then( //Check if message exist and current user has the right to read it
		function (message) {
			if (!message) return _promise2.default.reject(new _index2.default.NotFound('RESOURCE_NOT_FOUND'));
			return _aclMiddleware.ModelAcl.isAllowed(params.user, message, 'get').then(function () {
				return message;
			}, function () {
				return _promise2.default.reject(new _index2.default.Forbidden('MODEL_ACL_ERROR'));
			});
		});
	},

	/**
  * Create a new Message
  *
  * @param data
  * @param params
  * @returns {Promise}
     */
	create: function create(data, params) {
		return _promise2.default.reject(new _index2.default.NotImplemented('METHOD_NOT_IMPLEMENTED'));
	},


	/**
  * Update existant message
  *
  * @param id
  * @param data
  * @param params
  * @returns {Promise}
     */
	update: function update(id, data, params) {
		return _promise2.default.reject(new _index2.default.NotImplemented('METHOD_NOT_IMPLEMENTED'));
	},


	/**
  * Remove message
  *
  * @param id
  * @returns {Promise}
     */
	remove: function remove(id) {
		return _promise2.default.reject(new _index2.default.NotImplemented('METHOD_NOT_IMPLEMENTED'));
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
		var h = function h(service) {
			return function (hook) {
				if (hook.type == 'before') {
					//console.time(`${hook.method}:${service}`);
				} else if (hook.type == 'after') {
					//console.timeEnd(`${hook.method}:${service}`);
				}
			};
		};
		this.before({
			all: h('messages/root')
		});
		this.after({
			all: h('messages/root')
		});
	}
};

exports.default = Service;
//# sourceMappingURL=root.js.map
