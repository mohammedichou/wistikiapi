'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acceptLanguage = undefined;

var _i18n = require('i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _acceptLanguage = require('accept-language');

var _acceptLanguage2 = _interopRequireDefault(_acceptLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_acceptLanguage2.default.languages(['en-US', 'fr-FR', 'de-DE', 'ja-JP']);
_i18n2.default.configure({
  locales: ['en', 'fr', 'de', 'ja'],
  directory: __dirname + '/../config/locales',
  defaultLocale: 'en'
});

exports.default = _i18n2.default;
exports.acceptLanguage = _acceptLanguage2.default;
//# sourceMappingURL=i18n.js.map
