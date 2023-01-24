'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _db = require('../../db');

var _email = require('../../lib/email');

var _email2 = _interopRequireDefault(_email);

var _i18n = require('../../lib/i18n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');
_awsSdk2.default.config.update({ region: 'eu-central-1' });

var Service = {

  /**
   * Send an email with forgot password link
   * @param data
   */
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
      var userModel, languages;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.User.cache().findById(data.email);

            case 2:
              userModel = _context.sent;

              if (userModel) {
                _context.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('EMAIL_NOT_FOUND');

            case 5:
              _context.next = 7;
              return userModel.cache().update({
                password_reset_token: _nodeUuid2.default.v4(),
                password_reset_date: (0, _moment2.default)().utc()
              });

            case 7:
              languages = _i18n.acceptLanguage.parse(userModel.locale);

              _email2.default.sendForgotPasswordEmail({
                email: userModel.email,
                user: userModel,
                password_reset_token: userModel.password_reset_token,
                language: languages[0]
              });

              return _context.abrupt('return', null);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function create(_x) {
      return _ref.apply(this, arguments);
    }

    return create;
  }(),

  /**
   * Update password
   * @param id
   * @param data
   */
  update: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(id, data) {
      var userModel;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _db.User.cache().findById(id);

            case 2:
              userModel = _context2.sent;

              if (userModel) {
                _context2.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + id + ' not found' }] });

            case 5:
              if (!(userModel.password_reset_token !== data.password_reset_token)) {
                _context2.next = 7;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('TOKEN_MISMATCH', { errors: [{ message: 'Password reset token ' + data.password_reset_token + ' wrong' }] });

            case 7:
              _context2.next = 9;
              return userModel.cache().update({
                password_reset_token: null,
                password_reset_date: null,
                password: _db.User.hashPassword(data.new_password)
              });

            case 9:
              return _context2.abrupt('return', null);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function update(_x2, _x3) {
      return _ref2.apply(this, arguments);
    }

    return update;
  }(),

  /**
   * @param app
   * @param path
   */
  setup: function setup(app) {
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    this.service = app.service.bind(app);
    this.filter(function () {
      return false;
    });
  }
};

exports.default = Service;
//# sourceMappingURL=root.js.map
