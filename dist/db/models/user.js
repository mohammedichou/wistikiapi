'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
var debug = require('debug')('darwin:models:user');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: true,
      defaultValue: 'M'
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    confirmation_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('CONFIRMED', 'NOT CONFIRMED', 'DESACTIVATED'),
      allowNull: false,
      defaultValue: 'CONFIRMED'
    },
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_reset_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    locale: {
      type: DataTypes.ENUM('en-US', 'fr-FR', 'de-DE', 'ja-JP'),
      allowNull: false,
      defaultValue: 'en-US'
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: 'update_date',
    deletedAt: false,
    paranoid: true,
    hooks: {
      beforeCreate: function beforeCreate(user) {
        user.creation_date = (0, _moment2.default)().utc();
        user.update_date = (0, _moment2.default)().utc();
        user.confirmation_token = _nodeUuid2.default.v4();
        user.password = User.hashPassword(user.password);
      },
      beforeUpdate: function beforeUpdate(user) {
        user.update_date = (0, _moment2.default)().utc();
      }
    }
  });

  /**
   * Verifies plain password against stored hashed password.
   * @param {string} password string to check against user password
   * @return {boolean} true if provided string matches stored user password
   */
  User.prototype.verifyPassword = function (password) {
    var hash = User.hashPassword(password);
    return this.password === hash;
  };
  /**
   *
   * @param uid uid to eliminate
   * @returns {*}
   */
  User.prototype.getDevicesSnsArns = function () {
    var uid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    return this.getOwnedDevices().then(function (devices) {
      var list = _lodash2.default.filter(devices.map(function (device) {
        if (device.get('uid') !== uid) {
          return device.get('sns_arn');
        }
        return null;
      }), function (d) {
        return !_lodash2.default.isEmpty(d);
      });
      return list;
    });
  };

  /**
   * Notifies all user devices that does not match given uid
   *
   * @param uid default value null
   * @param notification object
   * @param notificationId
   * @returns {Promise}
   */
  User.prototype.notifyDevices = function (notification, notificationId) {
    var uid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    return this.getOwnedDevices().then(function (devices) {
      _lodash2.default.forEach(devices, function (device) {
        if (device.uid !== uid && device.sns_arn != null) {
          device.notify(notification, notificationId);
        }
      });
    });
  };

  /**
   * Retrieve all wistikis that belongs to user
   *
   * @returns {Promise.<Array.Wistiki>} Wistiki models arrays
   */
  User.prototype.getUserWistikis = function () {
    var ownedWistikis = this.getActiveOwnership();
    var sharedWistikis = this.getActiveSharedWistikis();
    return _promise2.default.all([ownedWistikis, sharedWistikis]).then(function (arrays) {
      return _lodash2.default.flatten(arrays);
    });
  };

  /**
   * Returns JSON Object representing the user model without sensible data
   *
   * @returns {}
   */
  User.prototype.getNonSensibleData = function () {
    return _lodash2.default.omit(this.get({ plain: true }), _config.sensibleData.user);
  };

  /**
   * Check if user email exist or not. If does not exist, it return BadRequest
   * (BAD_CREDENTIALS_ERROR) Error.
   * If user instance if found, checks if user account is confirmed or not. If not returns
   * BadRequest (ACCOUNT_NOT_CONFIRMED_ERROR) Error
   *
   * @param email {String}
   * @return {Promise.<errors.BadRequest|User>}
   */
  User.checkAccount = function (email) {
    return User.cache().findById(email).then(function (user) {
      if (!user) {
        return _promise2.default.reject(new _feathersErrors2.default.BadRequest('BAD_CREDENTIALS_ERROR'));
      }
      // Check account status
      if (user.status === 'NOT CONFIRMED') {
        return _promise2.default.reject(new _feathersErrors2.default.BadRequest('ACCOUNT_NOT_CONFIRMED_ERROR'));
      }
      return user;
    });
  };

  User.hashPassword = function (password) {
    return _crypto2.default.createHash(_config2.default.password.type).update(password + _config2.default.password.salt).digest(_config2.default.password.digest);
  };
  return User;
};
//# sourceMappingURL=user.js.map
