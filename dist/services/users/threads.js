'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _db = require('../../db');

var _config = require('../../config');

var _aclMiddleware = require('../../middlewares/aclMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service for User Threads. Threads where user is participating
 */
var Service = {
  /**
   * Get user Threads.
   *
   * @param params
   */
  find: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(params) {
      var userModel, isAuthorized, threads;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db.User.cache().findById(params.email);

            case 2:
              userModel = _context.sent;

              if (userModel) {
                _context.next = 5;
                break;
              }

              throw new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND', { errors: [{ message: 'User ' + params.email + ' not found' }] });

            case 5:
              isAuthorized = _aclMiddleware.ModelAcl.isAllowed(params.user, userModel, 'find_threads').then(function () {
                return true;
              }, function () {
                return false;
              });

              /* istanbul ignore else */

              if (isAuthorized) {
                _context.next = 8;
                break;
              }

              throw new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
                errors: [{
                  message: 'You are not allowed to access this resource'
                }]
              });

            case 8:
              _context.next = 10;
              return userModel.getThreads({
                joinTableAttributes: [],
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
              });

            case 10:
              threads = _context.sent;
              return _context.abrupt('return', threads);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function find(_x) {
      return _ref.apply(this, arguments);
    }

    return find;
  }(),

  /**
   * TODO: Description
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
//# sourceMappingURL=threads.js.map
