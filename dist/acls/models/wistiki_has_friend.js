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

var WistikiHasFriendModelPermission = function (_Permission) {
  (0, _inherits3.default)(WistikiHasFriendModelPermission, _Permission);

  function WistikiHasFriendModelPermission(acl) {
    (0, _classCallCheck3.default)(this, WistikiHasFriendModelPermission);
    return (0, _possibleConstructorReturn3.default)(this, (WistikiHasFriendModelPermission.__proto__ || (0, _getPrototypeOf2.default)(WistikiHasFriendModelPermission)).call(this, acl, 'wistiki_has_friend', ['get', 'create', 'update', 'remove', 'find']));
  }

  (0, _createClass3.default)(WistikiHasFriendModelPermission, [{
    key: 'build',
    value: function build() {
      this.allow('user', ['remove'], function (user, wistiki_has_friend) {
        return new _promise2.default(function (resolve, reject) {
          if (user.email == wistiki_has_friend.get('user_email')) {
            return resolve();
          } else {
            return wistiki_has_friend.getWistiki().then(function (wistiki) {
              return wistiki.getOwner();
            }).then(function (owners) {
              var owner = owners[0];
              if (owner.get('email') == user.email) {
                return resolve();
              }
              return reject();
            });
          }
        });
      });
    }
  }]);
  return WistikiHasFriendModelPermission;
}(_permission2.default);

exports.default = WistikiHasFriendModelPermission;
//# sourceMappingURL=wistiki_has_friend.js.map
