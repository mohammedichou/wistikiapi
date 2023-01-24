'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = function (req, res, next) {
  var token = void 0;
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      var _parts = (0, _slicedToArray3.default)(parts, 2),
          scheme = _parts[0],
          credentials = _parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      next(new _index2.default.NotAuthenticated('Format is Authorization: Bearer [token]'));
    }
  } else if (req.params.token) {
    // We delete the token from param to not mess with blueprints
    token = req.params;
    delete req.query.token;
  } else {
    return next();
  }
  return (0, _jwtCheck2.default)(token).then(function (result) {
    if (result[2] === 'user') {
      var _result = (0, _slicedToArray3.default)(result, 2),
          user = _result[0],
          device = _result[1];

      req.feathers.user = user;
      req.feathers.uid = device.get('uid');
      req.feathers.device = device;
      return next();
    } else if (result[2] === 'application') {
      var _result2 = (0, _slicedToArray3.default)(result, 2),
          application = _result2[0],
          appKey = _result2[1];

      req.feathers.application = application;
      req.feathers.appKey = appKey;
      return next();
    }
    return next();
  }, function (err) {
    return next(err);
  });
};

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _jwtCheck = require('../lib/jwtCheck');

var _jwtCheck2 = _interopRequireDefault(_jwtCheck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:middlewares:jwtCheck');
/**
 * Middleware used to catch request validation via Swagger Validation and translate them to a http error
 *
 * @param err - An error
 * @param req - the request object
 * @param res - the response object
 * @param next - callback to call for next step in middleware chain
 */
//# sourceMappingURL=jwtCheckMiddleware.js.map
