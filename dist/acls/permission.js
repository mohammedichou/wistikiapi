'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dynamicAcl = require('dynamic-acl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Permission = function () {
	/**
  *
  * @param {Acl} acl
  * @param {string} name
  * @param {Array.<string>} privileges
  */
	function Permission(acl, name, privileges) {
		(0, _classCallCheck3.default)(this, Permission);

		this.acl = acl;
		this.name = name;
		this.privileges;
		this.acl.addResource(new _dynamicAcl.Resource(name, privileges));
	}

	(0, _createClass3.default)(Permission, [{
		key: 'build',
		value: function build() {}
	}, {
		key: 'allow',
		value: function allow(roleId, privilege, condition) {
			this.acl.allow(roleId, this.name, privilege, condition);
		}
	}, {
		key: 'deny',
		value: function deny(roleId, privilege, condition) {
			this.acl.deny(roleId, this.name, privilege, condition);
		}
	}]);
	return Permission;
}();

exports.default = Permission;
//# sourceMappingURL=permission.js.map
