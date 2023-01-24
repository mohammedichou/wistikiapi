'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (token) {
  return new _promise2.default(function (resolve, reject) {
    if (!token) {
      return reject(new _index2.default.NotAuthenticated('TOKEN_REQUIRED'));
    }

    return _jsonwebtoken2.default.verify(token, _config2.default.jwt.secretOrPrivateKey, function (err, data) {
      if (err) {
        // Return a 401 Unauthorized if the token has expired.
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
          reject(new _index2.default.NotAuthenticated('TOKEN_EXPIRED', { errors: [err] }));
        } else {
          reject(new _index2.default.NotAuthenticated(err.name, { errors: [err] }));
        }
        return null;
      }
      debug(data.role);
      if (data.role === 'application') {
        return _db.AppKey.findOne({ where: { id: token, application_id: data.sub } }).then(function (appKey) {
          if (!appKey) {
            return reject(new _index2.default.NotAuthenticated('APPLICATION_KEY_NOT_FOUND'));
          }
          return appKey.getApplication().then(function (application) {
            if (!application) {
              return reject(new _index2.default.GeneralError('APPLICATION_WAS_NOT_FOUND'));
            }
            if (application.get('id') !== data.sub) {
              return reject(new _index2.default.NotAuthenticated('INVALID_KEY_APPLICATION_ASSOCIATION'));
            }
            return resolve([application, appKey, 'application']);
          });
        });
      }
      return _promise2.default.all([_db.User.cache().findById(data.sub), _db.Device.cache().findById(data.uid)]).then(function (result) {
        var _result = (0, _slicedToArray3.default)(result, 2),
            user = _result[0],
            device = _result[1];

        if (!user) {
          return reject(new _index2.default.NotAuthenticated('USER_NOT_FOUND', { errors: [{ message: 'User ' + data.sub + ' not found}' }] }));
        }
        if (!device) {
          return reject(new _index2.default.NotAuthenticated('DEVICE_NOT_FOUND', { errors: [{ message: 'Device ' + data.uid + ' not found}' }] }));
        }
        return resolve([user, device, 'user']);
      }, function (error) {
        return reject(new _index2.default.NotAuthenticated(error.message));
      });
    });
  });
};

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _db = require('../db');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:lib:jwt');

/**
 * Library that takes JWT token, verify it against secret or Key and return a promise
 *
 * @param token JWT token to check
 * @returns {Promise} containing any array with user and device instance
 */
//# sourceMappingURL=jwtCheck.js.map
