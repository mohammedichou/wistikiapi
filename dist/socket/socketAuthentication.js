'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SocketPostAuthentication = exports.SocketAuthenticate = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _jwtCheck = require('../lib/jwtCheck');

var _jwtCheck2 = _interopRequireDefault(_jwtCheck);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('wistiki:rt:socketAuthentication');

var _redisLog = function _redisLog(tag, meta) {
	return function (err, reply) {
		if (err) {
			_logger.redisLogger.error(tag, { meta: meta, error: err });
		}
	};
};
/**
 * Socket Authenticate Callback definition
 *
 * @name AuthenticateCallback
 * @function
 * @param {Error} if set, error will be sent back to socket client
 * @param {boolean} if true, authentication is considered as succeeded else fail and disconnect client
 */

/**
 * When connection is received try to authenticate it by checking given data.
 *
 * @param {object} socket
 * @param {{token: string}} data
 * @param {AuthenticateCallback} callback
 */
var authenticate = function authenticate(socket, data, callback) {
	(0, _jwtCheck2.default)(data.token).then(function (identity) {
		socket.feathers.user = identity[0];
		socket.feathers.device = identity[1];
		socket.feathers.rooms = [];
		callback(null, true); //OK client is authenticated
	}, function (err) {
		_logger.socketLog.error('authenticated request failed', { data: data, error: err });
		callback(err, false); //NOK client is not authenticated
	});
};

/**
 * Called when authentication is passed.
 *
 * @param socket
 * @param data
 */
var postAuthenticate = function postAuthenticate(redisClient) {
	return function (socket, data) {
		debug('postAuthenticate');
		var socketClient = new _client2.default(socket, redisClient);
		socket.monitor('user', socketClient.user.get('email'));
		socket.monitor('uid', socketClient.device.get('uid'));
		socket.monitor('name', socketClient.device.get('name'));
		socketClient.setState();
		socketClient.joinDeviceRoom();
		socketClient.joinWistikiRoom();
		socketClient.joinUserRoom().then(function (clientsConnected) {
			debug('Got connected clients %s', clientsConnected);
			return socketClient.getUserDevices(clientsConnected);
		}).then(function (connectedDevices) {
			debug('Got connected devices', connectedDevices);
			var multi = redisClient.multi();
			_lodash2.default.each(connectedDevices, function (device) {
				multi.hgetall('s:d:' + device);
			});
			return multi.execAsync();
		}).then(function (devicesStatus) {
			debug('Got devices status', devicesStatus);
			var deviceStatusMapping = {
				uid: 'u',
				name: 'n',
				type: 't',
				manufacturer: 'm',
				model: 'mo',
				status: 's',
				ring_status: 'rs',
				date: 'd'
			};
			var statuses = _lodash2.default.map(devicesStatus, function (status) {
				return _lodash2.default.mapValues(deviceStatusMapping, function (k) {
					return status[k];
				});
			});

			_lodash2.default.each(statuses, function (status) {
				debug('deviceStatusEvent : %s', (0, _stringify2.default)(status));
				socketClient.emit('deviceStatusEvent', status);
			});
		});
		socketClient.getWistikiStates();
	};
};

exports.SocketAuthenticate = authenticate;
exports.SocketPostAuthentication = postAuthenticate;
//# sourceMappingURL=socketAuthentication.js.map
