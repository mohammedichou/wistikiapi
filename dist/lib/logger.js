'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chipoloLogger = exports.redisLogger = exports.ownershiplLogger = exports.sqlLogger = exports.msnLog = exports.socketLog = exports.errorLog = exports.snsLog = exports.awsLog = undefined;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _winstonCloudwatchTransport = require('winston-cloudwatch-transport');

var _winstonCloudwatchTransport2 = _interopRequireDefault(_winstonCloudwatchTransport);

var _aws_credentials = require('../config/aws_credentials.json');

var _aws_credentials2 = _interopRequireDefault(_aws_credentials);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wistiki SAS
 * Created by adnene on 07/12/2015.
 */
_winston2.default.remove(_winston2.default.transports.Console);
_winston2.default.add(_winston2.default.transports.Console, {
  colorize: true,
  prettyPrint: true,
  timestamp: function timestamp() {
    return new Date().toISOString();
  }
});
_winston2.default.level = 'debug';
exports.default = _winston2.default;


var awsOptions = function awsOptions(level, logGroupName, logStreamName) {
  return {
    logGroupName: logGroupName,
    logStreamName: logStreamName,
    awsAccessKeyId: _aws_credentials2.default.accessKeyId,
    awsSecretKey: _aws_credentials2.default.secretAccessKey,
    awsRegion: 'eu-west-1'
  };
};
var awsLogger = new _winston2.default.Logger();
var awsSnsLogger = new _winston2.default.Logger();
var awsErrorLogger = new _winston2.default.Logger();
var awsSocketLogger = new _winston2.default.Logger();
var awsRedisLogger = new _winston2.default.Logger();
var awsMsnCipherLogger = new _winston2.default.Logger();
var awsSqlLogger = new _winston2.default.Logger();
var ownershiplLogger = new _winston2.default.Logger();
var awsChipoloLogger = new _winston2.default.Logger();

awsLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'all'));
awsSnsLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'sns'));
awsErrorLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'error'));
awsSocketLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'socket'));
awsRedisLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'redis'));
awsMsnCipherLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'msnCipher'));
awsSqlLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'sql'));
ownershiplLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'ownership'));
awsChipoloLogger.add(_winstonCloudwatchTransport2.default, awsOptions('silly', _config2.default.hostname, 'chipolo'));

var socketLogger = process.env.NODE_ENV === 'default' || process.env.NODE_ENV === 'development' ? _winston2.default : awsSocketLogger;

exports.awsLog = awsLogger;
exports.snsLog = awsSnsLogger;
exports.errorLog = awsErrorLogger;
exports.socketLog = socketLogger;
exports.msnLog = awsMsnCipherLogger;
exports.sqlLogger = awsSqlLogger;
exports.ownershiplLogger = ownershiplLogger;
exports.redisLogger = awsRedisLogger;
exports.chipoloLogger = awsChipoloLogger;
//# sourceMappingURL=logger.js.map
