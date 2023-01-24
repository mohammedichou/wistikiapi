'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('../db/index.js');

var _sns = require('../lib/sns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JwtStrategy = require('passport-jwt').Strategy;


var Service = {
    create: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, params) {
            var userModel, device, ret, notificationData, message, wistikiModel, lastPosition, _notificationData, _message, _device;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return _index.User.cache().findById(params.email);

                        case 2:
                            userModel = _context.sent;

                            if (userModel) {
                                _context.next = 5;
                                break;
                            }

                            throw new errors.NotFound('RESOURSE_NOT_FOUND', {
                                errors: [{ message: 'User not found' }]
                            });

                        case 5:
                            if (!data.uid) {
                                _context.next = 19;
                                break;
                            }

                            _context.next = 8;
                            return _index.Device.cache().findById(data.uid);

                        case 8:
                            device = _context.sent;

                            if (!(device.uid && device.sns_arn != null)) {
                                _context.next = 16;
                                break;
                            }

                            notificationData = { id: 'RING' };
                            message = {
                                default: notificationData,
                                GCM: {
                                    data: notificationData,
                                    collapse_key: "collapseKey"
                                },
                                APNS: {
                                    data: notificationData,
                                    aps: {
                                        'content-available': 1
                                    }
                                }
                            };

                            (0, _sns.notifyEndpoint)(device.get('sns_arn'), message, data.uid);
                            return _context.abrupt('return', _promise2.default.resolve({ ring: "device" }));

                        case 16:
                            throw new errors.NotFound('RESOURSE_NOT_FOUND', {
                                errors: [{ message: 'User or SNSARN not found' }]
                            });

                        case 17:
                            _context.next = 42;
                            break;

                        case 19:
                            if (!data.sn) {
                                _context.next = 42;
                                break;
                            }

                            _context.next = 22;
                            return _index.Wistiki.cache().findById(data.sn);

                        case 22:
                            wistikiModel = _context.sent;

                            if (!wistikiModel) {
                                _context.next = 41;
                                break;
                            }

                            _context.next = 26;
                            return wistikiModel.getLastPosition();

                        case 26:
                            lastPosition = _context.sent;

                            if (!(lastPosition && lastPosition.uid)) {
                                _context.next = 38;
                                break;
                            }

                            console.log(lastPosition);
                            _notificationData = { id: 'RING_WISTIKI', serial_number: data.sn };
                            _message = {
                                default: _notificationData,
                                GCM: {
                                    data: _notificationData,
                                    collapse_key: "collapseKey"
                                },
                                APNS: {
                                    data: _notificationData,
                                    aps: {
                                        'content-available': 1
                                    }
                                }
                            };
                            _context.next = 33;
                            return _index.Device.cache().findById(lastPosition.uid);

                        case 33:
                            _device = _context.sent;

                            (0, _sns.notifyEndpoint)(_device.get('sns_arn'), _message, lastPosition.uid);
                            return _context.abrupt('return', _promise2.default.resolve({ ring: "wistiki" }));

                        case 38:
                            throw new errors.NotFound('RESOURSE_NOT_FOUND', {
                                errors: [{ message: 'Device not found' }]
                            });

                        case 39:
                            _context.next = 42;
                            break;

                        case 41:
                            throw new errors.NotFound('RESOURSE_NOT_FOUND', {
                                errors: [{ message: 'Wistiki  not found' }]
                            });

                        case 42:
                            throw new errors.NotFound('RESOURSE_NOT_FOUND', {
                                errors: [{ message: 'UID or SN not found' }]
                            });

                        case 43:
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
    setup: function setup(app, path) {
        this.app = app;
        this.service = app.service.bind(app);
        this.filter(function (data, connection) {
            return false;
        });
    }
};

exports.default = Service;
//# sourceMappingURL=send_push.js.map
