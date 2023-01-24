'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _trunc = require('babel-runtime/core-js/math/trunc');

var _trunc2 = _interopRequireDefault(_trunc);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _db = require('../../db');

var _email = require('../../lib/email');

var _email2 = _interopRequireDefault(_email);

var _cache = require('../../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

var _logger = require('../../lib/logger');

var _i18n = require('../../lib/i18n');

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _verhoeff = require('../../lib/verhoeff');

var _verhoeff2 = _interopRequireDefault(_verhoeff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');
_awsSdk2.default.config.update({ region: 'eu-central-1' });

var debug = require('debug')('darwin:positions');

var getOriginalSerialNumber = function getOriginalSerialNumber(sn) {
  var serialNumber = '' + sn;
  var baseSerialNumber = serialNumber.substr(0, 11);
  var cs = _verhoeff2.default.generate(baseSerialNumber);
  return '' + baseSerialNumber + cs;
};

var Service = {
  /**
   *
   * @param data - passed data from request
   * @param params - params send with the request
   * @returns {Promise} - Rejected when user email already exists,
   * resolved when user is added to database successfully
   */
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(data, params) {
      var _this = this;

      var positionData, wistikis, chipolos, wistikiModels, req, positionModel;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              debug(data);
              positionData = data.geolocation;
              wistikis = data.wistikis, chipolos = data.chipolos;
              _context4.next = 5;
              return _promise2.default.all(_lodash2.default.map(wistikis, function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(wistiki) {
                  var wistikiModel;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return _db.Wistiki.cache().findById(wistiki.verifiedSerialNumber);

                        case 2:
                          wistikiModel = _context.sent;

                          if (wistikiModel) {
                            _context.next = 6;
                            break;
                          }

                          debug('Wistiki not found, serial number = %s', wistiki.serial_number);
                          return _context.abrupt('return', null);

                        case 6:
                          if (!wistikiModel.compareMsnCipher(wistiki.msn_cipher)) {
                            _context.next = 8;
                            break;
                          }

                          return _context.abrupt('return', wistikiModel);

                        case 8:
                          debug('MSN Cipher Mismatch for wistiki %s', wistikiModel.serial_number);

                          return _context.abrupt('return', null);

                        case 10:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 5:
              wistikiModels = _context4.sent;


              wistikiModels = _lodash2.default.filter(wistikiModels, function (model) {
                return model !== null;
              });
              debug('found %d wistikis to update position', wistikiModels.length);

              if (!(!wistikiModels.length && !chipolos)) {
                _context4.next = 10;
                break;
              }

              return _context4.abrupt('return', null);

            case 10:
              if (!(!wistikiModels.length && !chipolos.length)) {
                _context4.next = 12;
                break;
              }

              return _context4.abrupt('return', null);

            case 12:

              if (chipolos && chipolos.length) {
                debug('Got Chipolo request: ', chipolos);
                req = [{
                  tokens: chipolos,
                  location: {
                    lat: positionData.latitude,
                    lng: positionData.longitude,
                    h_acc: (0, _trunc2.default)(positionData.accuracy),
                    timestamp: (0, _moment2.default)(positionData.date).unix()
                  },
                  timestamp: (0, _moment2.default)(positionData.date).unix()
                }];

                (0, _got2.default)(_config2.default.chipolo.endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CPL-Authorization': _config2.default.chipolo.key
                  },
                  json: true,
                  body: req
                }).then(function (response) {
                  debug('Chipolo request success', response.body);
                  _logger.chipoloLogger.info('outbound', {
                    endpoint: _config2.default.chipolo.endpoint,
                    chipolos: req,
                    data: data.geolocation,
                    responseBody: response.body,
                    device_uid: params.device ? params.device.uid : null
                  });
                }, function (error) {
                  debug('Chipolo Request Error: ', error.response.body);
                  _logger.chipoloLogger.error('outbound', {
                    endpoint: _config2.default.chipolo.endpoint,
                    chipolos: req,
                    errorBody: error.response.body,
                    device_uid: params.device ? params.device.uid : null
                  });
                });
              }

              _context4.next = 15;
              return _db.Position.create({
                position: { type: 'Point', coordinates: [positionData.latitude, positionData.longitude] },
                accuracy: (0, _trunc2.default)(positionData.accuracy),
                date: (0, _moment2.default)(positionData.date).utc().toISOString(),
                formatted_address: positionData.formatted_address !== '' ? positionData.formatted_address : positionData.street_number + ' ' + positionData.street_name + ' ' + positionData.city,
                street_number: positionData.street_number,
                street_name: positionData.street_name,
                city: positionData.city,
                country: positionData.country,
                country_code: positionData.country_code,
                uid: params.uid,
                zip_code: positionData.zip_code
              });

            case 15:
              positionModel = _context4.sent;


              _lodash2.default.each(wistikiModels, function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(wistikiModel) {
                  var _ref4, _ref5, _ref5$, wistikiOwner, wistikiFriends, notificationData, wistikiOwnerPairing, languages;

                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          wistikiModel.addPosition(positionModel);
                          _cache2.default.setLastWistikiPosition(wistikiModel.serial_number, positionModel.get({ plain: true }));
                          _context3.next = 4;
                          return _promise2.default.all([wistikiModel.getOwner(), wistikiModel.getFriends()]);

                        case 4:
                          _ref4 = _context3.sent;
                          _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
                          _ref5$ = (0, _slicedToArray3.default)(_ref5[0], 1);
                          wistikiOwner = _ref5$[0];
                          wistikiFriends = _ref5[1];
                          notificationData = {
                            id: 'POS',
                            position: positionModel.get({ plain: true }),
                            serial_number: parseInt(getOriginalSerialNumber(wistikiModel.serial_number), 10),
                            source_uid: params.device ? params.device.get('uid') : '',
                            timestamp: (0, _moment2.default)().utc().toISOString()
                          };

                          if (!wistikiOwner) {
                            _context3.next = 20;
                            break;
                          }

                          wistikiOwner.notifyDevices(notificationData, 'POS_' + getOriginalSerialNumber(wistikiModel.serial_number), params.device && params.device.uid ? params.device.uid : null);
                          // Check if wistiki is marked as lost and send email

                          if (!(wistikiOwner.wistiki_has_owner && wistikiOwner.wistiki_has_owner.is_lost)) {
                            _context3.next = 20;
                            break;
                          }

                          if (!(!params.user || wistikiOwner.email !== params.user.email)) {
                            _context3.next = 20;
                            break;
                          }

                          _context3.next = 16;
                          return _db.WistikiHasOwner.getUserPairing(wistikiOwner.email);

                        case 16:
                          wistikiOwnerPairing = _context3.sent;

                          wistikiOwnerPairing.cache().update({ is_lost: false });
                          // user requester language
                          languages = _i18n.acceptLanguage.parse(wistikiOwner.locale);

                          _email2.default.sendPositionUpdateEmail({
                            email: wistikiOwner.email,
                            wistiki: wistikiOwner.wistiki_has_owner.wistiki_alias,
                            language: languages[0]
                          });

                        case 20:

                          _lodash2.default.each(wistikiFriends, function () {
                            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(wistikiFriend) {
                              var wistikiFriendPairing, _languages;

                              return _regenerator2.default.wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      wistikiFriend.notifyDevices(notificationData, 'POS_' + getOriginalSerialNumber(wistikiModel.serial_number), params.device && params.device.uid);
                                      // check if wistiki is marked as lost and send email

                                      if (!(wistikiFriend.wistiki_has_friend && wistikiFriend.wistiki_has_friend.is_lost)) {
                                        _context2.next = 9;
                                        break;
                                      }

                                      if (!(!params.user || wistikiFriend.email !== params.user.email)) {
                                        _context2.next = 9;
                                        break;
                                      }

                                      _context2.next = 5;
                                      return _db.WistikiHasFriend.getUserPairing(wistikiFriend.email);

                                    case 5:
                                      wistikiFriendPairing = _context2.sent;

                                      wistikiFriendPairing.cache().update({ is_lost: false });
                                      // user requester language
                                      _languages = _i18n.acceptLanguage.parse(wistikiFriend.locale);

                                      _email2.default.sendPositionUpdateEmail({
                                        email: wistikiFriend.email,
                                        wistiki: wistikiFriend.wistiki_has_friend.wistiki_alias,
                                        language: _languages[0]
                                      });

                                    case 9:
                                    case 'end':
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2, _this);
                            }));

                            return function (_x5) {
                              return _ref6.apply(this, arguments);
                            };
                          }());
                          if (params.device) {
                            params.device.addPosition(positionModel);
                            _cache2.default.setLastDevicePosition(params.device.uid, positionModel.get({ plain: true }));
                            _this.emit('device', {
                              to: params.user,
                              device: params.device,
                              position: positionModel.get({ plain: true })
                            });
                          } else if (params.application) {
                            _logger.chipoloLogger.info('inbound', {
                              data: data,
                              application_id: params.application.id
                            });
                          }
                          _this.emit('wistiki', {
                            origin: params.device ? params.device.uid : null,
                            wistiki: wistikiModel.get({ plain: true }),
                            position: positionModel.get({ plain: true })
                          });

                        case 23:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this);
                }));

                return function (_x4) {
                  return _ref3.apply(this, arguments);
                };
              }());

              // TODO: send chipolos data to chiplo backend

              return _context4.abrupt('return', positionModel.get({ plain: true }));

            case 18:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function create(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return create;
  }(),


  /**
   * TODO: Description
   * @param app
   */
  setup: function setup(app) {
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    this.service = app.service.bind(app);

    this.filter('device', function (data, connection) {
      if (connection.rooms.indexOf('c:u:' + connection.user.get('email')) === -1) return false;

      if (!connection.device || connection.device.get('type') === 'mobile' || connection.device.get('type') === 'tablet') {
        return false;
      }
      return {
        device_uid: data.device.uid,
        location: data.position
      };
    });
    this.filter('wistiki', function (data, connection) {
      if (connection.rooms.indexOf('c:s:' + data.wistiki.serial_number + ':r:w') === -1) return false;

      if (!connection.device || connection.device.get('type') === 'mobile' || connection.device.get('type') === 'tablet') {
        return false;
      }
      return {
        origin_device_uid: data.origin ? data.origin.uid : null,
        serial_number: data.wistiki.serial_number,
        location: data.position,
        test: data.origin.uid
      };
    });
    this.filter({
      created: function created() {
        return false;
      }
    });
  }
};
Service.events = ['device', 'wistiki'];
exports.default = Service;
//# sourceMappingURL=root.js.map
