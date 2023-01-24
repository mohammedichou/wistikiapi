'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _socketioAuth = require('socketio-auth');

var _socketioAuth2 = _interopRequireDefault(_socketioAuth);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _monitor = require('monitor.io');

var _monitor2 = _interopRequireDefault(_monitor);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _socketAuthentication = require('./socketAuthentication');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socketRedis = require('socket.io-redis');


_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

var debug = require('debug')('wistiki:rt:index');

var socket = function socket(app) {
	return function (io) {
		io.use((0, _monitor2.default)({ port: 8000 }));
		var socket_config = { host: _config2.default.socket.host, port: _config2.default.socket.port };
		var client = _redis2.default.createClient({
			host: _config2.default.redis.host,
			port: _config2.default.redis.port,
			retry_strategy: function retry_strategy(options) {
				if (options.error.code === 'ECONNREFUSED') {
					// End reconnecting on a specific error and flush all commands with a individual error
					_logger.redisLogger.error('redis error', options.error);
					return new Error('The server refused the connection');
				}
				if (options.total_retry_time > 1000 * 60 * 60) {
					// End reconnecting after a specific timeout and flush all commands with a individual error
					_logger.redisLogger.error('redis error', { error: 'Retry time exhausted' });
					return new Error('Retry time exhausted');
				}
				if (options.times_connected > 10) {
					_logger.redisLogger.error('redis error', { error: 'End reconnecting with built in error' });
					// End reconnecting with built in error
					return null;
				}
				// reconnect after
				return Math.max(options.attempt * 100, 3000);
			}
		});

		client.on('ready', function () {
			_logger.redisLogger.debug('redis ready');
			debug('ready');
		});

		//look for connection errors and log
		client.on('error', function (err) {
			_logger.redisLogger.error('redis error', err);
			debug('error', err);
		});
		io.adapter(socketRedis(socket_config));
		(0, _socketioAuth2.default)(io, {
			timeout: 3000,
			authenticate: _socketAuthentication.SocketAuthenticate,
			postAuthenticate: (0, _socketAuthentication.SocketPostAuthentication)(client)
		});

		//Add tags to socket for debuging
		io.on('connection', function (socket) {
			socket.monitor('last_connection', (0, _moment2.default)().utc().format('YYYY-MM-DD HH:mm:ss'));
			socket.monitor('id', socket.id);
			debug('connection', {
				id: socket.id,
				last_connection: (0, _moment2.default)().utc().format('YYYY-MM-DD HH:mm:ss'),
				auth: socket.auth
			});
		});

		io.on('disconnect', function (socket) {
			debug('disconnect', { id: socket.id, disconnected: (0, _moment2.default)().utc().format('YYYY-MM-DD HH:mm:ss') });
		});
	};
};
exports.default = socket;
//# sourceMappingURL=index.js.map
