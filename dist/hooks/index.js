'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function () {
  return function () {
    var app = this;
    app.service('/wistikis/:sn/recovery').hooks({
      before: {
        create: function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(hook) {
            var serialNumber, wistikiModel;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    serialNumber = hook.params.sn;

                    debug(serialNumber);
                    _context.next = 4;
                    return _db.Wistiki.cache().findById(serialNumber);

                  case 4:
                    wistikiModel = _context.sent;

                    if (wistikiModel && !wistikiModel.compareMsnCipher(hook.data.msn_cipher)) {
                      hook.params.sn = transformSerialNumber(serialNumber);
                    }
                    debug(hook.data);
                    debug(hook.params);

                  case 8:
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
        }()
      }
    });

    app.service('/users/:email/wistikis').hooks({
      before: {
        create: function () {
          var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(hook) {
            var wistikiModel, serialNumber;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    debug('before create serial number', hook.data.serial_number);
                    _context2.next = 3;
                    return _db.Wistiki.cache().findById(hook.data.serial_number);

                  case 3:
                    wistikiModel = _context2.sent;
                    serialNumber = '' + hook.data.serial_number;

                    if (wistikiModel && !wistikiModel.compareMsnCipher(hook.data.msn_cipher)) {
                      hook.data.serial_number = transformSerialNumber(serialNumber);
                    }
                    debug('before create new serial number', hook.data.serial_number);

                  case 7:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function create(_x2) {
            return _ref2.apply(this, arguments);
          }

          return create;
        }(),
        update: function () {
          var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(hook) {
            var serialNumber, wistikiHasOwner, wistikiHasFriend;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    debug(hook.id);
                    serialNumber = '' + hook.id;
                    _context3.next = 4;
                    return _db.WistikiHasOwner.getUserPairing(hook.params.email, serialNumber);

                  case 4:
                    wistikiHasOwner = _context3.sent;
                    _context3.next = 7;
                    return _db.WistikiHasFriend.getUserPairing(hook.params.email, serialNumber);

                  case 7:
                    wistikiHasFriend = _context3.sent;

                    hook.params.verifiedSerialNumber = serialNumber;
                    if (!wistikiHasOwner && !wistikiHasFriend) {
                      hook.params.verifiedSerialNumber = transformSerialNumber(serialNumber);
                    }
                    debug(hook.params.verifiedSerialNumber);

                  case 11:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          function update(_x3) {
            return _ref3.apply(this, arguments);
          }

          return update;
        }()
      },
      after: {
        create: function create(hook) {
          debug('after create', hook.result);
          var serialNumber = '' + hook.result.serial_number;
          if (!verifySerialNumber(serialNumber)) {
            hook.result.serial_number = getOriginalSerialNumber(serialNumber);
          }
          debug('after create', hook.result);
        },
        update: function update(hook) {
          debug('after update', hook.result);
          var serialNumber = '' + hook.result.serial_number;
          if (!verifySerialNumber(serialNumber)) {
            serialNumber = getOriginalSerialNumber(serialNumber);
          }
          hook.result.serial_number = parseInt(serialNumber, 10);
          hook.result.owner.wistiki_has_owner.wistiki_serial_number = parseInt(serialNumber, 10);
          _lodash2.default.each(hook.result.friends, function (friend) {
            friend.wistiki_has_friend.wistiki_serial_number = parseInt(serialNumber, 10);
          });
          debug('after update', hook.result);
        },
        find: function find(hook) {
          hook.result = _lodash2.default.map(hook.result, function (result) {
            var serialNumber = '' + result.serial_number;
            if (!verifySerialNumber(serialNumber)) {
              serialNumber = getOriginalSerialNumber(serialNumber);
            }
            result.serial_number = parseInt(serialNumber, 10);
            result.owner.wistiki_has_owner.wistiki_serial_number = parseInt(serialNumber, 10);
            _lodash2.default.each(result.friends, function (friend) {
              friend.wistiki_has_friend.wistiki_serial_number = parseInt(serialNumber, 10);
            });
            return result;
          });
        }
      }
    });

    app.service('/wistikis/:sn/owner').hooks({
      before: {
        create: function () {
          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(hook) {
            var serialNumber, userEmail, wistikiHasOwner, wistikiHasFriend;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    serialNumber = '' + hook.params.sn;
                    userEmail = hook.params.user.email;
                    _context4.next = 4;
                    return _db.WistikiHasOwner.getUserPairing(userEmail, serialNumber);

                  case 4:
                    wistikiHasOwner = _context4.sent;
                    _context4.next = 7;
                    return _db.WistikiHasFriend.getUserPairing(userEmail, serialNumber);

                  case 7:
                    wistikiHasFriend = _context4.sent;

                    if (!wistikiHasOwner && !wistikiHasFriend) {
                      hook.params.verifiedSerialNumber = transformSerialNumber(serialNumber);
                    } else {
                      hook.params.verifiedSerialNumber = parseInt(serialNumber, 10);
                    }
                    debug(hook.params.verifiedSerialNumber);

                  case 10:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));

          function create(_x4) {
            return _ref4.apply(this, arguments);
          }

          return create;
        }()
      },
      after: {
        create: function () {
          var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(hook) {
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    hook.result.serial_number = parseInt(hook.params.sn, 10);
                    hook.result.owner.wistiki_has_owner.wistiki_serial_number = parseInt(hook.params.sn, 10);
                    _lodash2.default.each(hook.result.friends, function (friend) {
                      friend.wistiki_has_friend.wistiki_serial_number = parseInt(hook.params.sn, 10);
                    });
                    debug(hook.result);

                  case 4:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));

          function create(_x5) {
            return _ref5.apply(this, arguments);
          }

          return create;
        }()
      }
    });

    app.service('/wistikis/:sn/friends').hooks({
      before: {
        create: function () {
          var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(hook) {
            var serialNumber, userEmail, wistikiHasOwner, wistikiHasFriend;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    serialNumber = '' + hook.params.sn;
                    userEmail = hook.params.user.email;
                    _context6.next = 4;
                    return _db.WistikiHasOwner.getUserPairing(userEmail, serialNumber);

                  case 4:
                    wistikiHasOwner = _context6.sent;
                    _context6.next = 7;
                    return _db.WistikiHasFriend.getUserPairing(userEmail, serialNumber);

                  case 7:
                    wistikiHasFriend = _context6.sent;

                    if (!wistikiHasOwner && !wistikiHasFriend) {
                      hook.params.verifiedSerialNumber = transformSerialNumber(serialNumber);
                    } else {
                      hook.params.verifiedSerialNumber = parseInt(serialNumber, 10);
                    }
                    debug(hook.params.verifiedSerialNumber);

                  case 10:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, this);
          }));

          function create(_x6) {
            return _ref6.apply(this, arguments);
          }

          return create;
        }(),
        remove: function () {
          var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(hook) {
            var serialNumber, userEmail, wistikiHasOwner, wistikiHasFriend;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    serialNumber = '' + hook.params.sn;
                    userEmail = hook.id;
                    _context7.next = 4;
                    return _db.WistikiHasOwner.getUserPairing(userEmail, serialNumber);

                  case 4:
                    wistikiHasOwner = _context7.sent;
                    _context7.next = 7;
                    return _db.WistikiHasFriend.getUserPairing(userEmail, serialNumber);

                  case 7:
                    wistikiHasFriend = _context7.sent;

                    if (!wistikiHasOwner && !wistikiHasFriend) {
                      hook.params.verifiedSerialNumber = transformSerialNumber(serialNumber);
                    } else {
                      hook.params.verifiedSerialNumber = parseInt(serialNumber, 10);
                    }

                  case 9:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, this);
          }));

          function remove(_x7) {
            return _ref7.apply(this, arguments);
          }

          return remove;
        }()
      },
      after: {
        create: function create(hook) {
          debug('after create friends', hook.result);
        },
        remove: function remove(hook) {
          debug('after remove friends', hook.result);
          if (hook.result) {
            hook.result.serial_number = parseInt(hook.params.sn, 10);
            hook.result.owner.wistiki_has_owner.wistiki_serial_number = parseInt(hook.params.sn, 10);
            _lodash2.default.each(hook.result.friends, function (friend) {
              friend.wistiki_has_friend.wistiki_serial_number = parseInt(hook.params.sn, 10);
            });
            debug(hook.result);
          }
        }
      }
    });

    app.service('/positions').hooks({
      before: {
        create: function () {
          var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(hook) {
            var _this = this;

            var wistikis;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    wistikis = hook.data.wistikis;
                    _context9.next = 3;
                    return _promise2.default.all(_lodash2.default.map(wistikis, function () {
                      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(wistiki) {
                        var serialNumber, wistikiModel, verifiedSerialNumber;
                        return _regenerator2.default.wrap(function _callee8$(_context8) {
                          while (1) {
                            switch (_context8.prev = _context8.next) {
                              case 0:
                                serialNumber = '' + wistiki.serial_number;
                                _context8.next = 3;
                                return _db.Wistiki.cache().findById(serialNumber);

                              case 3:
                                wistikiModel = _context8.sent;
                                verifiedSerialNumber = serialNumber;

                                if (wistikiModel && !wistikiModel.compareMsnCipher(wistiki.msn_cipher)) {
                                  verifiedSerialNumber = transformSerialNumber(serialNumber);
                                }
                                wistiki.verifiedSerialNumber = parseInt(verifiedSerialNumber, 10);
                                return _context8.abrupt('return', wistiki);

                              case 8:
                              case 'end':
                                return _context8.stop();
                            }
                          }
                        }, _callee8, _this);
                      }));

                      return function (_x9) {
                        return _ref9.apply(this, arguments);
                      };
                    }()));

                  case 3:
                    hook.data.wistiki = _context9.sent;

                    debug('brefore position create new data', hook.data);

                  case 5:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, this);
          }));

          function create(_x8) {
            return _ref8.apply(this, arguments);
          }

          return create;
        }()
      }
    });

    app.service('/wistikis/:sn/founds').hooks({
      before: {
        create: function () {
          var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(hook) {
            var serialNumber, wistikiModel;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    serialNumber = '' + hook.params.sn;

                    hook.params.verifiedSerialNumber = parseInt(serialNumber, 10);
                    _context10.next = 4;
                    return _db.Wistiki.cache().findById(serialNumber);

                  case 4:
                    wistikiModel = _context10.sent;

                    if (wistikiModel && !wistikiModel.compareMsnCipher(hook.data.msn_cipher)) {
                      hook.params.verifiedSerialNumber = transformSerialNumber(serialNumber);
                    }

                  case 6:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, this);
          }));

          function create(_x10) {
            return _ref10.apply(this, arguments);
          }

          return create;
        }()
      }
    });
  };
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _verhoeff = require('../lib/verhoeff');

