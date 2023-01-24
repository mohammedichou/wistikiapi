'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _db = require('../../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:services:wistikis:recovery');

var Service = {
  create: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, params) {
      var wistikiModel;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.Wistiki.cache().findById(params.sn);

            case 2:
              wistikiModel = _context.sent;

              if (wistikiModel) {
                _context.next = 5;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: ['Wistiki ' + params.sn + ' not found'] });

            case 5:
              if (wistikiModel.compareMsnCipher(data.msn_cipher)) {
                _context.next = 7;
                break;
              }

              throw new _index2.default.BadRequest('OPERATION_NOT_PERMITTED', { errors: ['MSN Cipher mismatch'] });

            case 7:

              wistikiModel.resetWistiki();
              wistikiModel.cache().save();

              return _context.abrupt('return', { cipher: wistikiModel.getRecoveryCipher(data.recovery_token).toString('hex') });

            case 10:
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
  }()
};

exports.default = Service;
//# sourceMappingURL=recovery.js.map
