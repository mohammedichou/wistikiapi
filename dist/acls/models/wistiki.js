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

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _permission = require('../permission');

var _permission2 = _interopRequireDefault(_permission);

var _index = require('../../db/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
var debug = require('debug')('darwin:acls:models:wistiki');

var WistikiPermission = function (_Permission) {
  (0, _inherits3.default)(WistikiPermission, _Permission);

  function WistikiPermission(acl) {
    (0, _classCallCheck3.default)(this, WistikiPermission);
    return (0, _possibleConstructorReturn3.default)(this, (WistikiPermission.__proto__ || (0, _getPrototypeOf2.default)(WistikiPermission)).call(this, acl, 'wistiki', ['get', 'create', 'update', 'remove', 'find', 'add_friend', 'remove_friend', 'transfer_ownership']));
  }

  (0, _createClass3.default)(WistikiPermission, [{
    key: 'build',
    value: function build() {
      var _this2 = this;

      this.allow('user', ['get', 'update', 'remove_friend'], function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(user, wistiki) {
          var friendPairing, ownerPairing;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _index.WistikiHasFriend.getUserPairing(user.email, wistiki.serial_number);

                case 2:
                  friendPairing = _context.sent;
                  ownerPairing = _index.WistikiHasOwner.getUserPairing(user.email, wistiki.serial_number);

                  if (!(!friendPairing && !ownerPairing)) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt('return', _promise2.default.reject());

                case 6:
                  return _context.abrupt('return', _promise2.default.resolve());

                case 7:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this2);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
      this.allow('user', ['add_friend', 'transfer_ownership'], function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(user, wistiki) {
          var ownerPairing;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  ownerPairing = _index.WistikiHasOwner.getUserPairing(user.email, wistiki.serial_number);

                  if (ownerPairing) {
                    _context2.next = 3;
                    break;
                  }

                  return _context2.abrupt('return', _promise2.default.reject());

                case 3:
                  return _context2.abrupt('return', _promise2.default.resolve());

                case 4:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
      this.allow('application', ['get', 'update', 'create', 'remove']);
    }
  }]);
  return WistikiPermission;
}(_permission2.default);

exports.default = WistikiPermission;
//# sourceMappingURL=wistiki.js.map
