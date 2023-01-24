'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchModelId = exports.fetchRoleId = exports.fetchServiceId = exports.ModelAcl = exports.ServiceAcl = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (req, res, next) {
  req.feathers.acl = serviceAcl;
  var requester = null;
  if (req.feathers.user != null && req.feathers.application == null) {
    requester = req.feathers.user;
  } else if (req.feathers.user == null && req.feathers.application != null) {
    requester = req.feathers.application;
  }
  debug('request method: ', req.method);
  serviceAcl.isAllowed(requester, req, req.method).then(function () {
    return next();
  }, function () {
    _promise2.default.all([fetchRoleId(requester), fetchServiceId(req), req.method]).then(function (result) {
      var _result = (0, _slicedToArray3.default)(result, 3),
          roleId = _result[0],
          resourceId = _result[1],
          method = _result[2];

      var error = new _feathersErrors2.default.Forbidden('SERVICE_ACL_ERROR', {
        errors: [{
          message: 'user is not allowed to access this resource',
          resourceId: resourceId,
          method: method,
          roleId: roleId
        }]
      });
      debug('SERVICE_ACL_ERROR', error.toJSON());
      next(error);
    });
  });
};

var _dynamicAcl = require('dynamic-acl');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _acls = require('../acls/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:middlewares:acl');

// TODO: retrieve user role Id from database values
var fetchRoleId = function fetchRoleId(requester) {
  return new _promise2.default(function (resolve) {
    // eslint-disable-next-line import/no-named-as-default-member
    if (requester instanceof _db2.default.Model) {
      debug('fetchRoleId : ', requester.constructor.name);
      return resolve(requester.constructor.name);
    }
    debug('fetchRoleId : anonymous');
    return resolve('anonymous');
  });
};
var fetchServiceId = function fetchServiceId(resource) {
  return new _promise2.default(function (resolve) {
    if (!resource) {
      return resolve('');
    } else if (resource.route) {
      debug('fetchServiceId : ', resource.route.path);
      return resolve(resource.route.path);
    }
    return resolve('/verify/:email/:token'); // TODO: replace this dirty hack as resource will not contain route for static paths
  });
};

var fetchModelId = function fetchModelId(model) {
  return new _promise2.default(function (resolve) {
    if (model instanceof _db2.default.Model) {
      debug('fetchModelId : ', model.constructor.name);
      return resolve(model.constructor.name);
    }
    try {
      return resolve(model.getTableName());
    } catch (e) {
      debug('fetchModelId : model is not instance of Sequelize.Model or Model class ', model);
      return resolve('');
    }
  });
};
// Init Access Control List
var serviceAcl = new _dynamicAcl.Acl(fetchRoleId, fetchServiceId);
var modelAcl = new _dynamicAcl.Acl(fetchRoleId, fetchModelId);

var anonymousRole = new _dynamicAcl.Role('anonymous');
var userRole = new _dynamicAcl.Role('user');
var applicationRole = new _dynamicAcl.Role('application');

// Adding roles
serviceAcl.addRole(anonymousRole).addRole(userRole).addRole(applicationRole);
modelAcl.addRole(anonymousRole).addRole(userRole).addRole(applicationRole);

// Models resources
var permissions = [new _acls.MessageModelPermission(modelAcl), new _acls.UserModelPermission(modelAcl), new _acls.UserServicePermission(serviceAcl), new _acls.UsersServicePermission(serviceAcl), new _acls.LoginServicePermission(serviceAcl), new _acls.LoginRootServicePermission(serviceAcl), new _acls.VerifyServicePermission(serviceAcl), new _acls.UserDevicesServicePermission(serviceAcl), new _acls.UserDeviceServicePermission(serviceAcl), new _acls.WistikiCallsCallbackServicePermission(serviceAcl), new _acls.DeviceModelPermission(modelAcl), new _acls.UserWistikisServicePermission(serviceAcl), new _acls.UserWistikiServicePermission(serviceAcl), new _acls.WistikiHasOwnerModelPermission(modelAcl), new _acls.WistikiHasFriendModelPermission(modelAcl), new _acls.WistikisServicePermission(serviceAcl), new _acls.WistikiServicePermission(serviceAcl), new _acls.WistikiModelPermission(modelAcl), new _acls.WistikiFriendsServicePermission(serviceAcl), new _acls.WistikiOwnerServicePermission(serviceAcl), new _acls.WistikiFriendServicePermission(serviceAcl), new _acls.WistikiPositionsServicePermission(serviceAcl), new _acls.PasswordRootServicePermission(serviceAcl), new _acls.PositionsRootServicePermission(serviceAcl), new _acls.WistikiFoundsServicePermission(serviceAcl), new _acls.WistiketteFoundsServicePermission(serviceAcl), new _acls.WistiketteCallsServicePermission(serviceAcl), new _acls.WistikiRecoveryServicePermission(serviceAcl), new _acls.UserThreadsServicePermission(serviceAcl), new _acls.UserMessagesServicePermission(serviceAcl), new _acls.UserThreadMessagesServicePermission(serviceAcl), new _acls.UserConfirmationServicePermission(serviceAcl), new _acls.PasswordServicePermission(serviceAcl), new _acls.ApplicationModelPermission(modelAcl), new _acls.ApplicationKeysServicePermission(serviceAcl), new _acls.MessagesServicePermission(serviceAcl), new _acls.MessageServicePermission(serviceAcl), new _acls.ModelsServicePermission(serviceAcl), new _acls.ModelServicePermission(serviceAcl)];

// Building ACL
serviceAcl.build();
modelAcl.build();
_lodash2.default.each(permissions, function (permission) {
  permission.build();
});

exports.ServiceAcl = serviceAcl;
exports.ModelAcl = modelAcl;
exports.fetchServiceId = fetchServiceId;
exports.fetchRoleId = fetchRoleId;
exports.fetchModelId = fetchModelId;

/**
 * Middleware used build Access Control List
 *
 * @param req - the request object
 * @param res - the response object
 * @param next - callback to call for next step in middleware chain
 */
//# sourceMappingURL=aclMiddleware.js.map
