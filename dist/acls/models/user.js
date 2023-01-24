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

var _permission = require('../permission');

var _permission2 = _interopRequireDefault(_permission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserPermission = function (_Permission) {
  (0, _inherits3.default)(UserPermission, _Permission);

  function UserPermission(acl) {
    (0, _classCallCheck3.default)(this, UserPermission);
    return (0, _possibleConstructorReturn3.default)(this, (UserPermission.__proto__ || (0, _getPrototypeOf2.default)(UserPermission)).call(this, acl, 'user', ['get', 'create', 'update', 'remove', 'find', 'find_messages', 'find_threads']));
  }

  (0, _createClass3.default)(UserPermission, [{
    key: 'build',
    value: function build() {
      this.allow('anonymous', 'create');
      this.allow('user', ['get', 'update', 'find_messages', 'find_threads'], function (user, model) {
        return new _promise2.default(function (resolve, reject) {
          if (!user) {
            return reject();
          }
          if (user.email === model.email) {
            return resolve();
          }
          return reject();
        });
      });
    }
  }]);
  return UserPermission;
}(_permission2.default);

exports.default = UserPermission;
//# sourceMappingURL=user.js.map
