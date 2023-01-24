'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _db = require('../../db');

var _email = require('../../lib/email');

var _email2 = _interopRequireDefault(_email);

var _i18n = require('../../lib/i18n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {

  /**
   * Verify id (token) and update user profile to Confirmed if verification succeed.
   * if user has status "CONFIRMED" it will return Bad Request error
   *
   * @param id
   * @param data
   * @param params
   * @return {Promise.<null>}
   */
  update: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id, data, params) {
      var userModel, languages;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context.sent;

              if (userModel) {
                _context.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', {
                errors: [{
                  message: 'User ' + params.email + ' not found'
                }]
              });

            case 5:
              if (!(userModel.status !== 'NOT CONFIRMED')) {
                _context.next = 7;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('OPERATION_NOT_PERMITTED', {
                errors: [{
                  message: 'User ' + params.email + ' has already confirmed his account'
                }]
              });

            case 7:
              if (!(userModel.confirmation_token !== id)) {
                _context.next = 9;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('CONFIRMATION_TOKEN_INVALID', {
                errors: [{
                  message: 'Confirmation token ' + id + ' invalid for user ' + params.email
                }]
              });

            case 9:
              _context.next = 11;
              return userModel.cache().update({
                confirmation_date: (0, _moment2.default)().utc(),
                confirmation_token: null,
                status: 'CONFIRMED'
              });

            case 11:
              userModel = _context.sent;


              // Send tutorial email with user language
              languages = _i18n.acceptLanguage.parse(userModel.locale);

              _email2.default.sendTutoEmail({
                email: userModel.email,
                user: userModel.get(),
                language: languages[0]
              });
              return _context.abrupt('return', null);

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function update(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return update;
  }(),

  /**
   * @param app
   * @param path
   */
  setup: function setup(app) {
    /* istanbul ignore next: should be tested when websockets are implemented */
    this.app = app;
    /* istanbul ignore next */
    this.service = app.service.bind(app);
    /* istanbul ignore next */
    this.filter(function () {
      return false;
    });
  }
};
exports.default = Service;
//# sourceMappingURL=confirmation.js.map
