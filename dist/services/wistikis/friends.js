'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _db = require('../../db');

var _config = require('../../config');

var _email = require('../../lib/email');

var _email2 = _interopRequireDefault(_email);

var _logger = require('../../lib/logger');

var _i18n = require('../../lib/i18n');

var _aclMiddleware = require('../../middlewares/aclMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:services:wistiki:friends');

var Service = {
  events: ['notification'],
  /**
   * Share Wistiki with a friend. Throws Error when:
   * - Wistiki is not foud, user has not the right to share the Wistiki,
   * - User tries to share his wistiki with himself
   * - Wistiki is already shared with friend
   * - No user with given email address is found in database.
   *
   * @param bodyData
   * @param params
   * @return {Promise.<*>}
   */
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(bodyData, params) {
      var wistikiModel, isAuthorized, wistikiFriends, newFriendModel, _ref2, _ref3, wistikiOwner, ownerSettings, languages, wistikiObject, lastWistikiPosition, friendNotificationData, ownerNotificationData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.Wistiki.cache().findById(params.verifiedSerialNumber);

            case 2:
              wistikiModel = _context.sent;

              if (wistikiModel) {
                _context.next = 6;
                break;
              }

              _logger.errorLog.info({
                serialNumber: params.sn,
                params: params
              });
              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistiki ' + params.sn + ' not found'] });

            case 6:

              // Check if user is authorized to add new friend to Wistiki
              isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, wistikiModel, 'add_friend').then(function () {
                return true;
              }, function () {
                return false;
              });
              /* istanbul ignore else */

              if (isAuthorized) {
                _context.next = 9;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to add friend to this resource'
                }]
              });

            case 9:
              if (!(bodyData.email === params.user.email)) {
                _context.next = 11;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('OPERATION_NOT_PERMITTED', { errors: ['User can\'t share Wistiki ' + params.sn + ' with himself'] });

            case 11:
              _context.next = 13;
              return _db.WistikiHasFriend.getUserPairing(bodyData.email, params.verifiedSerialNumber);

            case 13:
              wistikiFriends = _context.sent;

              if (!wistikiFriends) {
                _context.next = 16;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('ALREADY_SHARED', { errors: ['User ' + bodyData.email + ' is already a friend of Wistiki ' + params.sn] });

            case 16:
              _context.next = 18;
              return _db.User.cache().findById(bodyData.email);

            case 18:
              newFriendModel = _context.sent;
              _context.next = 21;
              return wistikiModel.getOwner();

            case 21:
              _ref2 = _context.sent;
              _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
              wistikiOwner = _ref3[0];
              ownerSettings = wistikiOwner.wistiki_has_owner;
              // If trying to share to user that does not exist, send email to friend to inform him

              if (newFriendModel) {
                _context.next = 29;
                break;
              }

              // user requester language
              languages = _i18n.acceptLanguage.parse(params.user.locale);

              _email2.default.sendNewFriendEmail({
                email: bodyData.email,
                user: params.user,
                wistiki: ownerSettings.wistiki_alias,
                language: languages[0]
              });

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['User ' + bodyData.email + ' not found'] });

            case 29:
              _context.next = 31;
              return newFriendModel.addActiveSharedWistiki(params.verifiedSerialNumber, {
                through: {
                  wistiki_alias: ownerSettings.wistiki_alias,
                  wistiki_picture: ownerSettings.wistiki_picture,
                  link_loss: ownerSettings.link_loss,
                  inverted_link_loss: ownerSettings.inverted_link_loss,
                  icon: ownerSettings.icon,
                  color: ownerSettings.color,
                  share_start_date: (0, _moment2.default)().utc()
                }
              });

            case 31:
              wistikiObject = _lodash2.default.omit(wistikiModel.get({ plain: true }), _config.sensibleData.wistiki);
              lastWistikiPosition = wistikiModel.getLastPosition();

              if (lastWistikiPosition) {
                wistikiObject.last_position = lastWistikiPosition;
              }

              // Notify friend devices
              friendNotificationData = {
                id: 'SHARE',
                wistiki: wistikiObject,
                owner: _lodash2.default.omit(wistikiOwner.get({ plain: true }), _config.sensibleData.user),
                timestamp: (0, _moment2.default)().utc().toISOString()
              };

              newFriendModel.notifyDevices(friendNotificationData, 'SHARE_' + params.sn);

              // Notify Owner devices
              ownerNotificationData = {
                id: 'SHARE_UPD',
                serial_number: params.sn,
                friend: _lodash2.default.omit(newFriendModel.get({ plain: true }), _config.sensibleData.user),
                timestamp: (0, _moment2.default)().utc().toISOString()
              };

              wistikiOwner.notifyDevices(ownerNotificationData, 'SHARE_' + params.sn, params.device !== null ? params.device.uid : null);

              return _context.abrupt('return', _lodash2.default.omit(newFriendModel.get({ plain: true }), _config.sensibleData.user));

            case 39:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function create(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return create;
  }(),


  /**
   *
   * @param id
   * @param params
   * @return {Promise.<TResult>}
   */
  remove: function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(id, params) {
      var wistikiModel, isAuthorized, wistikiHasFriendModel, _ref5, _ref6, wistikiOwner, wistikiFriend, unshareNotificationData, _ref7, _ref8, owner, friends, lastPosition, resObject;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Check if Wistiki exist in database
              debug;
              _context2.next = 3;
              return _db.Wistiki.cache().findById(params.verifiedSerialNumber);

            case 3:
              wistikiModel = _context2.sent;

              if (wistikiModel) {
                _context2.next = 6;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistiki ' + params.sn + ' not found'] });

            case 6:

              // Check if user is authorized to unshare this Wistiki
              isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, wistikiModel, 'remove_friend').then(function () {
                return true;
              }, function () {
                return false;
              });
              /* istanbul ignore else */

              if (isAuthorized) {
                _context2.next = 9;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to remove friend from this resource'
                }]
              });

            case 9:
              _context2.next = 11;
              return _db.WistikiHasFriend.getUserPairing(id, params.verifiedSerialNumber);

            case 11:
              wistikiHasFriendModel = _context2.sent;

              if (wistikiHasFriendModel) {
                _context2.next = 14;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistiki ' + params.sn + ' is not shared with ' + id] });

            case 14:
              _context2.next = 16;
              return wistikiModel.getOwner();

            case 16:
              _ref5 = _context2.sent;
              _ref6 = (0, _slicedToArray3.default)(_ref5, 1);
              wistikiOwner = _ref6[0];
              _context2.next = 21;
              return _db.User.cache().findById(id);

            case 21:
              wistikiFriend = _context2.sent;


              // Notification to synchronise devices data
              unshareNotificationData = {
                id: 'UNSH',
                serial_number: params.sn,
                user_email: params.user.email,
                cause: 'DELETE'
              };

              if (wistikiOwner.email === params.user.email) {
                // This will cause notification to be shown to friend if the owner unshared the Wistiki
                unshareNotificationData.cause = 'UNSH';
                unshareNotificationData.user_email = null;
              }

              wistikiOwner.notifyDevices(unshareNotificationData, 'UNSH_' + params.sn, params.device !== null ? params.device.uid : null);
              wistikiFriend.notifyDevices(unshareNotificationData, 'UNSH_' + params.sn, params.device !== null ? params.device.uid : null);
              _context2.next = 28;
              return _db.WistikiHasFriend.deleteUserPairing(id, params.verifiedSerialNumber);

            case 28:
              if (!(wistikiOwner.email !== params.user.email)) {
                _context2.next = 30;
                break;
              }

              return _context2.abrupt('return', null);

            case 30:
              _context2.next = 32;
              return wistikiModel.getOwner({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 32:
              _ref7 = _context2.sent;
              _ref8 = (0, _slicedToArray3.default)(_ref7, 1);
              owner = _ref8[0];
              _context2.next = 37;
              return wistikiModel.getFriends({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 37:
              friends = _context2.sent;
              _context2.next = 40;
              return wistikiModel.getLastPosition();

            case 40:
              lastPosition = _context2.sent;
              resObject = _lodash2.default.omit(wistikiModel.get({ plain: true }), _config.sensibleData.wistiki);

              resObject.last_position = lastPosition;
              resObject.owner = owner.get({ plain: true });
              resObject.friends = _lodash2.default.map(friends, function (friend) {
                return friend.get({ plain: true });
              });

              return _context2.abrupt('return', resObject);

            case 46:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function remove(_x3, _x4) {
      return _ref4.apply(this, arguments);
    }

    return remove;
  }(),


  /**
   * TODO: Description
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
//# sourceMappingURL=friends.js.map
