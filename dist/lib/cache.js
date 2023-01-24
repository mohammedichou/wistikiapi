'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('./logger');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

var debug = require('debug')('darwin:cache');

var client = _redis2.default.createClient({
  host: process.env.CACHE_HOST ? process.env.CACHE_HOST : _config2.default.redis.host,
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
  debug('redis client ready');
  _logger.redisLogger.debug('redis ready');
});

// look for connection errors and log
client.on('error', function (err) {
  debug('redis client error', err);
  _logger.redisLogger.error('redis error', err);
});
var KEY_MAPPING = {
  POSITION_WISTIKI: 'p:w:',
  POSITION_DEVICE: 'p:d:'
};

var Cache = function () {
  function Cache() {
    (0, _classCallCheck3.default)(this, Cache);

    this._client = client;
  }

  (0, _createClass3.default)(Cache, [{
    key: '_getLastPosition',


    /**
     * Retrieves last position object
     * @param {string} key hash key where position object is stored
     * @return {Promise.<Array>} index 0 contains boolean indication
     * if hash key has been found or not and index 1
     * contains position object
     *
     * @private
     */
    value: function _getLastPosition(key) {
      debug('_getLastPosition ' + key);
      return this.client.multi().exists(key).hgetall(key).execAsync().then(function (result) {
        var exist = !!result[0];
        var position = result[1];
        debug('_getLastPosition got position from cache of type: %s,', typeof position === 'undefined' ? 'undefined' : (0, _typeof3.default)(position), position);
        if (position && position.position && !_lodash2.default.isObject(position.position)) {
          debug('_getLastPosition got position.position of type: %s from cache:', (0, _typeof3.default)(position.position), position.position);
          position.position = JSON.parse(position.position);
          debug('_getLastPosition got position.position.coordinates of type: %s from cache:', (0, _typeof3.default)(position.position.coordinates), position.position.coordinates);
          if (!_lodash2.default.isObject(position.position.coordinates)) {
            position.position.coordinates = JSON.parse(position.position.coordinates);
          }
          position.date = (0, _moment2.default)(new Date(position.date)).utc().toISOString();
          position.accuracy = parseInt(position.accuracy);
          position.id = parseInt(position.id);
        }
        debug('_getLastPosition found: ', [exist, position]);
        return _promise2.default.resolve([exist, position]);
      }).catch(function (err) {
        debug('_getLastPosition ' + key + ' error', err);
        return _promise2.default.reject(err);
      });
    }

    /**
     * Store localisation object in cache. Before inserting new position, it checks if
     * there is another position stored
     * within the same key. It does not exist it insert the new object. if it exists,
     * it checks positon date before going
     * further. In case new position date is before last saved position, promise will be rejected
     *
     * @param {string} key hash key
     * @param {object} localisation object representing position Model
     * @return {Promise.<object>} inserted localisation object
     *
     * @private
     */

  }, {
    key: '_setLastPosition',
    value: function _setLastPosition(key, localisation) {
      var _this = this;

      debug('_setLastPosition: key: %s, localisation:', key, localisation);
      var stringifiedLocalisation = _lodash2.default.cloneDeep(localisation);
      if (!_lodash2.default.isString(stringifiedLocalisation.position)) {
        stringifiedLocalisation.position.coordinates = (0, _stringify2.default)(localisation.position.coordinates);
        stringifiedLocalisation.position = (0, _stringify2.default)(localisation.position);
      }

      stringifiedLocalisation.accuracy = parseInt(stringifiedLocalisation.accuracy);

      return this._getLastPosition(key).then(function (result) {
        debug('_setLastPosition found record: ', result);

        var exist = result[0];
        var last_position = result[1];

        if (!exist || last_position.date && (0, _moment2.default)(new Date(last_position.date)).isBefore(new Date(localisation.date))) {
          debug('will set into cache: ', stringifiedLocalisation);
          return _this.client.multi().hmset(key, stringifiedLocalisation).execAsync().then(function (result) {
            if (result == 'OK') {
              debug('_setLastPosition position set will return ', localisation);
              return _promise2.default.resolve(localisation);
            }
            debug('_setLastPosition redis returned: ', result);
            return _promise2.default.reject(new Error(result));
          });
        }
        debug('Position not set. Previous position exists? ' + exist + ', last_position date: ' + last_position.date + ', new position date: ' + localisation.date);
        // return Promise.reject(new Error(`Previous position exists? ${exist}, last_position date: ${last_position.date}, new position date: ${localisation.date}`));
        return _promise2.default.resolve(last_position);
      }).catch(function (err) {
        debug('setLastWistikiPosition error', err);
        return _promise2.default.resolve(err);
      });
    }

    /**
     * Returns last Wistiki position record in cache.
     *
     * @param {string|number} serial_number
     * @return {Promise.<object>} containing last position object or null if it does not exist
     */

  }, {
    key: 'getLastWistikiPosition',
    value: function getLastWistikiPosition(serial_number) {
      var key = '' + KEY_MAPPING.POSITION_WISTIKI + serial_number;
      return this._getLastPosition(key).then(function (result) {
        return result[1];
      });
    }

    /**
     * Returns last Device position record in cache.
     *
     * @param {string|number} uid
     * @return {Promise.<object>} localisation position object if it exists or null if not found
     */

  }, {
    key: 'getLastDevicePosition',
    value: function getLastDevicePosition(uid) {
      var key = '' + KEY_MAPPING.POSITION_DEVICE + uid;
      return this._getLastPosition(key).then(function (result) {
        return result[1];
      });
    }

    /**
     * Retrieve last wistiki position. If it does not exist it will insert position otherwise it will check last
     * position date before setting new position.
     *
     * @param {string|number} serial_number Wistiki serial number
     * @param {object} localisation json object representing Position Model
     * @return {Promise.<Object>} with inserted localisation object
     */

  }, {
    key: 'setLastWistikiPosition',
    value: function setLastWistikiPosition(serialNumber, position) {
      debug('setLastWistikiPosition %s', serialNumber, position);
      var key = '' + KEY_MAPPING.POSITION_WISTIKI + serialNumber;
      return this._setLastPosition(key, position);
    }
  }, {
    key: 'setLastDevicePosition',
    value: function setLastDevicePosition(uid, position) {
      var key = '' + KEY_MAPPING.POSITION_DEVICE + uid;
      return this._setLastPosition(key, position);
    }
  }, {
    key: 'deleteDeviceHasUser',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(uid) {
        var keys;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.client.keysAsync('model:device_has_user:' + uid + ':*');

              case 2:
                keys = _context.sent;

                if (!keys.length) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', this.client.multi().del(keys.join(' ')).execAsync());

              case 5:
                return _context.abrupt('return', _promise2.default.resolve());

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function deleteDeviceHasUser(_x) {
        return _ref.apply(this, arguments);
      }

      return deleteDeviceHasUser;
    }()
  }, {
    key: 'getUserDevices',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(email) {
        var keys, multi, results;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.client.keysAsync('model:device_has_user:*:' + email);

              case 2:
                keys = _context2.sent;

                if (!keys.length) {
                  _context2.next = 10;
                  break;
                }

                multi = this.client.multi();

                _lodash2.default.each(keys, function (key) {
                  multi.get(key);
                });
                _context2.next = 8;
                return multi.execAsync();

              case 8:
                results = _context2.sent;
                return _context2.abrupt('return', JSON.parse(results));

              case 10:
                return _context2.abrupt('return', _promise2.default.resolve());

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getUserDevices(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getUserDevices;
    }()
  }, {
    key: 'getWistikiHasOwner',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(email, serialNumber) {
        var keys, results;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.client.keysAsync('model:wistiki_has_owner:' + serialNumber + ':' + email + ':*');

              case 2:
                keys = _context3.sent;

                if (!keys.length) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 6;
                return this.client.getAsync(keys[0]);

              case 6:
                results = _context3.sent;
                return _context3.abrupt('return', JSON.parse(results));

              case 8:
                return _context3.abrupt('return', _promise2.default.resolve());

              case 9:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getWistikiHasOwner(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return getWistikiHasOwner;
    }()
  }, {
    key: 'deleteWistikiHasOwner',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(email, serialNumber) {
        var keys;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.client.keysAsync('model:wistiki_has_owner:' + serialNumber + ':' + email);

              case 2:
                keys = _context4.sent;

                if (!keys.length) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt('return', this.client.multi().del(keys.join(' ')).execAsync());

              case 5:
                return _context4.abrupt('return', _promise2.default.resolve());

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function deleteWistikiHasOwner(_x5, _x6) {
        return _ref4.apply(this, arguments);
      }

      return deleteWistikiHasOwner;
    }()
  }, {
    key: 'getWistikiHasFriend',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(email, serialNumber) {
        var keys, results;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.client.keysAsync('model:wistiki_has_friend:' + serialNumber + ':' + email + ':*');

              case 2:
                keys = _context5.sent;

                if (!keys.length) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 6;
                return this.client.getAsync(keys[0]);

              case 6:
                results = _context5.sent;
                return _context5.abrupt('return', JSON.parse(results));

              case 8:
                return _context5.abrupt('return', _promise2.default.resolve());

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getWistikiHasFriend(_x7, _x8) {
        return _ref5.apply(this, arguments);
      }

      return getWistikiHasFriend;
    }()
  }, {
    key: 'deleteWistikiHasFriend',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(email, serialNumber) {
        var keys;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.client.keysAsync('model:wistiki_has_friend:' + serialNumber + ':' + email + ':*');

              case 2:
                keys = _context6.sent;

                if (!keys.length) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt('return', this.client.multi().del(keys.join(' ')).execAsync());

              case 5:
                return _context6.abrupt('return', _promise2.default.resolve());

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function deleteWistikiHasFriend(_x9, _x10) {
        return _ref6.apply(this, arguments);
      }

      return deleteWistikiHasFriend;
    }()
  }, {
    key: 'getModels',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var result;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                debug('getModels');
                _context7.next = 3;
                return this.client.getAsync('models');

              case 3:
                result = _context7.sent;
                return _context7.abrupt('return', JSON.parse(result));

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getModels() {
        return _ref7.apply(this, arguments);
      }

      return getModels;
    }()
  }, {
    key: 'setModels',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(models) {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                debug('setModels');
                this.client.setAsync('models', (0, _stringify2.default)(models), 'EX', 60 * 60 * 24);

              case 2:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function setModels(_x11) {
        return _ref8.apply(this, arguments);
      }

      return setModels;
    }()
  }, {
    key: 'client',
    get: function get() {
      return this._client;
    }
  }]);
  return Cache;
}();

exports.default = new Cache();
//# sourceMappingURL=cache.js.map