var _verhoeff2 = _interopRequireDefault(_verhoeff);

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:hooks:index'); /* eslint-disable no-param-reassign */


var transformSerialNumber = function transformSerialNumber(sn) {
  var serialNumber = '' + sn;
  var baseSerialNumber = serialNumber.substr(0, 11);
  var model = parseInt(serialNumber.substr(0, 1), 10);
  if (model !== 3) {
    return parseInt(serialNumber, 10);
  }
  var baseCheckSum = parseInt(serialNumber.substr(11, 1), 10);
  debug('baseSerialNumber', baseSerialNumber);
  debug('baseCheckSum', baseCheckSum);
  var newSerialNumber = '' + baseSerialNumber + (baseCheckSum + 1) % 10;
  debug('new SerialNumber', newSerialNumber);
  return parseInt(newSerialNumber, 10);
};

var getOriginalSerialNumber = function getOriginalSerialNumber(sn) {
  var serialNumber = '' + sn;
  var baseSerialNumber = serialNumber.substr(0, 11);
  var cs = _verhoeff2.default.generate(baseSerialNumber);
  return parseInt('' + baseSerialNumber + cs, 10);
};

var verifySerialNumber = function verifySerialNumber(sn) {
  var serialNumber = '' + sn;
  var baseSerialNumber = serialNumber.substr(0, 11);
  var baseCheckSum = parseInt(serialNumber.substr(11, 1), 10);
  return baseCheckSum === _verhoeff2.default.generate(baseSerialNumber);
};
//# sourceMappingURL=index.js.map
