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

var _cache = require('../../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('wistiki:db:wistiki_has_owner');

module.exports = function (sequelize, DataTypes) {
  var WistikiHasOwner = sequelize.define('wistiki_has_owner', {
    wistiki_serial_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'wistiki',
        key: 'serial_number'
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
    wistiki_alias: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wistiki_picture: {
      type: DataTypes.STRING
    },
    is_lost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    link_loss: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    inverted_link_loss: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '0'
    },
    ownership_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    ownership_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    color: {
      type: DataTypes.ENUM('PINK', 'ORANGE', 'PURPLE', 'YELLOW', 'LACOSTE'),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'ownership_start_date',
    updatedAt: false,
    deletedAt: 'ownership_end_date',
    paranoid: true,
    defaultScope: {
      where: {
        ownership_end_date: null
      }
    },
    scopes: {
      not_active: {
        where: {
          ownership_end_date: {
            $ne: null
          }
        }
      }
    }
  });
  WistikiHasOwner.beforeCreate(function (wistikiOwner) {
    // eslint-disable-next-line no-param-reassign
    wistikiOwner.ownership_start_date = (0, _moment2.default)().utc();
  });

  /**
   * Delete WistikiHasOwner entry from cache and database
   * @param email
   * @param serialNumber
   * @return {Promise.<*[]>}
   */
  WistikiHasOwner.deleteUserPairing = function (email, serialNumber) {
    return _promise2.default.all([_cache2.default.deleteWistikiHasOwner(email, serialNumber), WistikiHasOwner.destroy({
      where: {
        wistiki_serial_number: serialNumber,
        user_email: email,
        ownership_end_date: null
      }
    })]);
  };

  /**
   * Retrieve WistikiHasOwner entry from cache if available. If not, it queries database and cache
   * result for future use.
   * @param email
   * @param serialNumber
   * @return {Promise.<WistikiHasOwner>}
   */
  WistikiHasOwner.getUserPairing = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(email, serialNumber) {
      var pairing;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _cache2.default.getWistikiHasOwner(email, serialNumber);

            case 2:
              pairing = _context.sent;

              debug(pairing);

              if (pairing) {
                _context.next = 13;
                break;
              }

              _context.next = 7;
              return WistikiHasOwner.findOne({
                where: {
                  user_email: email,
                  wistiki_serial_number: serialNumber,
                  ownership_end_date: null
                }
              });

            case 7:
              pairing = _context.sent;

              if (!pairing) {
                _context.next = 12;
                break;
              }

              _context.next = 11;
              return WistikiHasOwner.cache().client().set(['wistiki_has_owner', serialNumber, email], (0, _stringify2.default)(pairing.get({ plain: true })));

            case 11:
              return _context.abrupt('return', pairing);

            case 12:
              return _context.abrupt('return', null);

            case 13:
              return _context.abrupt('return', WistikiHasOwner.build(pairing, { isNewRecord: false }));

            case 14:
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
  WistikiHasOwner.prototype.isActive = function () {
    return this.ownership_end_date === null;
  };

  return WistikiHasOwner;
};
//# sourceMappingURL=wistiki_has_owner.js.map
