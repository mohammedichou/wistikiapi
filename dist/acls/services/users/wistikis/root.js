'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var UserWistikisServicePermission = function (_Permission) {
	(0, _inherits3.default)(UserWistikisServicePermission, _Permission);

	function UserWistikisServicePermission(acl) {
		(0, _classCallCheck3.default)(this, UserWistikisServicePermission);
		return (0, _possibleConstructorReturn3.default)(this, (UserWistikisServicePermission.__proto__ || (0, _getPrototypeOf2.default)(UserWistikisServicePermission)).call(this, acl, '/users/:email/wistikis', ['GET', 'POST']));
	}

	(0, _createClass3.default)(UserWistikisServicePermission, [{
		key: 'build',
		value: function build() {
			this.allow('user', ['GET', 'POST']);
		}
	}]);
	return UserWistikisServicePermission;
}(_permission2.default);

exports.default = UserWistikisServicePermission;
//# sourceMappingURL=root.js.map
