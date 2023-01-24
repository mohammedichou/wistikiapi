'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sns = require('../../lib/sns');

var _cache = require('../../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  var Device = sequelize.define('device', {
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sns_arn: {
      type: DataTypes.STRING,
      allowNull: true

    },
    app_version: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, {
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: true,
    hooks: {
      beforeCreate: function beforeCreate(device, fn) {
        device.creation_date = (0, _moment2.default)().utc();
        device.update_date = (0, _moment2.default)().utc();
      },
      beforeUpdate: function beforeUpdate(device, fn) {
        device.update_date = (0, _moment2.default)().utc();
      }
    }
  });
  /**
   * Get the last position of this Wistiki. If no position found, null is returned
   * @returns {Promise.<*>}
   */
  Device.prototype.getLastPosition = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var cachedPosition, positions;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _cache2.default.getLastDevicePosition(this.get('uid'));

          case 2:
            cachedPosition = _context.sent;

            if (cachedPosition) {
              _context.next = 11;
              break;
            }

            _context.next = 6;
            return this.getPositions({
              order: [['id', 'DESC']],
              limit: 1,
              joinTableAttributes: []
            });

          case 6:
            positions = _context.sent;

            if (!positions.length) {
              _context.next = 10;
              break;
            }

            _cache2.default.setLastDevicePosition(this.uid, positions[0].get({ plain: true }));
            return _context.abrupt('return', positions[0]);

          case 10:
            return _context.abrupt('return', null);

          case 11:
            return _context.abrupt('return', cachedPosition);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  /**
   * Send push notification to this device
   *
   * @param data
   * @param collapseKey
   * @returns {Promise}
   */
  Device.prototype.notify = function (data, collapseKey) {
    var message = {
      default: data,
      GCM: {
        data: data,
        collapse_key: collapseKey

      },
      APNS: {
        data: data,
        aps: {
          'content-available': 1
        }
      }

    };
    return (0, _sns.notifyEndpoint)(this.get('sns_arn'), message, this.uid);
  };

  /**
   *
   * @param token
   * @param customUserData
   * @param environment
   * @return {Promise.<Device, Error>}
   */
  Device.prototype.updateSNSArn = function UpdateARN(token, customUserData, environment) {
    var _this = this;

    var arnCreation = function arnCreation(data) {
      return _this.cache().update({ sns_arn: data.EndpointArn });
    };

    if (_lodash2.default.lowerCase(this.manufacturer) === 'apple' && (this.type === 'mobile' || this.type === 'tablet')) {
      return (0, _sns.createiOSEndpoint)(token, customUserData, environment).then(arnCreation, function (err) {
        return _promise2.default.reject(new Error({
          token: token,
          custom_user_data: customUserData,
          platform: 'iOS',
          environment: environment,
          error: err
        }));
      });
    } else if (_lodash2.default.lowerCase(this.os) === 'android') {
      return (0, _sns.createAndroidEndpoint)(token, customUserData).then(arnCreation, function (err) {
        return _promise2.default.reject(new Error({
          token: token,
          custom_user_data: customUserData,
          error: err
        }));
      });
    }
  };

  Device.createOrUpdate = function (deviceData) {
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var environment = arguments[2];

    return Device.cache().upsert(deviceData).then(function () {
      return Device.cache().findById(deviceData.uid);
    })
    // Update SNS Arn if notification token is provided
    .then(function (device) {
      if (token) {
        return device.updateSNSArn(token, device.get('uid'), environment);
      }
      return device;
    });
  };
  return Device;
};
//# sourceMappingURL=device.js.map
