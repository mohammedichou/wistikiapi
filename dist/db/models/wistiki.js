'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _logger = require('../../lib/logger');

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cache = require('../../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('wistiki:db:wistiki');
module.exports = function (sequelize, DataTypes) {
  var Wistiki = sequelize.define('wistiki', {
    serial_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    msn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mac_address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'FF:FF:FF:FF:FF:FF'
    },
    authentication_key: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recovery_key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF'
    },
    manufacturing_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    activation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_software_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_software_version: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'software',
        key: 'version'
      }
    },
    flan: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    authorization_key: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_reset_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    model_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'software',
        key: 'model_id'
      }
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: true
  });
  Wistiki.prototype.getMsnCipher = function () {
    debug('getMsnCipher');
    var secret = Buffer.from(this.recovery_key.replace(/:/g, ''), 'hex');
    var plain = Buffer.alloc(16);
    plain.fill(0);
    plain.writeUIntBE(this.msn, 0, 3);
    var cipher = _crypto2.default.createCipheriv('aes-128-ecb', secret, '').update(plain);
    debug('MSN Cipher Calculation', {
      event: 'msn cipher calculation',
      wistiki: this.get({ plain: true }),
      msn_cipher: {
        secret: secret.toString('hex'),
        plain: plain.toString('hex'),
        cipher: cipher.toString('hex')
      }
    });
    return cipher;
  };

  Wistiki.prototype.compareMsnCipher = function (msnCipher) {
    debug('compareMSNCipher: ', msnCipher);
    var requestMsnCipher = Buffer.from(msnCipher.replace(/:/g, ''), 'hex');
    debug('requestMsnCipher: ', requestMsnCipher);
    var wistikiMsnCipher = this.getMsnCipher();
    debug('calculatedMSNCipher: ', this.getMsnCipher());
    if (requestMsnCipher.compare(wistikiMsnCipher) !== 0) {
      debug('compareMsnCipher', {
        event: 'compareMsnCipher',
        wistiki: this.get({ plain: true }),
        msn_cipher: {
          given: msnCipher,
          calculated: wistikiMsnCipher.toString('hex')
        },
        result: requestMsnCipher.compare(wistikiMsnCipher) === 0
      });
    }

    return requestMsnCipher.compare(wistikiMsnCipher) === 0;
  };

  /**
   * Creates a recovery cipher by using recovery key and recovery token sent by the app
   *
   * @param token Recovery token
   * @return {Buffer}
   */
  Wistiki.prototype.getRecoveryCipher = function (token) {
    var secret = Buffer.from(this.recovery_key.replace(/:/g, ''), 'hex');

    var plain = Buffer.from(token.replace(/:/g, ''), 'hex');
    var cipher = _crypto2.default.createCipheriv('aes-128-ecb', secret, '').update(plain);
    return cipher;
  };

  /**
   * Creates a 128bits key and set it as authorization_key
   */
  Wistiki.prototype.generateAuthorizationKey = function () {
    var key = _nodeUuid2.default.v4();
    debug('generateAuthorizationKey', this);
    debug('generateAuthorizationKey for ' + this.get('serial_number') + ' ->', key);
    this.set('authorization_key', key);
  };

  Wistiki.prototype.resetWistiki = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _this = this;

    var friends, _ref2, _ref3, owner;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.set('authentication_key', null);
            _context.next = 3;
            return this.getFriends();

          case 3:
            friends = _context.sent;

            _lodash2.default.each(friends, function (friend) {
              _index.WistikiHasFriend.deleteUserPairing(friend.email, _this.serial_number);
            });
            _context.next = 7;
            return this.getOwner();

          case 7:
            _ref2 = _context.sent;
            _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
            owner = _ref3[0];

            _index.WistikiHasOwner.deleteUserPairing(owner.email, this.serial_number);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  /**
   * Returns last Wistiki position. It starts by checking cache. If it does not find any
   * record, then if will request a record from database. If a record is found in database
   * then it store it in cache and return the object representation of the position. It nothing
   * found in databse, then null is returned
   *
   * @return {null|Promise.<object>}
   */
  Wistiki.prototype.getLastPosition = function () {
    var _this2 = this;

    return _cache2.default.getLastWistikiPosition(this.get('serial_number')).then(function (cachePosition) {
      if (cachePosition) {
        debug('position found in cache for wistiki ' + _this2.get('serial_number'), cachePosition);
        cachePosition.formatted_address = cachePosition.formatted_address !== '' ? cachePosition.formatted_address : cachePosition.street_number + ' ' + cachePosition.street_name + ' ' + cachePosition.city;
        return cachePosition;
      }
      return _promise2.default.reject();
    }).catch(function (e) {
      debug('position not found in cache for wistiki ' + _this2.get('serial_number'), (0, _stringify2.default)(e));
      return _this2.getPositions({
        order: [['id', 'DESC']],
        limit: 1,
        joinTableAttributes: []
      }).then(function (positions) {
        debug('found ' + positions.length + ' positions in database');
        if (positions.length) {
          var pos = positions[0].get({ plain: true });
          pos.formatted_address = pos.formatted_address !== '' ? pos.formatted_address : pos.street_number + ' ' + pos.street_name + ' ' + pos.city;
          return _cache2.default.setLastWistikiPosition(_this2.get('serial_number'), pos).then(function (cachePosition) {
            debug('now in cache ', cachePosition);
            return pos;
          }).then(function (position) {
            debug('position set in cache. Will return', position);
            return position;
          });
        }
        return null;
      });
    });
  };
  Wistiki.getChecksum = function (serialNumber) {};
  return Wistiki;
};
//# sourceMappingURL=wistiki.js.map
