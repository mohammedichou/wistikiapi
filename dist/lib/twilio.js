'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:lib:twilio');

var CallCenter = function () {
	function CallCenter(accountSid, authToken) {
		(0, _classCallCheck3.default)(this, CallCenter);

		this._client = new _twilio2.default(accountSid, authToken);
	}

	(0, _createClass3.default)(CallCenter, [{
		key: 'call',
		value: function call(from, to) {
			var _this = this;

			var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "http://demo.twilio.com/docs/voice.xml";

			return new _promise2.default(function (resolve, reject) {
				_this._client.calls.create({
					url: url,
					to: to,
					from: from,
					method: 'GET'
				}, function (err, call) {

					if (err) {
						debug("error", err);
						reject(err);
					} else {
						debug("call", call.sid);
						resolve(call);
					}
				});
			});
		}
	}]);
	return CallCenter;
}();

exports.default = CallCenter;
//# sourceMappingURL=twilio.js.map
