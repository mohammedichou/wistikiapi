'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e, req, res, next) {
  var err = e;
  if (err instanceof SyntaxError) {
    debug('err is instance of SyntaxError');

    var error = new Error('SYNTAX_ERROR');
    error.errors = [{ code: 'SYNTAX_ERROR', message: err.message }];
    err = new _index2.default.BadRequest(error);
  } else if (err instanceof Error && err.code === 'SCHEMA_VALIDATION_FAILED') {
    debug('err is instance of SCHEMA_VALIDATION_FAILED');
    var _error = new Error('SCHEMA_VALIDATION_FAILED');
    _error.errors = err.results.errors.map(function (e) {
      return {
        code: e.code,
        message: e.message,
        field: e.path
      };
    });
    err = new _index2.default.BadRequest(_error);
  } else if (err instanceof Error && err.code === 'REQUIRED') {

    debug('err code is REQUIRED');
    var _error2 = new Error('PARAM_REQUIRED');
    _error2.errors = [err.message];
    err = new _index2.default.BadRequest(_error2);
  } else if (!(err instanceof _index2.default.FeathersError)) {

    debug('err is Server Error');
    _logger.errorLog.error('Server Error', {
      event: 'server error',
      error: { code: err.code, message: err.message, stack: _stackTrace2.default.parse(err) }
    });

    _logger2.default.error(err);
    debug('Server Error: ', err);

    if (_config2.default.debug) {
      err = new _index2.default.GeneralError(err.message, { errors: _stackTrace2.default.parse(err) });
    } else {
      err = new _index2.default.GeneralError('SERVER_ERROR');
    }
  }
  next(err);
};

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _stackTrace = require('stack-trace');

var _stackTrace2 = _interopRequireDefault(_stackTrace);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:errors:validationErrorHandler');
/**
 * Middleware used to catch request validation via Swagger Validation
 * and translate them to a http error
 *
 * @param e - An error
 * @param req - the request object
 * @param res - the response object
 * @param next - callback to call for next step in middleware chain
 */
//# sourceMappingURL=validationErrorHandler.js.map
