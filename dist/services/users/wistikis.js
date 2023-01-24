'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _db = require('../../db');

var _logger = require('../../lib/logger');

var _config = require('../../config');

var _verhoeff = require('../../lib/verhoeff');

var _verhoeff2 = _interopRequireDefault(_verhoeff);

var _aclMiddleware = require('../../middlewares/aclMiddleware');

var _root = require('../wistikis/root');

var _root2 = _interopRequireDefault(_root);

var _photoUploader = require('../../lib/photoUploader');

var _photoUploader2 = _interopRequireDefault(_photoUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:services:wistikis');

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');

var Service = {
  /**
   * Get user Wistikis. This is typically used to fetch all information about user's wistikis
   * like the identity of the owner, the list of friends and wistiki's last position
   *
   * @param params
   */
  find: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(params) {
      var _this = this;

      var userModel, isAuthorized, ownedWistikis, sharedWistiki, wistikis;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context2.sent;

              if (userModel) {
                _context2.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + params.email + ' not found' }] });

            case 5:
              isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, userModel, 'get').then(function () {
                return true;
              }, function () {
                return false;
              });

              /* istanbul ignore else */

              if (isAuthorized) {
                _context2.next = 8;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to access this resource'
                }]
              });

            case 8:
              _context2.next = 10;
              return userModel.getActiveOwnership({ // retrieve user owned wistikis
                attributes: {
                  exclude: _lodash2.default.union(_config.sensibleData.wistiki, ['model_id'])
                },
                joinTableAttributes: [],
                include: [{
                  model: _db.Model
                }, {
                  model: _db.User,
                  as: 'owner',
                  attributes: {
                    exclude: _config.sensibleData.user
                  }
                }, { // User is the owner, so he has access to friends list
                  model: _db.User,
                  as: 'friends',
                  attributes: {
                    exclude: _config.sensibleData.user
                  }
                }]
              });

            case 10:
              ownedWistikis = _context2.sent;
              _context2.next = 13;
              return userModel.getActiveSharedWistikis({
                attributes: {
                  exclude: _lodash2.default.union(_config.sensibleData.wistiki, ['model_id'])
                },
                joinTableAttributes: [],
                include: [{
                  model: _db.Model
                }, { // Get Owner infos only as user is not the owner
                  model: _db.User,
                  as: 'owner',
                  attributes: {
                    exclude: _config.sensibleData.user
                  }
                }, { // User is not the owner, so get only its details
                  model: _db.User,
                  as: 'friends',
                  where: { email: userModel.email },
                  attributes: {
                    exclude: _config.sensibleData.user
                  }
                }]
              });

            case 13:
              sharedWistiki = _context2.sent;
              wistikis = _lodash2.default.flatten([ownedWistikis, sharedWistiki]);
              return _context2.abrupt('return', _promise2.default.all(_lodash2.default.map(wistikis, function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(wistiki) {
                  var wistikiObject, _wistikiObject$owner, position, serialNumber, cs, verifiedSerialNumber;

                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          wistikiObject = wistiki.get({ plain: true });
                          _wistikiObject$owner = (0, _slicedToArray3.default)(wistikiObject.owner, 1);
                          wistikiObject.owner = _wistikiObject$owner[0];
                          _context.next = 5;
                          return wistiki.getLastPosition();

                        case 5:
                          position = _context.sent;

                          if (position) {
                            debug('got position.coordinates: ', (0, _typeof3.default)(position.position.coordinates), position.position.coordinates);
                            wistikiObject.last_position = position;
                          }
                          serialNumber = '' + wistikiObject.serial_number;

                          if (!_verhoeff2.default.validate(serialNumber.substr(0, 11))) {
                            cs = _verhoeff2.default.generate(serialNumber.substr(0, 11));
                            verifiedSerialNumber = '' + serialNumber.substr(0, 11) + cs;

                            wistikiObject.serial_number = verifiedSerialNumber;
                            wistikiObject.owner.wistiki_has_owner.wistiki_serial_number = verifiedSerialNumber;
                            _lodash2.default.each(wistikiObject.friends, function (friend) {
                              friend.wistiki_has_friend.wistiki_serial_number = verifiedSerialNumber;
                            });
                          }
                          debug(wistikiObject);
                          return _context.abrupt('return', wistikiObject);

                        case 11:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }())));

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function find(_x) {
      return _ref.apply(this, arguments);
    }

    return find;
  }(),


  /**
   *
   * @param {integer} id
   * @param {object} bodyData
   * @param {object} params
   * @param {function} callback
   */
  // TODO: see how we can reuse wistiki service
  create: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(bodyData, params) {
      var userModel, wistikiModel, isAuthorized, _ref4, _ref5, wistikiOwner, infos, data, avatarUrl, _ref6, _ref7, owner, friends, lastPosition, resObject;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context3.sent;

              if (userModel) {
                _context3.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + params.email + ' not found' }] });

            case 5:
              _context3.next = 7;
              return _db.Wistiki.cache().findById(bodyData.serial_number);

            case 7:
              wistikiModel = _context3.sent;

              if (wistikiModel) {
                _context3.next = 11;
                break;
              }

              _logger.ownershiplLogger.error('Wistiki ' + bodyData.serial_number + ' not provisionned', {
                event: 'NOT_PROVISIONED',
                serial_number: bodyData.serial_number,
                user_email: params.user.email,
                request_data: bodyData // store request data so we can retrieve authentication key later
              });

              throw new _feathersErrors2.default.NotFound('NOT_PROVISIONED', { errors: [{ message: 'Wistiki ' + bodyData.serial_number + ' is not provisioned' }] });

            case 11:
              if (bodyData.msn_cipher) {
                _context3.next = 14;
                break;
              }

              _logger.ownershiplLogger.error('MSN cipher not provided', {
                event: 'MSN_CIPHER_REQUIRED',
                serial_number: wistikiModel.serial_number,
                user_email: params.user.email
              });

              throw new _feathersErrors2.default.BadRequest('SCHEMA_VALIDATION_FAILED', { errors: [{ message: 'MSN Cipher is required' }] });

            case 14:
              if (!(!_validator2.default.isHexadecimal(bodyData.msn_cipher.replace(/[-:]/g, '')) || !_validator2.default.isLength(bodyData.msn_cipher, 32, 48))) {
                _context3.next = 16;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('SCHEMA_VALIDATION_FAILED', {
                errors: [{ message: 'Invalid MSN Cipher format' }]
              });

            case 16:
              if (bodyData.authentication_key) {
                _context3.next = 19;
                break;
              }

              _logger.ownershiplLogger.error('Ownership request has empty authentication key', {
                reason: 'EMPTY_AUTH_KEY',
                serial_number: wistikiModel.serial_number,
                user_email: params.user.email
              });
              throw new _feathersErrors2.default.BadRequest('AUTHENTICATION_KEY_REQUIRED');

            case 19:
              if (!(bodyData.wistiki_picture_base64 && (bodyData.wistiki_picture_base64.split(',').length === 1 || !_validator2.default.isBase64(bodyData.wistiki_picture_base64.split(',')[1])))) {
                _context3.next = 21;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('INVALID_AVATAR_FORMAT');

            case 21:
              isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, _db.WistikiHasOwner, 'create').then(function () {
                return true;
              }, function () {
                return false;
              });

              /* istanbul ignore else */

              if (isAuthorized) {
                _context3.next = 24;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to access this resource'
                }]
              });

            case 24:
              if (wistikiModel.compareMsnCipher(bodyData.msn_cipher)) {
                _context3.next = 27;
                break;
              }

              _logger.ownershiplLogger.error('MSN Cipher mismatch', {
                event: 'compareMsnCipher',
                user_email: params.user.email,
                request_user_email: params.email,
                request_data: bodyData,
                wistiki: wistikiModel.get({ plain: true }),
                msn_cipher: {
                  given: bodyData.msn_cipher,
                  calculated: wistikiModel.getMsnCipher()
                }
              });
              throw new _feathersErrors2.default.BadRequest('REQUEST_AUTHENTICATION_FAILED');

            case 27:
              _context3.next = 29;
              return wistikiModel.getOwner();

            case 29:
              _ref4 = _context3.sent;
              _ref5 = (0, _slicedToArray3.default)(_ref4, 1);
              wistikiOwner = _ref5[0];

              if (!wistikiOwner) {
                _context3.next = 34;
                break;
              }

              throw new _feathersErrors2.default.Conflict('ALREADY_OWNED', { errors: [{ message: 'Wistiki ' + bodyData.serial_number + ' has an owner' }] });

            case 34:
              infos = {
                authentication_key: bodyData.authentication_key,
                last_software_update: bodyData.last_software_update ? bodyData.last_software_update : (0, _moment2.default)().utc(),
                last_software_version: bodyData.last_software_version,
                activation_date: (0, _moment2.default)().utc()
              };


              if (_lodash2.default.isEmpty(infos.last_software_version)) {
                infos = _lodash2.default.omit(infos, ['last_software_update', 'last_software_version']);
              }

              _context3.next = 38;
              return wistikiModel.cache().update(infos);

            case 38:
              data = _lodash2.default.pick(bodyData, ['wistiki_alias', 'is_lost', 'link_loss', 'inverted_link_loss', 'color', 'icon']);

              if (!bodyData.wistiki_picture_base64) {
                _context3.next = 44;
                break;
              }

              _context3.next = 42;
              return _photoUploader2.default.upload('avatars.wistiki.2', 'wistiki_picture/' + params.user.email + '_' + wistikiModel.serial_number + '_' + (0, _moment2.default)().unix(), bodyData.wistiki_picture_base64).catch(function () {
                return null;
              });

            case 42:
              avatarUrl = _context3.sent;

              if (avatarUrl) {
                data.avatar_url = decodeURIComponent(avatarUrl);
              }

            case 44:

              data.link_loss = data.link_loss ? 1 : 0;
              data.inverted_link_loss = data.inverted_link_loss ? 1 : 0;
              data.ownership_start_date = (0, _moment2.default)().utc();
              _context3.next = 49;
              return wistikiModel.setOwner(params.email, { through: data });

            case 49:
              _context3.next = 51;
              return wistikiModel.getOwner({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 51:
              _ref6 = _context3.sent;
              _ref7 = (0, _slicedToArray3.default)(_ref6, 1);
              owner = _ref7[0];
              _context3.next = 56;
              return wistikiModel.getFriends({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 56:
              friends = _context3.sent;
              _context3.next = 59;
              return wistikiModel.getLastPosition();

            case 59:
              lastPosition = _context3.sent;
              resObject = wistikiModel.get({ plain: true });

              resObject.last_position = lastPosition;
              resObject.owner = owner;
              resObject.friends = friends;

              return _context3.abrupt('return', _lodash2.default.omit(resObject, _config.sensibleData.wistiki));

            case 65:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function create(_x3, _x4) {
      return _ref3.apply(this, arguments);
    }

    return create;
  }(),
  update: function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(id, bodyData, params) {
      var userModel, wistikiModel, wistikiHasOwnerModel, wistikiHasFriendModel, isAuthorized, wistikiHasUserModel, data, avatarUrl, _ref9, _ref10, owner, friends, lastPosition, resObject;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              debug('update: ', id, bodyData);
              _context4.next = 3;
              return _db.User.cache().findById(params.email);

            case 3:
              userModel = _context4.sent;

              if (userModel) {
                _context4.next = 6;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + params.email + ' not found' }] });

            case 6:
              _context4.next = 8;
              return _db.Wistiki.cache().findById(params.verifiedSerialNumber);

            case 8:
              wistikiModel = _context4.sent;
              _context4.next = 11;
              return _db.WistikiHasOwner.getUserPairing(params.email, params.verifiedSerialNumber);

            case 11:
              wistikiHasOwnerModel = _context4.sent;
              _context4.next = 14;
              return _db.WistikiHasFriend.getUserPairing(params.email, params.verifiedSerialNumber);

            case 14:
              wistikiHasFriendModel = _context4.sent;

              if (!(!wistikiHasOwnerModel && !wistikiHasFriendModel)) {
                _context4.next = 17;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'Wistiki ' + id + ' has no association with user ' + params.email }] });

            case 17:
              isAuthorized = void 0;
              wistikiHasUserModel = void 0;


              if (wistikiHasOwnerModel) {
                isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, wistikiHasOwnerModel, 'update').then(function () {
                  return true;
                }, function () {
                  return false;
                });
                wistikiHasUserModel = wistikiHasOwnerModel;
              } else if (wistikiHasFriendModel) {
                isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, wistikiHasFriendModel, 'update').then(function () {
                  return true;
                }, function () {
                  return false;
                });
                wistikiHasUserModel = wistikiHasFriendModel;
              }
              /* istanbul ignore else */

              if (isAuthorized) {
                _context4.next = 22;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to update this resource'
                }]
              });

            case 22:
              if (!(bodyData.wistiki_picture_base64 && (bodyData.wistiki_picture_base64.split(',').length === 1 || !_validator2.default.isBase64(bodyData.wistiki_picture_base64.split(',')[1])))) {
                _context4.next = 24;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('INVALID_AVATAR_FORMAT');

            case 24:
              data = _lodash2.default.pick(bodyData, ['wistiki_alias', 'is_lost', 'link_loss', 'inverted_link_loss', 'color', 'icon']);

              if (!bodyData.wistiki_picture_base64) {
                _context4.next = 30;
                break;
              }

              _context4.next = 28;
              return _photoUploader2.default.upload('avatars.wistiki.2', 'wistiki_picture/' + params.user.email + '_' + wistikiModel.serial_number + '_' + (0, _moment2.default)().unix(), bodyData.wistiki_picture_base64).catch(function () {
                return null;
              });

            case 28:
              avatarUrl = _context4.sent;

              if (avatarUrl) {
                data.wistiki_picture = decodeURIComponent(avatarUrl);
              }

            case 30:

              data.link_loss = data.link_loss ? 1 : 0;
              data.inverted_link_loss = data.inverted_link_loss ? 1 : 0;
              _context4.next = 34;
              return wistikiHasUserModel.cache().update(data);

            case 34:

              debug(wistikiHasUserModel.get({ plain: true }));

              _context4.next = 37;
              return wistikiModel.getOwner({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 37:
              _ref9 = _context4.sent;
              _ref10 = (0, _slicedToArray3.default)(_ref9, 1);
              owner = _ref10[0];
              _context4.next = 42;
              return wistikiModel.getFriends({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 42:
              friends = _context4.sent;
              _context4.next = 45;
              return wistikiModel.getLastPosition();

            case 45:
              lastPosition = _context4.sent;
              resObject = _lodash2.default.omit(wistikiModel.get({ plain: true }), _config.sensibleData.wistiki);

              resObject.last_position = lastPosition;
              resObject.owner = owner.get({ plain: true });
              resObject.friends = _lodash2.default.map(friends, function (friend) {
                return friend.get({ plain: true });
              });

              if (wistikiHasFriendModel) {
                resObject.friends = _lodash2.default.filter(resObject.friends, function (friend) {
                  return friend.email === wistikiHasFriendModel.user_email;
                });
              }
              return _context4.abrupt('return', resObject);

            case 52:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function update(_x5, _x6, _x7) {
      return _ref8.apply(this, arguments);
    }

    return update;
  }(),

  /**
   * TODO: Description
   * @param app
   * @param path
   */
  setup: function setup(app) {
    this.app = app;
    this.service = app.service.bind(app);

    this.filter({
      created: function created(data, connection) {
        debug('created users/:user/wistikis/:sn', data);
        if (!connection.user) return false;

        if (connection.user.email !== data.owner.email) return false;

        if (!connection.device || connection.device.type === 'mobile' || connection.device.type === 'tablet') {
          return false;
        }
        return data;
      },
      removed: function removed() {
        return false;
      },
      updated: function updated(data, connection) {
        debug('updated users/:user/wistikis/:sn', data);
        if (!connection.user) return false;

        if (data.owner.email !== connection.user.email && data.friends.filter(function (friend) {
          return friend.email === connection.user.email;
        }).length === 0) {
          return false;
        }

        if (!connection.device) {
          return false;
        }
        return _lodash2.default.omit(data, ['authentication_key']);
      }
    });
  }
};

exports.default = Service;
//# sourceMappingURL=wistikis.js.map
