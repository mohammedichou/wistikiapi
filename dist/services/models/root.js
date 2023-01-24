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

var _cache = require('../../lib/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
  /**
   * Get all available models with their associated last software version details
   */
  find: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var models;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _cache2.default.getModels();

            case 2:
              models = _context.sent;

              if (models) {
                _context.next = 8;
                break;
              }

              _context.next = 6;
              return _db.Model.findAll({
                joinTableAttributes: [],
                include: [{
                  as: 'last_software',
                  model: _db.Software,
                  attributes: {
                    exclude: ['model_id']
                  }
                }]
              });

            case 6:
              models = _context.sent;

              _cache2.default.setModels(models);

            case 8:
              return _context.abrupt('return', models);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function find() {
      return _ref.apply(this, arguments);
    }

    return find;
  }(),

  /**
   * Get model by id. Throws an error if none can be found
   *
   * @param id requested model id
   */
  get: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(id) {
      var model;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _db.Model.findById(id, {
                joinTableAttributes: [],
                include: [{
                  as: 'last_software',
                  model: _db.Software,
                  attributes: {
                    exclude: ['model_id']
                  }
                }]
              });

            case 2:
              model = _context2.sent;

              if (model) {
                _context2.next = 5;
                break;
              }

              throw new _index2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'Model ' + id + ' not found' }] });

            case 5:
              return _context2.abrupt('return', model);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function get(_x) {
      return _ref2.apply(this, arguments);
    }

    return get;
  }(),


  /**
   * TODO: Description
   * @param app
   */
  setup: function setup(app) {
    /* istanbul ignore next */
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    /* istanbul ignore next */
    this.service = app.service.bind(app);
    /* istanbul ignore next */
    this.filter(function () {
      return false;
    });
  }
};

exports.default = Service;
//# sourceMappingURL=root.js.map
