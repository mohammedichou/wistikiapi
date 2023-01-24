'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoContent = exports.MethodNotImplemented = exports.create = undefined;

var _index = require('feathers-errors/lib/index');

var _index2 = _interopRequireDefault(_index);

var _httpStatus = require('./httpStatus');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a new HTTP error
 *
 * @param name of this error
 * @param message to be displayed
 * @param code HTTP error code
 * @param errors Array of erros
 * @returns {errorTypes.FeathersError}
 */
/**
 * TODO: write doc for this module
 */

var create = exports.create = function create(name, message, code, errors) {
  var error = new new errors.GeneralError(message)();
  error.name = name;
  error.code = code;
  error.errors = errors;
  return error;
};
/**
 * The server does not support the functionality required to fulfill the request. This is the appropriate response
 * when the server does not recognize the request method and is not capable of supporting it for any resource.
 *
 * @param message
 * @param errors
 * @constructor
 */
var MethodNotImplemented = exports.MethodNotImplemented = function MethodNotImplemented() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Method Not Implemented';
  var errors = arguments[1];
  return create('MethodNotImplemented', message, _httpStatus2.default.NOT_IMPLEMENTED, errors);
};
/**
 * The server does not support the functionality required to fulfill the request. This is the appropriate response
 * when the server does not sent a text response.
 *
 * @param message
 * @param errors
 * @constructor
 */
var NoContent = exports.NoContent = function NoContent() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'No Content';
  var errors = arguments[1];
  return create('NoContent', message, _httpStatus2.default.NO_CONTENT, errors);
};
//# sourceMappingURL=index.js.map
