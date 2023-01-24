'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _aclMiddleware = require('../../middlewares/aclMiddleware');

var _i18n = require('../../lib/i18n');

var _photoUploader = require('../../lib/photoUploader');

var _photoUploader2 = _interopRequireDefault(_photoUploader);

var _db = require('../../db');

var _email = require('../../lib/email');

var _email2 = _interopRequireDefault(_email);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');
_awsSdk2.default.config.update({ region: 'eu-central-1' });

var debug = require('debug')('darwin:users');

var Service = {
  /**
   * Get user by id. Throws an error if none can be found
   * Typical use case: Customer support trying to access customer information.
   *
   * @param id requested user id
   * @param params
   */
  get: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id, params) {
      var user, isAuthorized;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.User.cache().findById(id);

            case 2:
              user = _context.sent;

              if (user) {
                _context.next = 5;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + id + ' not found' }] });

            case 5:
              _context.next = 7;
              return _aclMiddleware.ModelAcl.isAllowed(params.user, user, 'get').then(function () {
                return true;
              }, function () {
                return false;
              });

            case 7:
              isAuthorized = _context.sent;

              if (isAuthorized) {
                _context.next = 10;
                break;
              }

              throw new _index2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to access this resource'
                }]
              });

            case 10:
              return _context.abrupt('return', _lodash2.default.omit(user.get({ plain: true }), _config.sensibleData.user));

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function get(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return get;
  }(),

  /**
   * User account creation. By default, user account will have status NOT CONFIRMED except
   * for black listed domains as they have issues to receive confirmation email.
   *
   * @param body - passed data from request
   * @param params - params send with the request
   * @returns {Promise} - Rejected when user email already exists, avatar in invalid format
   * resolved when user is added to database successfully
   */
  create: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(body, params) {
      var data, userModel, headers, languages, language, avatarUrl;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              data = _lodash2.default.pick(body, ['email', 'password', 'first_name', 'last_name', 'gender', 'phone_number', 'avatar_base64']);
              _context2.next = 3;
              return _db.User.cache().findById(data.email);

            case 3:
              userModel = _context2.sent;

              if (!userModel) {
                _context2.next = 6;
                break;
              }

              throw new _index2.default.Conflict('ACCOUNT_ALREADY_EXIST', { errors: [{ message: 'User ' + data.email + ' already exist' }] });

            case 6:
              if (!(data.avatar_base64 && (data.avatar_base64.split(',').length === 1 || !_validator2.default.isBase64(data.avatar_base64.split(',')[1])))) {
                _context2.next = 8;
                break;
              }

              throw new _index2.default.BadRequest('INVALID_AVATAR_FORMAT');

            case 8:
              headers = params.headers ? _lodash2.default.assign({ 'accept-language': 'en-US' }, params.headers) : {
                'accept-language': 'en-US'
              };
              languages = _i18n.acceptLanguage.parse(headers['accept-language']);

              debug('detected languages', (0, _stringify2.default)(languages, null, 2));
              language = 'en-US';
              /* istanbul ignore else */

              if (languages.length) {
                language = '' + languages[0];
              }

              data.locale = language;

              /* istanbul ignore else */

              if (!data.avatar_base64) {
                _context2.next = 19;
                break;
              }

              _context2.next = 17;
              return _photoUploader2.default.upload('avatars.wistiki.2', data.email + '_' + (0, _moment2.default)().unix(), data.avatar_base64).catch(function () {
                return null;
              });

            case 17:
              avatarUrl = _context2.sent;

              if (avatarUrl) {
                data.avatar_url = decodeURIComponent(avatarUrl);
              }

            case 19:
              _context2.next = 21;
              return _db.User.cache().create(data);

            case 21:
              userModel = _context2.sent;

              if (_lodash2.default.includes(_config2.default.email.ignoredConfirmationDomains, userModel.email.replace(/.*@/, ''))) {
                _context2.next = 26;
                break;
              }

              _email2.default.sendAccountConfirmationEmail({
                email: userModel.email,
                first_name: userModel.first_name ? userModel.first_name : '',
                confirmation_token: userModel.confirmation_token,
                language: language
              });
              //if (language == 'fr-FR') {
              //  EmailService.sendPromoWistiKeys({
              //  email: userModel.email,
              //  first_name: userModel.first_name ? userModel.first_name : '',
              //  confirmation_token: userModel.confirmation_token,
              //  language,
              //});
              //}  

              _context2.next = 29;
              break;

            case 26:
              _context2.next = 28;
              return userModel.cache().update({
                confirmation_date: (0, _moment2.default)().utc(),
                confirmation_token: null,
                status: 'CONFIRMED'
              });

            case 28:

              _email2.default.sendTutoEmail({
                email: userModel.email,
                user: userModel,
                language: language
              });

            case 29:
              return _context2.abrupt('return', _lodash2.default.omit(userModel.get(), _config.sensibleData.user));

            case 30:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function create(_x3, _x4) {
      return _ref2.apply(this, arguments);
    }

    return create;
  }(),


  /**
   * Updates user infos (first_name, last_name, gender, phone number, avatar picture, locale).
   *
   * @param id    user email
   * @param body request body
   * @param params
   * @return {Promise.<Object>} User data without sensible data
   */
  update: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, body, params) {
      var data, userModel, isAuthorized, avatarBase64, avatarUrl;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              data = _lodash2.default.pick(body, ['first_name', 'last_name', 'gender', 'phone_number', 'avatar_base64', 'locale']);
              _context3.next = 3;
              return _db.User.cache().findById(id);

            case 3:
              userModel = _context3.sent;

              if (userModel) {
                _context3.next = 6;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + id + ' not found' }] });

            case 6:
              _context3.next = 8;
              return _aclMiddleware.ModelAcl.isAllowed(params.user, userModel, 'update').then(function () {
                return true;
              }, function () {
                return false;
              });

            case 8:
              isAuthorized = _context3.sent;

              if (isAuthorized) {
                _context3.next = 11;
                break;
              }

              throw new _index2.default.Forbidden(('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to update this resource'
                }]
              }));

            case 11:
              avatarBase64 = data.avatar_base64 || '';
              /* istanbul ignore else */

              if (!avatarBase64) {
                _context3.next = 19;
                break;
              }

              if (!(avatarBase64.split(',').length === 1 || !_validator2.default.isBase64(avatarBase64.split(',')[1]))) {
                _context3.next = 15;
                break;
              }

              throw new _index2.default.BadRequest('INVALID_AVATAR_FORMAT');

            case 15:
              _context3.next = 17;
              return _photoUploader2.default.upload('avatars.wistiki.2', id + '_' + (0, _moment2.default)().unix(), avatarBase64).catch(function () {
                return null;
              });

            case 17:
              avatarUrl = _context3.sent;

              if (avatarUrl) {
                data.avatar_url = decodeURIComponent(avatarUrl);
              }

            case 19:
              _context3.next = 21;
              return userModel.cache().update(data);

            case 21:
              userModel = _context3.sent;
              return _context3.abrupt('return', _lodash2.default.omit(userModel.get(), _config.sensibleData.user));

            case 23:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function update(_x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    }

    return update;
  }(),


  /**
   * Make User account DESACTIVATED (keep it in database)
   * Typical use case: Customer support disable user account upon his request
   *
   * @param id resource email address
   * @param params
   * @return {Promise.<void>}
   */
  remove: function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(id, params) {
      var userModel, isAuthorized;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _db.User.cache().findById(id);

            case 2:
              userModel = _context4.sent;

              if (userModel) {
                _context4.next = 5;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + id + ' not found' }] });

            case 5:
              _context4.next = 7;
              return _aclMiddleware.ModelAcl.isAllowed(params.user, userModel, 'remove').then(function () {
                return true;
              }, function () {
                return false;
              });

            case 7:
              isAuthorized = _context4.sent;

              if (isAuthorized) {
                _context4.next = 10;
                break;
              }

              throw new _index2.default.Forbidden(('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to remove this resource'
                }]
              }));

            case 10:
              _context4.next = 12;
              return userModel.cache().update({ status: 'DESACTIVATED' });

            case 12:
              return _context4.abrupt('return', null);

            case 13:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function remove(_x8, _x9) {
      return _ref4.apply(this, arguments);
    }

    return remove;
  }(),

  /**
   * TODO: write unit tests for /users service setup
   * @param app
   * @param path
   */
  setup: function setup(app) {
    /* istanbul ignore next */
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    /* istanbul ignore next */
    this.service = app.service.bind(app);
    /* istanbul ignore next */
    this.filter({
      created: function created() {
        return false;
      },
      removed: function removed() {
        return false;
      },
      updated: function updated(data, connection, hook) {
        /* istanbul ignore next */
        debug('updated users/:user', data);
        /* istanbul ignore next */
        debug(hook);
        /* istanbul ignore next */
        if (!connection.user) return false;
        /* istanbul ignore next */
        if (connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1) return false;
        /* istanbul ignore next */
        return data;
      }
    });
  }
};

exports.default = Service;
//# sourceMappingURL=root.js.map
