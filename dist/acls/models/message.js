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

var MessageModelPermission = function (_Permission) {
	(0, _inherits3.default)(MessageModelPermission, _Permission);

	function MessageModelPermission(acl) {
		(0, _classCallCheck3.default)(this, MessageModelPermission);
		return (0, _possibleConstructorReturn3.default)(this, (MessageModelPermission.__proto__ || (0, _getPrototypeOf2.default)(MessageModelPermission)).call(this, acl, 'message', ['get', 'create', 'update', 'remove', 'find']));
	}

	(0, _createClass3.default)(MessageModelPermission, [{
		key: 'build',
		value: function build() {
			this.allow('user', ['get'], function (user, model) {
				return new _promise2.default(function (resolve, reject) {
					if (user.get('email') == model.get('user_email')) return resolve();else {
						return model.getThread().then(function (thread) {
							return thread.getParticipants({
								where: {
									email: user.get('email')
								}
							}).then(function (participants) {
								if (participants.length) return resolve();
								return reject();
							});
						});
					}
				});
			});
		}
	}]);
	return MessageModelPermission;
}(_permission2.default);

exports.default = MessageModelPermission;
//# sourceMappingURL=message.js.map
