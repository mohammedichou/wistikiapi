'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _db = require('../../db');

var _email = require('../../lib/email');

var _email2 = _interopRequireDefault(_email);

var _config = require('../../config');

var _root = require('./../positions/root');

var _root2 = _interopRequireDefault(_root);

var _i18n = require('../../lib/i18n');

var _sns = require('../../lib/sns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service for Wistiki Founds
 * @type {{
 * find: (function(*, *)),
 * get: (function(*, *, *)),
 * create: (function(*, *, *)),
 * update: (function(*, *, *, *)),
 * patch: (function(*, *, *, *)),
 * remove: (function(*, *, *)),
 * setup: (function(*=, *))
 * }}
 */
var Service = {
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, params) {
      var wistikiModel, _ref2, _ref3, wistikiOwner, thread, notification, messageModel, languages, positionData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.Wistiki.cache().findById(params.verifiedSerialNumber);

            case 2:
              wistikiModel = _context.sent;

              if (wistikiModel) {
                _context.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistiki ' + params.sn + ' not found'] });

            case 5:
              if (wistikiModel.compareMsnCipher(data.msn_cipher)) {
                _context.next = 7;
                break;
              }

              throw new _feathersErrors2.default.BadRequest('REQUEST_AUTHENTICATION_FAILED');

            case 7:
              _context.next = 9;
              return wistikiModel.getOwner();

            case 9:
              _ref2 = _context.sent;
              _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
              wistikiOwner = _ref3[0];

              if (wistikiOwner) {
                _context.next = 14;
                break;
              }

              throw new _feathersErrors2.default.NotFound('OWNER_NOT_FOUND', { errors: ['Owner not found for Wistiki ' + params.sn] });

            case 14:
              _context.next = 16;
              return _db.Thread.create({
                title: 'FOUND_' + params.sn,
                user_email: params.user.email
              });

            case 16:
              thread = _context.sent;
              notification = {
                id: 'WISTIKI_FOUND',
                wistiki: {
                  serial_number: parseInt(params.sn, 10),
                  wistiki_alias: wistikiOwner.wistiki_has_owner.wistiki_alias,
                  wistiki_picture: wistikiOwner.wistiki_has_owner.wistiki_picture
                },
                user: {
                  first_name: params.user.first_name,
                  avatar_url: params.user.avatar_url
                },
                owner: {
                  first_name: wistikiOwner.first_name,
                  avatar_url: wistikiOwner.avatar_url
                }

              };
              _context.next = 20;
              return _db.Message.create({
                body: (0, _stringify2.default)(notification),
                user_email: params.user.email,
                thread_id: thread.id,
                type: 'NOTIFICATION'
              });

            case 20:
              messageModel = _context.sent;


              notification.thread_id = thread.id;
              notification.message_id = messageModel.id;

              wistikiOwner.getOwnedDevices().then(function (devices) {
                // Send push to all devices
                _lodash2.default.forEach(devices, function (device) {
                  if (device.get('sns_arn')) {
                    var message = {
                      default: notification,
                      GCM: {
                        data: notification,
                        collapse_key: 'FOUND_' + params.sn

                      },
                      APNS: {
                        data: notification,
                        aps: {
                          'content-available': 1,
                          badge: 1,
                          alert: {
                            title: 'Wistiki Chat',
                            body: messageModel.author.first_name + ': ' + messageModel.body
                          }
                        }
                      }

                    };
                    (0, _sns.notifyEndpoint)(device.get('sns_arn'), message, device.get('uid'));
                  }
                });
              });

              // add owner to thread
              _context.next = 26;
              return _promise2.default.all([thread.addParticipants([wistikiOwner, params.user]), messageModel.createState({ user_email: wistikiOwner.email })]);

            case 26:
              languages = _i18n.acceptLanguage.parse(wistikiOwner.locale);

              _email2.default.sendFoundWistikiEmail({
                email: wistikiOwner.email,
                wistiki: wistikiOwner.wistiki_has_owner.wistiki_alias,
                language: languages[0]
              });

              positionData = {
                geolocation: data.geolocation,
                wistikis: [{
                  serial_number: params.sn,
                  msn_cipher: data.msn_cipher
                }]
              };

              _root2.default.create(positionData, params);

              return _context.abrupt('return', messageModel);

            case 31:
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
   * TODO: Description
   * @param app
   * @param path
   */
  setup: function setup(app) {
    this.app = app;
    this.service = app.service.bind(app);
    this.filter({
      created: function created(data, connection) {
        if (!connection.user) return false;
        if (connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1) return false;
        return data;
      }
    });
  },

  after: {
    create: function create(hook) {
      return hook.result.reload({
        attributes: {
          exclude: ['id']
        },
        include: [{
          as: 'author',
          model: _db.User,
          attributes: {
            exclude: _config.sensibleData.user
          }
        }, {
          as: 'thread',
          model: _db.Thread,
          attributes: {
            exclude: ['user_email']
          },
          include: [{
            model: _db.User,
            as: 'creator',
            attributes: {
              exclude: _config.sensibleData.user
            }
          }, {
            model: _db.User,
            as: 'participants',
            attributes: {
              exclude: _config.sensibleData.user
            }

          }, {
            model: _db.Message,
            as: 'last_message',
            attributes: {
              exclude: ['user_email', 'thread_id']
            },
            include: [{
              as: 'author',
              model: _db.User,
              attributes: {
                exclude: _config.sensibleData.user
              }
            }, {
              as: 'states',
              model: _db.MessageHasStatus,
              attributes: {
                exclude: ['message_id', 'user_email']
              },
              include: [{
                model: _db.User,
                attributes: {
                  exclude: _config.sensibleData.user
                }
              }]

            }]

          }]
        }, {
          as: 'states',
          model: _db.MessageHasStatus,
          attributes: {
            exclude: ['message_id', 'user_email']
          },
          include: [{
            model: _db.User,
            attributes: {
              exclude: _config.sensibleData.user
            }
          }]

        }]
      }).then(function (message) {
        hook.result = message;
        hook.result.dataValues = _lodash2.default.omit(hook.result.dataValues, ['thread_id', 'user_email']);
        return hook;
      });
    }
  }
};

exports.default = Service;
//# sourceMappingURL=founds.js.map
