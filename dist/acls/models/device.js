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

var _db = require('../../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeviceModelPermission = function (_Permission) {
  (0, _inherits3.default)(DeviceModelPermission, _Permission);

  function DeviceModelPermission(acl) {
    (0, _classCallCheck3.default)(this, DeviceModelPermission);
    return (0, _possibleConstructorReturn3.default)(this, (DeviceModelPermission.__proto__ || (0, _getPrototypeOf2.default)(DeviceModelPermission)).call(this, acl, 'device', ['get', 'create', 'update', 'remove', 'find']));
  }

  (0, _createClass3.default)(DeviceModelPermission, [{
    key: 'build',
    value: function build() {
      var _this2 = this;

      this.allow('user', ['find']);
      this.allow('user', ['get', 'update', 'remove'], function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(user, device) {
          var devicePairing;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _db.DeviceHasUser.getDevicePairing(user.email, device.uid);

                case 2:
                  devicePairing = _context.sent;

                  if (devicePairing) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt('return', _promise2.default.reject());

                case 5:
                  return _context.abrupt('return', _promise2.default.resolve());

                case 6:
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
    }
  }]);
  return DeviceModelPermission;
}(_permission2.default);

exports.default = DeviceModelPermission;
//# sourceMappingURL=device.js.map
