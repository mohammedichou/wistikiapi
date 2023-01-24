'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _db = require('../../db');

var _config = require('../../config');

var _logger = require('../../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _aclMiddleware = require('../../middlewares/aclMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:services:wistikis:root');

var getMacAddress = function getMacAddress(s) {
  var string = '' + s;
  var mac = Buffer.alloc(6);
  mac.fill(0);
  for (var i = 0; i < 6; i += 1) {
    var octet = parseInt(string.substr(i * 2, 2), 10);
    mac.writeUInt8(octet, i);
  }
  return mac;
};

/**
 * Service for Users
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
   * Get user by id. Throws an error if none can be found
   *
   * @param id requested user id
   * @param params
   * @param callback
   */
  get: function get(id, params) {
    return _db.Wistiki.findById(id, {
      attributes: {
        exclude: _lodash2.default.union(_config.sensibleData.wistiki, ['model_id', 'flan'])
      }
    }).then(function (wistiki) {
      if (!wistiki) {
        return _promise2.default.reject(new _index2.default.NotFound('Wistiki ' + id + ' not found'));
      }
      return _promise2.default.resolve(wistiki);
    }).then(function (wistiki) {
      var owner = wistiki.getOwner({
        attributes: {
          exclude: _config.sensibleData.user
        },
        joinTableAttributes: {
          exclude: ['user_email', 'wistiki_serial_number']
        }
      });

      return _promise2.default.all([wistiki, owner]);
    }).then(function (result) {
      var wistiki = result[0];
      var activeOwners = result[1][0];
      var options = {
        attributes: {
          exclude: _config.sensibleData.user
        },
        joinTableAttributes: {
          exclude: ['user_email', 'wistiki_serial_number']
        }
      };
      if (activeOwners != null && activeOwners.get('email') !== params.user.email) {
        options.where = { email: params.user.email };
      }
      var friends = wistiki.getFriends(options);
      var lastPosition = wistiki.getLastPosition();
      // TODO: can make one sql call instead of 3
      return _promise2.default.all([wistiki, activeOwners, friends, lastPosition]);
    }).then(function (result) {
      var wistiki = result[0];
      var activeOwners = result[1];
      var activeFriends = result[2];
      var lastPosition = result[3];
      wistiki.dataValues.owner = activeOwners;
      wistiki.dataValues.friends = activeFriends;
      wistiki.dataValues.last_position = lastPosition;

      return _aclMiddleware.ModelAcl.isAllowed(params.user, wistiki, 'get').then(function () {
        return wistiki.get({ plain: true });
      }, function () {
        return _promise2.default.reject(new _index2.default.Forbidden('MODEL_ACL_ERROR', {
          errors: [{
            message: 'You are not allowed to access this resource'
          }]
        }));
      });
    });
  },

  /**
   *
   * @param {integer} id
   * @param {object} data
   * @param {object} params
   * @param {function} callback
   */
  // TODO: see how we can reuse wistiki service
  create: function create(data) {
    var operations = data.map(function (wistiki) {
      if (_lodash2.default.isUndefined(wistiki.mac_address) && !_lodash2.default.isUndefined(wistiki.serial_number)) {
        wistiki.mac_address = getMacAddress(wistiki.serial_number).toString('hex').match(/.{2}/g).join(':').toUpperCase();
      } else if (!_lodash2.default.isUndefined(wistiki.mac_address) && _lodash2.default.isUndefined(wistiki.serial_number)) {
        wistiki.serial_number = '';
        for (var i = 0; i < 6; i++) {
          var octet = parseInt(wistiki.mac_address.replace(/:/g, '').substr(i * 2, 2), 16);
          wistiki.serial_number += octet > 10 ? octet : '0' + octet;
        }
      }
      wistiki.msn = parseInt(wistiki.msn, 16);
      if (_lodash2.default.isUndefined(wistiki.model_id) && !_lodash2.default.isUndefined(wistiki.serial_number)) {
        var serial = '' + wistiki.serial_number;
        wistiki.model_id = serial.substr(0, 1);
      }
      if (_lodash2.default.isEmpty(wistiki.last_software_update)) {
        wistiki.last_software_update = (0, _moment2.default)().utc();
      }
      wistiki.recovery_key = wistiki.recovery_key.replace(/:/g, '').replace(/-/g, '').match(/.{2}/g).join(':').toUpperCase();
      debug('Creating new Wistiki', wistiki);
      return _db.Wistiki.create(wistiki).then(function (wistiki) {
        return wistiki;
      }, function (err) {
        _logger2.default.error('Unable to create Wistiki ' + (wistiki.serial_number ? wistiki.serial_number : wistiki.mac_address), {
          wistiki: wistiki,
          error: err
        });
        _logger.errorLog.error('Unable to create Wistiki ' + wistiki.serial_number, {
          wistiki: wistiki,
          error: err
        });
        return {
          fail_msg: 'Unable to create Wistiki ' + (wistiki.serial_number ? wistiki.serial_number : wistiki.mac_address),
          fail_error: {
            message: err.message,
            errors: err.errors
          },
          wistiki: wistiki

        };
      });
    });
    return _promise2.default.all(operations);
  },

  /**
   * Update Wistiki Table infos
   * Used by BMS application for provisionning (update manufacturing date) or by user (after SUOTA)
   * @param {string} id
   * @param {Object} data
   * @param params
   */
  update: function update(id, data, params) {
    if (_lodash2.default.isNil(data.manufacturing_date) && _lodash2.default.isNil(data.last_firmware_version) && _lodash2.default.isNil(data.last_software_update)) {
      return _promise2.default.reject(new _index2.default.BadRequest('REQUIRED_DATA_MISSING', {
        errors: ['manufacturing_date: got ' + data.manufacturing_date, 'last_firmware_version: got ' + data.last_firmware_version, 'last_software_update: got ' + data.last_software_update]
      }));
    }

    var updateData = {
      manufacturing_date: data.manufacturing_date,
      last_software_version: data.last_software_version,
      last_software_update: data.last_software_update
    };
    return _db.Wistiki.findById(id, {
      attributes: {
        exclude: _config.sensibleData.wistiki
      }
    }).then(function (wistiki) {
      if (!wistiki) {
        return _promise2.default.reject(new _index2.default.NotFound('NOT_PROVISIONED', { errors: ['Wistiki ' + id + ' is not provisioned'] }));
      }
      return _promise2.default.resolve(wistiki);
    }).then(function (wistiki) {
      // If request origin is logged in user
      if (params.user) {
        debug('Profile is user ', params.user.email);
        return _aclMiddleware.ModelAcl.isAllowed(params.user, wistiki, 'update').then(function () {
          debug('authorized to update wistiki', wistiki.get({ plain: true }));
          return _promise2.default.resolve(wistiki);
        }, function () {
          return _promise2.default.reject(new _index2.default.Forbidden('MODEL_ACL_ERROR', {
            errors: [{
              message: 'You are not allowed to update this resource'
            }]
          }));
        });
      }
      // If request origin is application let it go
      debug('Profile is application', params.application.id);
      return _promise2.default.resolve(wistiki);
    }).then(function (wistiki) {
      debug('updating wistiki ' + wistiki.serial_number + ' with data: ', _lodash2.default.omitBy(updateData, _lodash2.default.isNil));
      return wistiki.update(_lodash2.default.omitBy(updateData, _lodash2.default.isNil));
    });
  },

  /**
   * TODO: Description
   * @param app
   * @param path
   */
  setup: function setup(app) {
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    this.service = app.service.bind(app);
    this.filter(function () {
      return false;
    });
  }
};

exports.default = Service;
//# sourceMappingURL=root.js.map
