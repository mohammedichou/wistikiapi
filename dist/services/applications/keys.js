'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _db = require('../../db');

var _aclMiddleware = require('../../middlewares/aclMiddleware');

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
  /**
   *
   * @param params
   */
  find: function find(params) {
    return this.checkPermissions(params.user, params.app_id, 'list_keys', params.headers['x-wistiki-masterkey']).then(function (application) {
      return application.getAppKeys();
    });
  },

  /**
   * Create a new key for application identified by and id
   *
   * @param data
   * @param params
   * @example
   *
   * {
  * 	master_key: '12345678-1234-1234-1234-123456789012',
  * 	description: 'temporary app key',
  * 	lifetime: 2592000
  * }
   */
  create: function create(data, params) {
    var _this = this;

    return this.checkPermissions(params.user, params.app_id, 'create_key', data.masterKey).then(function (application) {
      return _db.AppKey.create(_this.generateToken(application, data));
    });
  },

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
  },


  /**
   * Takes application instance and data sent, pick only description field and
   * create a new AppKey associated to application with a generated token that expires
   * after data.lifetime (in seconds)
   *
   * @param application Model instance
   * @param data request data
   * @returns {Object} data object to be passed to AppKey.create method
   */
  generateToken: function generateToken(application, data) {
    var sanitizedData = _lodash2.default.pick(data, ['description']);
    sanitizedData.application_id = application.get('id');
    sanitizedData.id = _jsonwebtoken2.default.sign({ sub: application.get('id'), role: 'application' }, _config2.default.jwt.secretOrPrivateKey, _lodash2.default.merge(_config2.default.jwt.options, { expiresIn: data.lifetime }));
    sanitizedData.expireAt = (0, _moment2.default)().add(data.lifetime, 'seconds');
    return sanitizedData;
  },


  /**
   * Check permissions of user for a specific app_id to do a certain action (privilege)
   * with found application
   *
   * @param user {User} user model
   * @param appId {string} Application id
   * @param privilege {string} asked privilege
   * @param masterKey {string} Application master key
   * @returns {Promise<Application>}
   */
  checkPermissions: function checkPermissions(user, appId, privilege, masterKey) {
    return _db.Application.findById(appId)
    // Check if application exists and provided master key is correct
    .then(function (application) {
      if (!application) {
        return _promise2.default.reject(new _feathersErrors2.default.NotFound('RESOURCE_NOT_FOUND'));
      }
      return application;
    }).then(function (application) {
      return _aclMiddleware.ModelAcl.isAllowed(user, application, privilege).then(function () {
        if (application && application.get('master_key') !== masterKey) {
          return _promise2.default.reject(new _feathersErrors2.default.Forbidden('MASTER_KEY_MISMATCH'));
        }
        return application;
      }, function () {
        return _promise2.default.reject(new _feathersErrors2.default.Forbidden('MODEL_ACL_ERROR'));
      });
    });
  }
}; /* eslint-disable no-tabs */
exports.default = Service;
//# sourceMappingURL=keys.js.map
