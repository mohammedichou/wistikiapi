'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('../config');

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:login'); /* eslint-disable no-param-reassign */

var Service = {

  /**
   * Create a new session. Expected data to be email and password
   * @param data
   * @param params
   */
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, params) {
      var _data$device, token, uid, deviceData, user, deviceHasUser;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              debug('login ' + (0, _stringify2.default)(data));

              _data$device = data.device, token = _data$device.token, uid = _data$device.uid;
              deviceData = {
                uid: data.device.uid,
                name: data.device.name || /* istanbul ignore next: tired of writing tests */null,
                manufacturer: data.device.manufacturer || /* istanbul ignore next: tired of writing tests */null,
                os: data.device.os || /* istanbul ignore next: tired of writing tests */null,
                type: data.device.type || /* istanbul ignore next: tired of writing tests */null,
                version: data.device.version || /* istanbul ignore next: tired of writing tests */null,
                model: data.device.model || /* istanbul ignore next: tired of writing tests */null
              };

              // Check if User account exists or not. if not, throws BadRequest('BAD_CREDENTIALS_ERROR')
              // Check if User account is confirmed. if not, throws BadRequest('ACCOUNT_NOT_CONFIRMED_ERROR')

              _context.next = 5;
              return _db.User.checkAccount(data.email);

            case 5:
              user = _context.sent;

              if (user.verifyPassword(data.password)) {
                _context.next = 8;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('BAD_CREDENTIALS_ERROR');

            case 8:
              _context.next = 10;
              return _promise2.default.all([_db.Device.createOrUpdate(deviceData, token, params.headers['x-wistiki-environment']), _db.DeviceHasUser.deleteDevicePairing(uid)]);

            case 10:
              _context.next = 12;
              return _db.DeviceHasUser.cache().create({
                device_uid: uid,
                user_email: user.email,
                expiration_date: (0, _moment2.default)().add(30, 'days').utc(),
                creation_date: (0, _moment2.default)().utc()
              });

            case 12:
              deviceHasUser = _context.sent;

              this.emit('login', { origin: deviceHasUser.get('device_uid') });

              return _context.abrupt('return', {
                user: _lodash2.default.omit(user.get(), _config.sensibleData.user),
                auth_token: deviceHasUser.token,
                refresh_token: deviceHasUser.refresh_token
              });

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function create(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return create;
  }(),

  /**
   * Update User session. Basically, it uses refresh_token to generate new auth_token
   * @param id user email
   * @param data
   * @param params with headers 'x-wistiki-device-uid' & 'x-wistiki-refresh-token'
   */
  update: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(id, data, params) {
      var deviceUid, refreshToken, _ref3, _ref4, user, device, deviceHasUser, updatedDeviceHasUser;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              deviceUid = params.headers['x-wistiki-device-uid'];
              refreshToken = params.headers['x-wistiki-refresh-token'];
              _context2.next = 4;
              return _promise2.default.all([_db.User.checkAccount(id), _db.Device.cache().findById(deviceUid), _db.DeviceHasUser.getDevicePairing(id, deviceUid)]);

            case 4:
              _ref3 = _context2.sent;
              _ref4 = (0, _slicedToArray3.default)(_ref3, 3);
              user = _ref4[0];
              device = _ref4[1];
              deviceHasUser = _ref4[2];

              if (device) {
                _context2.next = 12;
                break;
              }

              console.log('Device ' + deviceUid + ' was not found');
              return _context2.abrupt('return', _promise2.default.reject(new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Device ' + deviceUid + ' was not found'] })));

            case 12:
              if (deviceHasUser) {
                _context2.next = 14;
                break;
              }

              return _context2.abrupt('return', _promise2.default.reject(new _feathersErrors2.default.NotFound('DEVICE_NOT_ASSOCIATED', { errors: ['Device ' + deviceUid + ' is not associated with user ' + id] })));

            case 14:
              if (!(deviceHasUser.refresh_token !== refreshToken)) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt('return', _promise2.default.reject(new _feathersErrors2.default.NotFound('DEVICE_NOT_ASSOCIATED', { errors: ['Device ' + deviceUid + ' with refresh token ' + refreshToken + ' not found'] })));

            case 16:
              _context2.next = 18;
              return deviceHasUser.cache().update({
                expiration_date: (0, _moment2.default)().add(30, 'days').utc()
              });

            case 18:
              updatedDeviceHasUser = _context2.sent;
              return _context2.abrupt('return', {
                user: _lodash2.default.omit(user.get({ plain: true }), _config.sensibleData.user),
                auth_token: updatedDeviceHasUser.token,
                refresh_token: updatedDeviceHasUser.refresh_token
              });

            case 20:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function update(_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    }

    return update;
  }(),

  /**
   * Delete user - device session.
   * @param id user email
   * @param params object containing device uid
   */
  remove: function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, params) {
      var deviceHasUser;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              debug('logout ' + id);
              _context3.next = 3;
              return _db.DeviceHasUser.getDevicePairing(id, params.uid);

            case 3:
              deviceHasUser = _context3.sent;

              if (deviceHasUser) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt('return', _promise2.default.reject(new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Session not found'] })));

            case 6:

              this.emit('logout', { origin: deviceHasUser.get('device_uid') });
              _context3.next = 9;
              return deviceHasUser.cache().destroy();

            case 9:
              return _context3.abrupt('return', null);

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function remove(_x6, _x7) {
      return _ref5.apply(this, arguments);
    }

    return remove;
  }(),


  /**
   * TODO: Create Unit Test
   * @param app
   */
  setup: function setup(app) {
    /* istanbul ignore next */
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    /* istanbul ignore next */
    this.service = app.service.bind(app);
    /* istanbul ignore next */
    this.filter('login', function (data, connection) {
      debug('socket login event', connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1);
      if (connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1) return false;

      if (!connection.device || connection.device.get('type') === 'mobile' || connection.device.get('type') === 'tablet') {
        return false;
      }
      return data;
    });
    /* istanbul ignore next */
    this.filter('logout', function (data, connection) {
      debug('socket logout event', connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1);
      if (connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1) return false;

      if (!connection.device || connection.device.get('type') === 'mobile' || connection.device.get('type') === 'tablet') {
        return false;
      }
      return data;
    });
    /* istanbul ignore next */
    this.filter({
      created: function created() {
        return false;
      },
      removed: function removed() {
        return false;
      },
      updated: function updated() {
        return false;
      }
    });
  },

  before: {
    create: function create(hook, next) {
      /* istanbul ignore else */
      if (hook.params.headers) {
        hook.data.device = {};
        hook.data.device.uid = hook.params.headers['x-wistiki-device-uid'];
        hook.data.device.name = hook.params.headers['x-wistiki-device-name'];
        hook.data.device.token = hook.params.headers['x-wistiki-device-token'];
        /* istanbul ignore else */
        if (hook.params.useragent) {
          var ua = hook.params.useragent;
          hook.data.ua = ua;
          hook.data.device.type = ua.device.type;
          hook.data.device.os = ua.os.name;
          hook.data.device.version = ua.os.version;
          hook.data.device.manufacturer = ua.device.vendor;
          hook.data.device.model = ua.device.model;
        }
      }
      next();
    }
  }
};
Service.events = ['login', 'logout'];
exports.default = Service;
//# sourceMappingURL=login.js.map
