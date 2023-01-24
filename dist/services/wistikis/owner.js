'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _config = require('../../config');

var _db = require('../../db');

var _logger = require('../../lib/logger');

var _aclMiddleware = require('../../middlewares/aclMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
var debug = require('debug')('darwin:services:wistikis:owner');
/**
 * Transfer Wistiki property from user to another. If data.reset_friends is set to true,
 * then the Wistiki will be unshared from all friends. A Push notification is sent in that
 * case to all friends to alert them. Previous and new Owner receives push notification on
 * all their devices, expect, on the device making this call
 * @type {{create: (function(Object, Object, Function)),
 * after: {create: Service.after.create},
 * setup: (function(*=, *))}}
 */
var Service = {
  /**
   *
   * @param {integer} id
   * @param {object} data
   * @param {object} params
   * @param {function} callback
   */
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(bodyData, params) {
      var _this = this;

      var wistikiModel, isAuthorized, newOwnerModel, _ref2, _ref3, wistikiOwner, wistikiFriends, unshareNotificationData, ownerPairing, wistikiSettings, _ref5, _ref6, owner, friends, lastPosition, resObject, notification, notificationId;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _db.Wistiki.cache().findById(params.verifiedSerialNumber);

            case 2:
              wistikiModel = _context2.sent;

              if (wistikiModel) {
                _context2.next = 5;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistiki ' + params.sn + ' not found'] });

            case 5:

              // Check if user is authorized to add new friend to Wistiki
              isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, wistikiModel, 'transfer_ownership').then(function () {
                return true;
              }, function () {
                return false;
              });
              /* istanbul ignore else */

              if (isAuthorized) {
                _context2.next = 9;
                break;
              }

              _logger.errorLog.error('Owner transfer ACL error', {
                event: 'TRANSFER_OWNERSHIP',
                reason: 'MODEL_ACL_ERROR',
                current_user: params.user.email,
                req_data: bodyData,
                wistiki: wistikiModel.get({ plain: true })
              });
              throw new _index2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to transfer this resource'
                }]
              });

            case 9:
              if (!(bodyData.email === params.user.email)) {
                _context2.next = 11;
                break;
              }

              throw new _index2.default.BadRequest('OPERATION_NOT_PERMITTED', { errors: ['User can\'t transfer ownership of Wistiki ' + params.sn + ' to himself'] });

            case 11:
              _context2.next = 13;
              return _db.User.cache().findById(bodyData.email);

            case 13:
              newOwnerModel = _context2.sent;
              _context2.next = 16;
              return wistikiModel.getOwner();

            case 16:
              _ref2 = _context2.sent;
              _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
              wistikiOwner = _ref3[0];

              if (newOwnerModel) {
                _context2.next = 21;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['User ' + bodyData.email + ' not found'] });

            case 21:
              _context2.next = 23;
              return wistikiModel.getFriends();

            case 23:
              wistikiFriends = _context2.sent;

              // Notification to synchronise devices data
              unshareNotificationData = {
                id: 'UNSH',
                serial_number: params.sn,
                user_email: null,
                cause: 'TOWN'
              };

              if (!(bodyData.reset_friends === true)) {
                _context2.next = 29;
                break;
              }

              // remove all friends
              _lodash2.default.each(wistikiFriends, function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(friend) {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          friend.notifyDevices(unshareNotificationData, 'UNSH_' + params.sn);
                          _context.next = 3;
                          return _db.WistikiHasFriend.deleteUserPairing(friend.email, params.verifiedSerialNumber);

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3) {
                  return _ref4.apply(this, arguments);
                };
              }());
              _context2.next = 32;
              break;

            case 29:
              // if new owner is a friend of the wistiki, remove it from friends list
              wistikiOwner.notifyDevices(unshareNotificationData, 'UNSH_' + params.sn, params.device !== null ? params.device.uid : null);
              _context2.next = 32;
              return _db.WistikiHasFriend.deleteUserPairing(bodyData.email, params.verifiedSerialNumber);

            case 32:
              _context2.next = 34;
              return _db.WistikiHasOwner.getUserPairing(wistikiOwner.email, params.verifiedSerialNumber);

            case 34:
              ownerPairing = _context2.sent;

              ownerPairing = _lodash2.default.cloneDeep(ownerPairing.get({ plain: true }));

              _context2.next = 38;
              return _db.WistikiHasOwner.deleteUserPairing(wistikiOwner.email, params.verifiedSerialNumber);

            case 38:
              wistikiSettings = {
                wistiki_alias: ownerPairing.wistiki_alias,
                wistiki_picture: ownerPairing.wistiki_picture,
                link_loss: ownerPairing.link_loss,
                inverted_link_loss: ownerPairing.inverted_link_loss,
                icon: ownerPairing.icon,
                color: ownerPairing.color,
                share_start_date: (0, _moment2.default)().utc(),
                ownership_start_date: (0, _moment2.default)().utc()
              };
              _context2.next = 41;
              return _promise2.default.all([wistikiOwner.addActiveSharedWistiki(params.verifiedSerialNumber, { through: wistikiSettings }), wistikiModel.setOwner(newOwnerModel.email, { through: wistikiSettings })]);

            case 41:
              _context2.next = 43;
              return wistikiModel.getOwner({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 43:
              _ref5 = _context2.sent;
              _ref6 = (0, _slicedToArray3.default)(_ref5, 1);
              owner = _ref6[0];
              _context2.next = 48;
              return wistikiModel.getFriends({
                attributes: {
                  exclude: _config.sensibleData.user
                },
                joinTableAttributes: {
                  exclude: ['user_email', 'wistiki_serial_number']
                }
              });

            case 48:
              friends = _context2.sent;
              _context2.next = 51;
              return wistikiModel.getLastPosition();

            case 51:
              lastPosition = _context2.sent;
              resObject = _lodash2.default.omit(wistikiModel.get({ plain: true }), _config.sensibleData.wistiki);

              resObject.last_position = lastPosition;
              resObject.owner = owner.get({ plain: true });

              notification = {
                id: 'TOWN',
                from_user: params.user.get('first_name') + ' ' + params.user.get('last_name'),
                wistiki: resObject,
                timestamp: (0, _moment2.default)().utc().toISOString()
              };
              notificationId = 'TOWN_' + params.sn;


              newOwnerModel.notifyDevices(notification, notificationId);
              wistikiOwner.notifyDevices(notification, notificationId, params.device !== null ? params.device.uid : null);

              resObject.friends = _lodash2.default.map(friends, function (friend) {
                return friend.get({ plain: true });
              });
              return _context2.abrupt('return', resObject);

            case 61:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function create(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return create;
  }(),

  /**
   * Setup function
   *
   * @param app
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
//# sourceMappingURL=owner.js.map
