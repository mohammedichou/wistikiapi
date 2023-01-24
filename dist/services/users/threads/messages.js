'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _db = require('../../../db');

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _config = require('../../../config');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sns = require('../../../lib/sns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service for User Threads. Threads where user is participating
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
  * Post a new message to thread
  * @param data
  * @param params
  * @param callback
  */
	create: function create(data, params, callback) {
		var user = _db.User.findById(params.email);
		var thread = _db.Thread.findById(params.tid);
		return _promise2.default.all([user, thread]).then(function (result) {
			//Get list of thread participants & create message
			var user = result[0];
			var thread = result[1];

			if (thread == null) return _promise2.default.reject(new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Thread ' + params.id + ' not found'] }));
			var participants = thread.getParticipants({
				where: {
					email: {
						$ne: params.email
					}
				}
			});
			var message = _db.Message.create({
				body: data.body,
				user_email: user.get('email'),
				thread_id: thread.get('id'),
				type: 'MESSAGE'
			});
			return _promise2.default.all([participants, message]);
		}).then( //Set States
		function (result) {
			var participants = result[0];
			var message = result[1];
			var states = participants.map(function (participant) {
				return _db.MessageHasStatus.create({
					user_email: participant.get('email'),
					message_id: message.get('id')
				});
			});
			return _promise2.default.all(_lodash2.default.union([participants, message], states));
		}).then(function (result) {
			var participants = result[0];
			var message = result[1];
			var reload = message.reload({
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
			});
			return _promise2.default.all(_lodash2.default.union(result, [reload]));
		}).then( // Notifications
		function (result) {
			var participants = result[0];
			var message = result[1];
			var notification = {
				id: 'MESSAGE',
				message_id: message.get('id'),
				thread_id: message.get('thread').get('id'),
				author: {
					email: message.get('author').email,
					first_name: message.get('author').first_name
				}
			};
			params.user.getOwnedDevices().then(function (devices) {
				// Send push to all devices
				_lodash2.default.forEach(devices, function (device) {
					if (device.get('sns_arn') && device.get('sns_arn') != params.device.get('sns_arn')) device.notify(notification, 'MESSAGE_' + message.get('id'));
				});
			});

			participants.forEach(function (participant) {
				participant.getOwnedDevices().then(function (devices) {
					// Send push to all devices
					_lodash2.default.forEach(devices, function (device) {
						if (device.get('sns_arn') && device.get('sns_arn') != params.device.get('sns_arn')) {
							//device.notify(notification, `MESSAGE_${message.get('id')}`);
							var notificationMessage = {
								'default': notification,
								GCM: {
									data: notification,
									collapse_key: 'MESSAGE_' + message.get('id')

								},
								APNS: {
									data: notification,
									aps: {
										'content-available': 1,
										'badge': 1,
										'alert': {
											'title': 'Wistiki Chat',
											'body': message.author.get('first_name') + ': ' + message.get('body')
										}

									}
								}

							};
							(0, _sns.notifyEndpoint)(device.get('sns_arn'), notificationMessage, device.get('uid'));
						}
					});
				});
			});
			return message;
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

		this.filter({
			created: function created(data, connection) {
				if (!connection.user) return false;
				if (connection.rooms.indexOf('c:u:' + connection.user.get('email')) == -1 && data.thread.participants.filter(function (participant) {
					return participant.email == connection.user.get('email');
				}).length == 0) return false;
				return data;
			},
			removed: function removed(data, connection) {
				return false;
			},
			updated: function updated(data, connection, hook) {
				return false;
			}
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
			all: h('users/threads/messages')
		});
		this.after({
			all: h('users/threads/messages')
		});
	},

	after: {
		create: function create(hook) {
			hook.result.dataValues = _lodash2.default.omit(hook.result.dataValues, ['user_email', 'thread_id']);
			return hook;
		}
	}
};
exports.default = Service;
//# sourceMappingURL=messages.js.map
