'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _db = require('../db');

var _labels = require('./labels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('wistiki:rt:client');

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

var wistikiStatusMapping = {
	origin: 'o',
	serial_number: 'sn',
	ble_status: 'bs',
	ring_status: 'rs',
	last_connection: 'lc',
	date: 'd'
};

/**
 * This function will transform json object to another object with shrinked labels to be stored in Redis
 * @param object to shrink
 * @param mapping mapping object containing long to short label transormation
 * @return {*}
 */
var toHmset = function toHmset(object, mapping) {
	var mapped_keys = _lodash2.default.mapKeys(_lodash2.default.omitBy(object, function (v) {
		return _lodash2.default.isNull(v);
	}), function (value, key) {
		return mapping[key];
	});
	return mapped_keys;
};

/**
 * Same as toHmset function but will do the reverse job. It will transform shrinked redis object to human readable object
 *
 * @param object to transform
 * @param mapping object containing long to short label transformation
 * @return {*}
 */
var fromHmset = function fromHmset(object, mapping) {
	debug('fromHmset ' + (0, _stringify2.default)(object) + ' => ' + (0, _stringify2.default)(mapping));
	return _lodash2.default.mapValues(mapping, function (k) {
		//debug(`fromHmset: ${k} => ${object[k]}`);
		return object[k];
	});
};

var Client = function () {
	function Client(socket, redisClient) {
		(0, _classCallCheck3.default)(this, Client);

		if (!socket.feathers || !socket.feathers.user || !socket.feathers.device) throw new Error('Unexpected authenticated socket: must contain feathers property');
		this._socket = socket;
		this._redis = redisClient;
		this._redis.multi().set(this.getRoomKeyFor('Socket'), this._socket.feathers.device.get('uid')).expire(this.getRoomKeyFor('Socket'), 60 * 60 * 12).execAsync();
		this._eventHandlers();
	}

	(0, _createClass3.default)(Client, [{
		key: 'getRoomKeyFor',
		value: function getRoomKeyFor(room) {
			switch (room) {
				case 'User':
					return 'c:u:' + this.user.get('email');
				case 'Device':
					return 'c:d:' + this.device.get('uid');
				case 'Socket':
					return 'c:s:' + this._socket.id;
				case 'SocketWistikis':
					return 'c:s:' + this._socket.id + ':r:w';
				case 'DeviceStatus':
					return 's:d:' + this.device.get('uid');
				default:
					throw Error('Room not defined');
			}
		}
	}, {
		key: 'on',
		value: function on(event, callback) {
			this._socket.on(event, callback);
		}
	}, {
		key: 'emit',
		value: function emit(event, msg) {
			debug('emit ' + this.device.get('uid') + ' : ' + this.id + '  %s -> ', event, msg);
			this._socket.emit(event, msg);
		}

		/**
   *
   * @param room
   * @param id
   * @param event
   * @param msg
   */

	}, {
		key: 'broadcastToRoom',
		value: function broadcastToRoom(room, id, event, msg) {
			var roomName = this._buildRoomName(room, id);
			debug('broadcastToRoom ' + roomName + ' id: ' + id + ', event: ' + event + ', msg: ' + (0, _stringify2.default)(msg));
			this._socket.broadcast.to(roomName).emit(event, msg);
		}

		/**
   * Add this client to room identified by id
   *
   * @param room
   * @param id
   * @returns {Promise<String>} generate room name
   */

	}, {
		key: 'join',
		value: function join(room) {
			var _this = this;

			var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var roomName = this._buildRoomName(room, id);
			debug('joining room: ' + room + ', id: ' + id);
			return new _promise2.default(function (resolve, reject) {
				_this._socket.join(roomName, function (err) {
					if (err) return reject(err);
					debug('joined room: ' + roomName + ', id: ' + id);
					_this._socket.feathers.rooms.push(roomName);
					resolve(roomName);
				});
			});
		}
	}, {
		key: 'leave',
		value: function leave(room) {
			var _this2 = this;

			var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var roomName = this._buildRoomName(room, id);
			debug('leaving room: ' + room + ', id: ' + id);
			return new _promise2.default(function (resolve, reject) {
				_this2._socket.leave(roomName, function (err) {
					if (err) return reject(err);
					debug('leaved room: ' + roomName + ', id: ' + id);
					_this2._socket.feathers.rooms = _lodash2.default.pull(_this2._socket.feathers.rooms, roomName);
					resolve(roomName);
				});
			});
		}

		/**
   * Add this client to user room and add {@link Client#id()} to user clients set (key: c:u:(email))
   *
   * @see Client#join
   * @returns {Promise.<Array>} containing clients connected to user room
   */

	}, {
		key: 'joinUserRoom',
		value: function joinUserRoom() {
			var _this3 = this;

			debug('joinUserRoom');
			return this.join('User', this.user.get('email')).then(function (roomName) {
				debug('joinUserRoom: user room joined');
				return _this3._redis.multi().smembers(roomName).sadd(roomName, _this3.id).execAsync();
			}).then(function (result) {
				return result[0];
			});
		}
	}, {
		key: 'leaveUserRoom',
		value: function leaveUserRoom() {
			var _this4 = this;

			debug('leaveUserRoom');
			return this.leave('User', this.user.get('email')).then(function (roomName) {
				debug('leaveUserRoom: user room leaved');
				return _this4._redis.multi();
			});
		}

		/**
   * Add this client to device rroom and add {@link Client#id} to user clients set (key: c:d:(uid))
   *
   * @see Client#join
   * @returns {Promise.<String>|*}
   */

	}, {
		key: 'joinDeviceRoom',
		value: function joinDeviceRoom() {
			var _this5 = this;

			debug('joinDeviceRoom');
			return this.join('Device', this.device.get('uid')).then(function (roomName) {
				debug('joinDeviceRoom: device room joined');
				return _this5._redis.multi().smembers(roomName).sadd(roomName, _this5.id).expire(roomName, 60 * 60 * 12).execAsync();
			});
		}
	}, {
		key: 'leaveDeviceRoom',
		value: function leaveDeviceRoom() {
			var _this6 = this;

			debug('leaveDeviceRoom');
			return this.leave('Device', this.user.get('email')).then(function (roomName) {
				debug('leaveDeviceRoom: device room leaved');
				return _this6._redis.multi();
			});
		}
	}, {
		key: 'joinWistikiRoom',
		value: function joinWistikiRoom() {
			var _this7 = this;

			debug('joinWistikiRoom');
			this.user.getUserWistikis().then(function (wistikis) {
				return _lodash2.default.map(wistikis, function (w) {
					return w.get('serial_number');
				});
			}).then(function (serials) {
				_lodash2.default.each(serials, function (sn) {
					_this7.join('SocketWistikis', sn).then(function (roomName) {
						debug('joinWistikiRoom: wistiki room ' + sn + ' joined');
						return _this7._redis.multi().smembers(roomName).sadd(roomName, _this7.id).expire(roomName, 60 * 60 * 12).execAsync();
					});
				});
			});
		}
	}, {
		key: 'leaveWistikiRoom',
		value: function leaveWistikiRoom() {
			var _this8 = this;

			debug('leaveWistikiRoom');
			this.user.getUserWistikis().then(function (wistikis) {
				return _lodash2.default.map(wistikis, function (w) {
					return w.get('serial_number');
				});
			}).then(function (serials) {
				_lodash2.default.each(serials, function (sn) {
					_this8.leave('SocketWistikis', sn).then(function (roomName) {
						debug('leaveWistikiRoom: wistiki room ' + sn + ' leaved');
						return _this8._redis.multi().smembers(roomName).sadd(roomName, _this8.id).expire(roomName, 60 * 60 * 12).execAsync();
					});
				});
			});
		}
	}, {
		key: 'broadcastToUserRoom',
		value: function broadcastToUserRoom(event, msg) {
			this.broadcastToRoom('User', this.user.get('email'), event, msg);
		}
	}, {
		key: 'broadcastToDeviceRoom',
		value: function broadcastToDeviceRoom(event, msg) {
			var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.device.get('uid');

			this.broadcastToRoom('Device', id, event, msg);
		}
	}, {
		key: 'broadcastToWistikiRoom',
		value: function broadcastToWistikiRoom(event, msg, id) {
			this.broadcastToRoom('SocketWistikis', id, event, msg);
		}

		/***
   *
   * @returns {{uid: *, name: *, type: *, manufacturer: *, model: *, status: (string|*), ring_status: (string|*), date: *}}
   */

	}, {
		key: 'getState',
		value: function getState() {
			return {
				uid: this.device.get('uid'),
				name: this.device.get('name'),
				type: this.device.get('type'),
				manufacturer: this.device.get('manufacturer'),
				model: this.device.get('model'),
				status: this._status,
				ring_status: this._ringStatus,
				date: (0, _moment2.default)().utc().toISOString()
			};
		}
	}, {
		key: 'getWistikiStates',
		value: function getWistikiStates() {
			var _this9 = this;

			return this.user.getUserWistikis().then(function (wistikis) {
				var multi = _this9._redis.multi();
				_lodash2.default.each(wistikis, function (wistiki) {
					debug('will try to get wistiki ' + wistiki.serial_number + ' status');
					multi.hgetall('s:w:' + wistiki.serial_number);
				});
				return multi.execAsync();
			}).then(function (wistikisStatus) {
				debug('got wistikis status : ' + (0, _stringify2.default)(wistikisStatus));

				var statuses = _lodash2.default.map(_lodash2.default.without(wistikisStatus, null), function (status) {
					return status != null ? fromHmset(status, wistikiStatusMapping) : null;
				});
				debug((0, _stringify2.default)(statuses));
				_lodash2.default.each(statuses, function (status) {
					debug('wistikiStatusEvent : %s', (0, _stringify2.default)(status));
					try {
						//temporary measure as some redis status were stored as moment objects
						status.last_connection = (0, _moment2.default)(status.last_connection).utc().toISOString();
					} catch (e) {
						status.last_connection = status.last_connection.utc().toISOString();
					}

					if (status != null) _this9.emit('wistikiStatusEvent', status);
				});
			});
		}

		/**
   *
   * @param status
   * @param ringState
   */

	}, {
		key: 'setState',
		value: function setState() {
			var _this10 = this;

			var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _labels.DeviceStatus.ONLINE;
			var ringState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _labels.RingStatus.NOT_RINGING;

			debug('setState ' + status + ' : ' + ringState);
			this._status = status;
			this._ringStatus = ringState;
			var hash = toHmset(this.getState(), deviceStatusMapping);
			hash.d = (0, _moment2.default)(hash.d).unix(); //store date as unix
			// Store socket device status to s:d:(uid)
			var multi = this._redis.multi();
			multi.hmset(this.getRoomKeyFor('DeviceStatus'), hash);
			if (status == _labels.DeviceStatus.OFFLINE) {
				multi.smembers('d:w:' + this.device.get('uid'));
			}

			return multi.execAsync().then(function (result) {
				if (status == _labels.DeviceStatus.OFFLINE && result[1]) {
					var wistikis = _lodash2.default.map(result[1], function (serialNumber) {
						return {
							serial_number: serialNumber,
							ble_status: _labels.BleStatus.DISCONNECTED,
							ring_status: _labels.RingStatus.NOT_RINGING
						};
					});
					debug('Device disconnected will send status', (0, _stringify2.default)(wistikis));
					if (wistikis.length) return _this10._onSetWistikiStatus(wistikis);
				}
				return null;
			}).then(function () {
				return _this10.broadcastToUserRoom('deviceStatusEvent', _this10.getState());
			});
		}

		/**
   * Returns list of user connected devices
   *
   * @param {Array.<String>} socketClients list of user clients
   * @returns {Array.<String>} Array containing connected devices uid
   */

	}, {
		key: 'getUserDevices',
		value: function getUserDevices(socketClients) {
			var _this11 = this;

			var rooms = _lodash2.default.map(socketClients, function (socketId) {
				return 'c:s:' + socketId;
			});

			return this._redis.mgetAsync(rooms).then(function (uuids) {
				return _lodash2.default.without(_lodash2.default.uniq(uuids), _this11.device.get('uid'), null);
			} // Get unique devices other than current
			);
		}
	}, {
		key: '_buildKey',
		value: function _buildKey(key, id) {
			var keyName = key;
			switch (key) {
				case 'UserDevices':
					keyName = 'd:u:' + id;
					break;
			}
			return keyName;
		}
	}, {
		key: '_buildRoomName',
		value: function _buildRoomName(room, id) {
			var roomName = room;
			switch (room) {
				case 'User':
					roomName = 'c:u:' + id;
					break;
				case 'Device':
					roomName = 'c:d:' + id;
					break;
				case 'Socket':
					roomName = 'c:s:' + id;
					break;
				case 'SocketWistikis':
					roomName = 'c:s:' + id + ':r:w';
					break;
			}
			return roomName;
		}

		/**
   * Executed when client is disconnected. Will look into connected Wistiki and disconnect them by emitting an event
   * to Wistiki room
  	 * @private
   */

	}, {
		key: '_onDisconnect',
		value: function _onDisconnect() {
			var _this12 = this;

			debug('_onDisconnect');
			return this.leaveUserRoom().then(function () {
				return _this12.leaveDeviceRoom();
			}).then(function () {
				return _this12.leaveWistikiRoom();
			}).then(function () {
				return _this12._redis.multi().srem(_this12._buildRoomName('User', _this12.user.get('email')), 0, _this12.id).srem(_this12._buildRoomName('Device', _this12.device.get('uid')), 0, _this12.id).del(_this12.getRoomKeyFor('Socket')).smembers(_this12._buildRoomName('Device', _this12.device.get('uid'))).execAsync().then(function (result) {
					_this12.setState(_labels.DeviceStatus.OFFLINE).then(function () {
						return null;
					}); //set device status to offline and broadcast it to user devices room
					var deviceLeftClients = result[3];
					var deviceConnectedWistiki = result[4];
					debug('_onDisconnect: result ', result);
					if (deviceLeftClients.length) {
						debug('deviceLeftClients is ' + deviceLeftClients.length + ' so will broadcast to others');

						return _this12._redis.delAsync(_this12._buildRoomName('Device', _this12.device.get('uid')));
					}
				});
			});
		}
	}, {
		key: '_onSetDeviceStatus',
		value: function _onSetDeviceStatus(data) {
			debug('_onSetDeviceStatus ' + this.device.get('uid') + ' : ' + this.id + ' -> ', data);
			//TODO: add data sanity check
			this.setState(_labels.DeviceStatus.ONLINE, data.ring_status);
		}
	}, {
		key: '_onWistikiRingAction',
		value: function _onWistikiRingAction(data) {
			debug('_onWistikiRingAction ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			if (!data.serial_number) return;
			var message = {
				origin: this.device.uid,
				serial_number: data.serial_number
			};
			this.broadcastToWistikiRoom(_labels.Requests.RING_WISTIKI, message, data.serial_number);
		}
	}, {
		key: '_onDeviceRingAction',
		value: function _onDeviceRingAction(data) {
			debug('_onDeviceRingAction ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			this.broadcastToDeviceRoom('deviceRingRequest', {
				origin: this.device.get('uid')
			}, data.uid);
		}
	}, {
		key: '_onDeviceMuteAction',
		value: function _onDeviceMuteAction() {
			debug('_onDeviceMuteAction ' + this.device.get('uid') + ' : ' + this.id);
		}
	}, {
		key: '_onWistikiMuteAction',
		value: function _onWistikiMuteAction(data) {
			debug('_onWistikiMuteAction ' + this.device.get('uid') + ' : ' + this.id);
			if (!data.serial_number) return;
			var message = {
				origin: this.device.uid,
				serial_number: data.serial_number
			};
			this.broadcastToWistikiRoom(_labels.Requests.MUTE_WISTIKI, message, data.serial_number);
		}
	}, {
		key: '_onSetWistikiStatus',
		value: function _onSetWistikiStatus(data) {
			var _this13 = this;

			debug('_onSetWistikiStatus ' + this.device.get('uid') + ' : ' + this.id + ' => ' + (0, _stringify2.default)(data));
			var origin = this.device.get('uid');
			_lodash2.default.each(data, function (wistiki) {
				if (!_lodash2.default.has(wistiki, 'serial_number') || !_lodash2.default.has(wistiki, 'ble_status') || !_lodash2.default.has(wistiki, 'ring_status')) {
					return;
				}
				var message = {
					origin: origin,
					serial_number: wistiki.serial_number,
					ble_status: wistiki.ble_status,
					ring_status: wistiki.ring_status,
					last_connection: (0, _moment2.default)(wistiki.last_connection).utc().toISOString(),
					date: (0, _moment2.default)().utc().toISOString()
				};
				var hash = toHmset(message, wistikiStatusMapping);
				hash.d = (0, _moment2.default)(hash.d).unix(); //store date as unix
				debug('store wistiki status', (0, _stringify2.default)(hash));
				// Store socket device status to s:d:(uid)
				var multi = _this13._redis.multi();
				multi.hmset('s:w:' + wistiki.serial_number, hash);
				if (wistiki.ble_status === _labels.BleStatus.CONNECTED) {
					multi.sadd('d:w:' + origin, wistiki.serial_number);
				} else {
					multi.srem('d:w:' + origin, wistiki.serial_number);
				}
				multi.execAsync().then(function (res) {
					debug('Set d:w:' + origin, res);
				}, function (err) {
					debug('Set error d:w:' + origin, err);
				});
				_this13.broadcastToWistikiRoom(_labels.Events.WISTIKI_STATUS, message, wistiki.serial_number);
			});
		}
	}, {
		key: '_onWistikiListAction',
		value: function _onWistikiListAction(data) {
			debug('_onWistikiListAction ' + this.device.get('uid') + ' : ' + this.id + ' -> ' + data);
			this.broadcastToDeviceRoom('wistikiListRequest', {
				origin: this.device.get('uid')
			}, data.uid);
		}
	}, {
		key: '_onSetWistikiList',
		value: function _onSetWistikiList(data) {
			debug('_onSetWistikiList ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			//TODO: data sanity check
			this.broadcastToDeviceRoom('wistikiListEvent', {
				from: this.device.get('uid'),
				discovered_wistikis: data.discovered_wistikis
			}, data.to);
		}
	}, {
		key: '_onResetWistikiAction',
		value: function _onResetWistikiAction(data) {
			var _this14 = this;

			debug('_onResetWistikiAction ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			_db.Wistiki.findById(data.serial_number).then(function (wistiki) {
				if (!wistiki) return _promise2.default.reject({ error: 'wistiki ' + data.serial_number + ' not found' });
				debug('_onResetWistikiAction: wistiki found', wistiki.get({ plain: true }));
				wistiki.generateAuthorizationKey();
				return wistiki.save();
			}).then(function (wistiki) {
				debug('_onResetWistikiAction: wistiki authorization key ' + wistiki.get('authorization_key'));
				_this14.broadcastToDeviceRoom('resetWistikiRequest', {
					origin: _this14.device.get('uid'),
					serial_number: data.serial_number,
					msn_cipher: data.msn_cipher,
					authorization_key: wistiki.get('authorization_key')
				}, data.to);
			}).catch(function (error) {
				debug('error: ', error);
			});
		}
	}, {
		key: '_onWistikiReset',
		value: function _onWistikiReset(data) {
			debug('_onWistikiReset ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			this.broadcastToDeviceRoom('wistikiResetEvent', {
				origin: this.device.get('uid'),
				serial_number: data.serial_number
			}, data.to);
		}
	}, {
		key: '_onLeashEvent',
		value: function _onLeashEvent(data) {
			debug('_onLeashEvent ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			this.broadcastToWistikiRoom('wistikiLeashEvent', {
				origin: this.device.get('uid'),
				serial_number: data.serial_number
			}, data.serial_number);
		}
	}, {
		key: '_onInvertedLeashEvent',
		value: function _onInvertedLeashEvent(data) {
			debug('_onInvertedLeashEvent ' + this.device.get('uid') + ' : ' + this.id + ' ->', data);
			this.broadcastToWistikiRoom('wistikiInvertedLeashEvent', {
				origin: this.device.get('uid'),
				serial_number: data.serial_number
			}, data.serial_number);
		}
	}, {
		key: '_eventHandlers',
		value: function _eventHandlers() {
			var _this15 = this;

			var event = {
				"disconnect": this._onDisconnect,
				"setWistikiStatus": this._onSetWistikiStatus,
				"setDeviceStatus": this._onSetDeviceStatus,
				"wistikiRingAction": this._onWistikiRingAction,
				"deviceRingAction": this._onDeviceRingAction,
				"wistikiMuteAction": this._onWistikiMuteAction,
				"deviceMuteAction": this._onDeviceMuteAction,
				"wistikiListAction": this._onWistikiListAction,
				"setWistikiList": this._onSetWistikiList,
				"resetWistikiAction": this._onResetWistikiAction,
				"setWistikiReset": this._onWistikiReset,
				"wistikiLeashEvent": this._onLeashEvent,
				"wistikiInvertedLeashEvent": this._onInvertedLeashEvent
			};
			_lodash2.default.each(event, function (handler, event) {
				_this15.on(event, handler.bind(_this15));
			});
		}
	}, {
		key: 'id',
		get: function get() {
			return this._socket.id;
		}
	}, {
		key: 'user',
		get: function get() {
			return this._socket.feathers.user;
		},
		set: function set(user) {
			if (user && this._socket) {
				this._socket.feathers.user = user;
			}
		}
	}, {
		key: 'device',
		get: function get() {
			return this._socket.feathers.device;
		},
		set: function set(device) {
			if (device && this._socket) {
				this._socket.feathers.device = device;
			}
		}
	}]);
	return Client;
}();

exports.default = Client;
//# sourceMappingURL=client.js.map
