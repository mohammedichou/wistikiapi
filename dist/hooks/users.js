'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _service = require('./service');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Before to creating user, hash his password
_service.users.before({
	create: function create(hook, next) {
		hook.data.user.password = _crypto2.default.createHash(_config2.default.password.type).update(hook.data.user.password + _config2.default.password.salt).digest(_config2.default.password.digest);
		next();
	}
});
//# sourceMappingURL=users.js.map
