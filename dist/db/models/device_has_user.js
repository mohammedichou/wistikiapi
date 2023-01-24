'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _cache = require('../../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
var debug = require('debug')('darwin:models:device_has_user');

module.exports = function (sequelize, DataTypes) {
  var DeviceHasUser = sequelize.define('device_has_user', {
    device_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'device',
        key: 'uid'
      }
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'email'
      }
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false
  });

  DeviceHasUser.beforeCreate(function (deviceUser) {
    debug('beforeCreate', deviceUser);
    deviceUser.creation_date = (0, _moment2.default)().utc();
    deviceUser.expiration_date = (0, _moment2.default)().add(30, 'days').utc();
    deviceUser.refresh_token = _nodeUuid2.default.v4();
    deviceUser.token = _jsonwebtoken2.default.sign({ sub: deviceUser.user_email, uid: deviceUser.device_uid }, _config2.default.jwt.secretOrPrivateKey, _config2.default.jwt.options);
  });

  DeviceHasUser.beforeUpdate(function (deviceUser) {
    debug('beforeUpdate', deviceUser);
    deviceUser.expiration_date = (0, _moment2.default)().add(30, 'days').utc();
    deviceUser.refresh_token = _nodeUuid2.default.v4();
    deviceUser.token = _jsonwebtoken2.default.sign({ sub: deviceUser.user_email, uid: deviceUser.device_uid }, _config2.default.jwt.secretOrPrivateKey, _config2.default.jwt.options);
  });
  DeviceHasUser.deleteDevicePairing = function (uid) {
    return _promise2.default.all([_cache2.default.deleteDeviceHasUser(uid), DeviceHasUser.destroy({ where: { device_uid: uid } })]);
  };

  /**
   *
   * @param email
   * @param uid
   * @return {Promise.<DeviceHasUser>}
   */
  DeviceHasUser.getDevicePairing = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(email, uid) {
      var pairing;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return DeviceHasUser.cache().client().get(['device_has_user', uid, email]);

            case 2:
              pairing = _context.sent;

              if (pairing) {
                _context.next = 12;
                break;
              }

              _context.next = 6;
              return DeviceHasUser.findOne({
                where: {
                  user_email: email,
                  device_uid: uid
                }
              });

            case 6:
              pairing = _context.sent;

              if (!pairing) {
                _context.next = 11;
                break;
              }

              _context.next = 10;
              return DeviceHasUser.cache().client().set(['device_has_user', uid, email], (0, _stringify2.default)(pairing.get({ plain: true })));

            case 10:
              return _context.abrupt('return', pairing);

            case 11:
              return _context.abrupt('return', null);

            case 12:
              return _context.abrupt('return', DeviceHasUser.build(pairing, { isNewRecord: false }));

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return DeviceHasUser;
};
//# sourceMappingURL=device_has_user.js.map
