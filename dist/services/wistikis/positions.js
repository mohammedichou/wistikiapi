'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _db = require('../../db');

var _config = require('../../config');

var _aclMiddleware = require('../../middlewares/aclMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
  /**
   * Position service
   * @param params
   * @param callback
   */
  find: function find(params) {
    return _db.Wistiki.findById(params.sn, {
      attributes: {
        exclude: _lodash2.default.union(_config.sensibleData.wistiki, ['model_id'])
      }
    }).then( // Check rights
    function (wistiki) {
      if (!wistiki) {
        return _promise2.default.reject(new _feathersErrors2.default.NotFound('Wistiki ' + id + ' not found'));
      }
      return _aclMiddleware.ModelAcl.isAllowed(params.user, wistiki, 'get').then(function () {
        return wistiki;
      }, function () {
        return _promise2.default.reject(new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR', {
          errors: [{
            message: 'You are not allowed to access this resource'
          }]
        }));
      });
    }).then( // Retrieve last position
    function (wistiki) {
      return wistiki.getPositions({
        order: 'id DESC',
        limit: 1,
        attributes: { exclude: ['id'] }
      }).then(function (position) {
        if (!position[0]) {
          return _promise2.default.resolve(null);
        }

        delete position[0].dataValues.wistiki_has_position;
        position[0].dataValues.latitude = position[0].get('position').coordinates[0];
        position[0].dataValues.longitude = position[0].get('position').coordinates[1];
        delete position[0].dataValues.position;

        return _promise2.default.resolve(position[0]);
      });
    });
  },

  /**
   *
   * @param {integer} id
   * @param {object} data
   * @param {object} params
   * @param {function} callback
   */
  create: function create(data, params, callback) {
    return _db.Wistiki.findById(params.sn).then( // Check wistiki
    function (wistiki) {
      if (!wistiki) {
        return _promise2.default.reject(new _feathersErrors2.default.NotFound('Wistiki ' + params.sn + ' not found'));
      }
      return _promise2.default.resolve(wistiki);
    }).then( // Save all positions
    function (wistiki) {
      data.forEach(function (item) {
        var _this = this;

        _db.Position.create({
          position: { type: 'Point', coordinates: [item.latitude, item.longitude] },
          accuracy: item.accuracy,
          date: item.date
        }).then(function (position) {
          return _promise2.default.resolve(position.addActivePosition(wistiki.serial_number));
        }, function (err) {
          return reject(new _this.errors.FeathersError(err));
        });
      });
      return _promise2.default.resolve(null);
    });
  },


  /**
   * TODO: Description
   * @param app
   * @param path
   */
  setup: function setup(app, path) {
    this.app = app;
    // Bind the apps service method to service to always look services up dynamically
    this.service = app.service.bind(app);
    this.filter(function (data, connection) {
      return false;
    });
    var h = function h(service) {
      return function (hook) {
        if (hook.type == 'before') {
          // console.time(`${hook.method}:${service}`);
        } else if (hook.type == 'after') {
          // console.timeEnd(`${hook.method}:${service}`);
        }
      };
    };
    this.before({
      all: h('wistikis/positions')
    });
    this.after({
      all: h('wistikis/positions')
    });
  }
};

exports.default = Service;
//# sourceMappingURL=positions.js.map
