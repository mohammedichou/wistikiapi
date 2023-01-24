'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('../../config');

var _db = require('../../db');

var _aclMiddleware = require('../../middlewares/aclMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
/* eslint-disable no-param-reassign */
var debug = require('debug')('darwin:services:devices');

var Service = {
  /**
   * Lists all user's devices with their last position.
   *
   * @param params
   */
  find: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(params) {
      var _this = this;

      var userModel, userDevices, filtredDevices;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context2.sent;

              if (userModel) {
                _context2.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' not found' }]
              });

            case 5:
              _context2.next = 7;
              return userModel.getOwnedDevices({
                attributes: { exclude: _config.sensibleData.device },
                joinTableAttributes: { exclude: _config.sensibleData.device_has_user }
              });

            case 7:
              userDevices = _context2.sent;
              filtredDevices = userDevices.filter(function (device) {
                return (0, _moment2.default)(new Date()).isBefore(new Date(device.device_has_user.expiration_date));
              });
              return _context2.abrupt('return', _promise2.default.all(_lodash2.default.map(filtredDevices, function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(device) {
                  var lastDevicePosition, deviceObject;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return device.getLastPosition();

                        case 2:
                          lastDevicePosition = _context.sent;
                          deviceObject = _lodash2.default.cloneDeep(device.get({ plain: true }));

                          deviceObject.last_position = lastDevicePosition;
                          return _context.abrupt('return', deviceObject);

                        case 6:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }())));

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function find(_x) {
      return _ref.apply(this, arguments);
    }

    return find;
  }(),

  /**
   * Get device by id. Throws an error if none can be found
   *
   * @param id requested device id
   * @param params
   */
  get: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, params) {
      var userModel, device, devicePairing, isAuthorized, lastDevicePosition, deviceObject;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context3.sent;

              if (userModel) {
                _context3.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' not found' }]
              });

            case 5:
              _context3.next = 7;
              return _db.Device.cache().findById(id);

            case 7:
              device = _context3.sent;
              _context3.next = 10;
              return _db.DeviceHasUser.getDevicePairing(params.email, device.uid);

            case 10:
              devicePairing = _context3.sent;

              if (device) {
                _context3.next = 13;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'Device ' + id + ' not found' }]
              });

            case 13:
              if (devicePairing) {
                _context3.next = 15;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'Device ' + id + ' not associated with user ' + params.email }]
              });

            case 15:
              _context3.next = 17;
              return _aclMiddleware.ModelAcl.isAllowed(params.user, device, 'get').then(function () {
                return true;
              }, function () {
                return false;
              });

            case 17:
              isAuthorized = _context3.sent;

              if (isAuthorized) {
                _context3.next = 20;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to access this resource'
                }]
              });

            case 20:
              _context3.next = 22;
              return device.getLastPosition();

            case 22:
              lastDevicePosition = _context3.sent;
              deviceObject = _lodash2.default.cloneDeep(device.get({ plain: true }));

              deviceObject.device_has_user = _lodash2.default.omit(devicePairing.get({ plain: true }), _config.sensibleData.device_has_user);
              deviceObject.last_position = lastDevicePosition;

              return _context3.abrupt('return', _lodash2.default.omit(deviceObject, _config.sensibleData.device));

            case 27:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function get(_x3, _x4) {
      return _ref3.apply(this, arguments);
    }

    return get;
  }(),

  /**
   * Create a new Device and associate it with current user
   *
   * @param body
   * @param params
   */
  create: function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(body, params) {
      var userModel, deviceModel, data;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context4.sent;

              if (userModel) {
                _context4.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' not found' }]
              });

            case 5:
              _context4.next = 7;
              return _db.Device.cache().findById(body.uid);

            case 7:
              deviceModel = _context4.sent;

              if (!deviceModel) {
                _context4.next = 10;
                break;
              }

              throw new _feathersErrors2.default.Conflict('DEVICE_ALREADY_EXIST', { errors: [{ message: 'Device ' + body.uid + ' already exist' }] });

            case 10:
              data = _lodash2.default.pick(body, ['uid', 'name', 'manufacturer', 'model', 'os', 'version', 'type', 'app_version']);
              _context4.next = 13;
              return _db.Device.cache().create(data);

            case 13:
              deviceModel = _context4.sent;

              _db.DeviceHasUser.cache().create({ device_uid: deviceModel.uid, user_email: params.user.email });
              return _context4.abrupt('return', _lodash2.default.omit(deviceModel.get({ plain: true }), _config.sensibleData.device));

            case 16:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function create(_x5, _x6) {
      return _ref4.apply(this, arguments);
    }

    return create;
  }(),

  /**
   * Update device data
   * @param id device uid
   * @param data containing data to update
   * @param params containing user email
   */
  update: function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(id, data, params) {
      var userModel, deviceModel, devicePairing, isAuthorized, token, deviceData;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context5.sent;

              if (userModel) {
                _context5.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' not found' }]
              });

            case 5:
              _context5.next = 7;
              return _db.Device.cache().findById(id);

            case 7:
              deviceModel = _context5.sent;

              if (deviceModel) {
                _context5.next = 10;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'Device ' + id + ' not found' }] });

            case 10:
              _context5.next = 12;
              return _db.DeviceHasUser.getDevicePairing(params.email, id);

            case 12:
              devicePairing = _context5.sent;

              if (devicePairing) {
                _context5.next = 15;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' has no association with device ' + id }]
              });

            case 15:
              _context5.next = 17;
              return _aclMiddleware.ModelAcl.isAllowed(params.user, deviceModel, 'update').then(function () {
                return true;
              }, function () {
                return false;
              });

            case 17:
              isAuthorized = _context5.sent;

              if (isAuthorized) {
                _context5.next = 20;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to update this resource'
                }]
              });

            case 20:
              token = data.token;
              deviceData = {
                uid: id,
                name: data.name || /* istanbul ignore next: tired of writing tests */null,
                manufacturer: data.manufacturer || /* istanbul ignore next: tired of writing tests */null,
                os: data.os || /* istanbul ignore next: tired of writing tests */null,
                type: data.type || /* istanbul ignore next: tired of writing tests */null,
                version: data.version || /* istanbul ignore next: tired of writing tests */null,
                model: data.model || /* istanbul ignore next: tired of writing tests */null
              };
              _context5.next = 24;
              return _db.Device.createOrUpdate(deviceData, token, params.headers['x-wistiki-environment']);

            case 24:
              deviceModel = _context5.sent;
              _context5.next = 27;
              return _db.Device.cache().findById(id);

            case 27:
              deviceModel = _context5.sent;
              return _context5.abrupt('return', _lodash2.default.omit(deviceModel.get({ plain: true }), _config.sensibleData.device));

            case 29:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function update(_x7, _x8, _x9) {
      return _ref5.apply(this, arguments);
    }

    return update;
  }(),

  /**
   * Delete user-device association
   * @param id
   * @param params
   */
  remove: function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(id, params) {
      var userModel, devicePairing, deviceModel, isAuthorized;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context6.sent;

              if (userModel) {
                _context6.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' not found' }]
              });

            case 5:
              _context6.next = 7;
              return _db.DeviceHasUser.getDevicePairing(params.email, id);

            case 7:
              devicePairing = _context6.sent;
              _context6.next = 10;
              return _db.Device.cache().findById(id);

            case 10:
              deviceModel = _context6.sent;

              if (devicePairing) {
                _context6.next = 13;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'User ' + params.email + ' has no association with device ' + id }]
              });

            case 13:
              if (deviceModel) {
                _context6.next = 15;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{ message: 'Device ' + id + ' not found' }]
              });

            case 15:
              _context6.next = 17;
              return _aclMiddleware.ModelAcl.isAllowed(params.user, deviceModel, 'delete').then(function () {
                return true;
              }, function () {
                return false;
              });

            case 17:
              isAuthorized = _context6.sent;

              if (isAuthorized) {
                _context6.next = 20;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to update this resource'
                }]
              });

            case 20:
              _context6.next = 22;
              return devicePairing.cache().destroy();

            case 22:
              return _context6.abrupt('return', null);

            case 23:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function remove(_x10, _x11) {
      return _ref6.apply(this, arguments);
    }

    return remove;
  }(),

  /**
   * TODO: Description
   * @param app
   */
  setup: function setup(app) {
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    this.service = app.service.bind(app);

    // TODO: filter socket event to send data to user's devices only
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
    update: function update(hook, next) {
      if (hook.params.headers) {
        hook.data.device = {};
        if (hook.params.useragent) {
          var ua = hook.params.useragent;
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

exports.default = Service;
//# sourceMappingURL=devices.js.map
