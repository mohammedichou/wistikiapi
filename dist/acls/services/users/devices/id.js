'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _permission = require('../../../permission');

var _permission2 = _interopRequireDefault(_permission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserDeviceServicePermission = function (_Permission) {
  (0, _inherits3.default)(UserDeviceServicePermission, _Permission);

  function UserDeviceServicePermission(acl) {
    (0, _classCallCheck3.default)(this, UserDeviceServicePermission);
    return (0, _possibleConstructorReturn3.default)(this, (UserDeviceServicePermission.__proto__ || (0, _getPrototypeOf2.default)(UserDeviceServicePermission)).call(this, acl, '/users/:email/devices/:__feathersId', ['GET', 'PUT', 'DELETE']));
  }

  (0, _createClass3.default)(UserDeviceServicePermission, [{
    key: 'build',
    value: function build() {
      this.allow('user', ['GET', 'PUT', 'DELETE'], function (user, req) {
        return new _promise2.default(function (resolve, reject) {
          if (user.email === req.params.email) {
            return resolve();
          }
          return reject();
        });
      });
    }
  }]);
  return UserDeviceServicePermission;
}(_permission2.default);

exports.default = UserDeviceServicePermission;
//# sourceMappingURL=id.js.map
