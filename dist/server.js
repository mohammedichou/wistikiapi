'use strict';

require('source-map-support/register');

var _feathers = require('feathers');

var _feathers2 = _interopRequireDefault(_feathers);

var _feathersSync = require('feathers-sync');

var _feathersSync2 = _interopRequireDefault(_feathersSync);

var _feathersSocketio = require('feathers-socketio');

var _feathersSocketio2 = _interopRequireDefault(_feathersSocketio);

var _feathersRest = require('feathers-rest');

var _feathersRest2 = _interopRequireDefault(_feathersRest);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _feathersHooks = require('feathers-hooks');

var _feathersHooks2 = _interopRequireDefault(_feathersHooks);

var _feathersConfiguration = require('feathers-configuration');

var _feathersConfiguration2 = _interopRequireDefault(_feathersConfiguration);

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _services = require('./services');

var _services2 = _interopRequireDefault(_services);

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _swagger = require('../api/2.0/swagger.json');

var _swagger2 = _interopRequireDefault(_swagger);

var _jwtCheckMiddleware = require('./middlewares/jwtCheckMiddleware');

var _jwtCheckMiddleware2 = _interopRequireDefault(_jwtCheckMiddleware);

var _handler = require('./modules/errors/handler');

var _logger = require('./lib/logger');

var _validationErrorHandler = require('./middlewares/validationErrorHandler');

var _validationErrorHandler2 = _interopRequireDefault(_validationErrorHandler);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _environmentMiddleware = require('./middlewares/environmentMiddleware');

var _environmentMiddleware2 = _interopRequireDefault(_environmentMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:server');
// For mapping errors from es5 to es6

var initializeSwagger = require('swagger-tools').initializeMiddleware;

process.on('unhandledRejection', function (reason, p) {
  if (process.env.NODE_ENV === 'development') {}
  //console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);

  // application specific logging, throwing an error, or other logic here
});

if (process.env.NODE_ENV === 'production') {
  _swagger2.default.host = 'darwin.wistiki.com';
  _swagger2.default.schemes = ['https'];
  _logger.sqlLogger.clear(); // disable sql logging
} else if (process.env.NODE_ENV === 'staging') {
  _swagger2.default.host = 'staging.wistiki.com';
  _swagger2.default.schemes = ['https'];
} else if (process.env.NODE_ENV === 'sandbox') {
  _swagger2.default.host = 'darwin.wistiki.io';
  _swagger2.default.schemes = ['http'];
} else if (process.env.NODE_ENV === 'development') {
  _swagger2.default.host = '127.0.0.1:3000';
  _swagger2.default.schemes = ['http'];
  //sqlLogger.clear(); // disable sql logging
}
var build = _fs2.default.readFileSync('./build');
process.env.BUILD_REV = build;

_awsSdk2.default.config.loadFromPath('./dist/config/aws_credentials.json');

// Check database connection
_db2.default.authenticate().then(function () {
  debug('Connection has been established successfully.');
}, function (err) {
  debug('Unable to connect to the database', { error: err });
  _logger.errorLog.error('Unable to connect to the database', { error: err });
});

// Configure non-Swagger related middleware and server components prior to Swagger middleware
initializeSwagger(_swagger2.default, function (swaggerMiddleware) {
  var app = (0, _feathers2.default)();
  app.use(_bodyParser2.default.json({ limit: '5mb' }));
  app.use(_environmentMiddleware2.default);
  app.use(swaggerMiddleware.swaggerRouter({ controllers: './dist/services' }));

  // Interpret Swagger resources and attach metadata to request
  // must be first in swagger-tools middleware chain
  app.use(swaggerMiddleware.swaggerMetadata());

  // Provide the security handlers
  app.use(swaggerMiddleware.swaggerSecurity({
    oauth2: function oauth2(req, def, scopes, callback) {
      // Do real stuff here
    }
  }));

  // Validate Swagger requests
  app.use(swaggerMiddleware.swaggerValidator({
    validateResponse: false
  }));

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, ' + 'Content-Type, Accept, Authorization, ' + 'X-Wistiki-Device-Name, X-Wistiki-Device-Uid, X-Wistiki-MasterKey,' + ' X-Wistiki-Environment, x-wistiki-device-uid, x-wistiki-refresh-token');
    // Todo: mettre tout en maj à changer dans refresh token swagger
    res.header('x-powered-by', 'Wistiki ' + _package2.default.version);
    next();
  });

  // compress all requests
  app.use((0, _compression2.default)());

  // Serve the Swagger documents and Swagger UI
  app.use(swaggerMiddleware.swaggerUi({ swaggerUi: '/swagger' }));

  app.configure((0, _feathersRest2.default)()).configure((0, _feathersSocketio2.default)({
    pingTimeout: 5000,
    pingInterval: 55000,
    transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
  }, (0, _socket2.default)(app))).configure((0, _feathersSync2.default)({
    db: 'redis://' + _config2.default.redis.host + ':' + _config2.default.redis.port,
    collection: 'events'
  })).use(_jwtCheckMiddleware2.default).use(function (req, res, next) {
    req.feathers.useragent = (0, _uaParserJs2.default)(req.headers['user-agent']);
    next();
  }).use(function (req, res, next) {
    req.feathers.headers = req.headers;
    next();
  }).configure((0, _feathersHooks2.default)()).configure((0, _feathersConfiguration2.default)()).configure((0, _services2.default)()).configure((0, _hooks2.default)());
  // intercept swagger validation tool errors
  app.use(_validationErrorHandler2.default);
  app.use(_handler.handler);
  app.listen(app.get('port'), function () {
    var serverInfo = {
      event: 'server start',
      host: app.get('hostname'),
      port: app.get('port'),
      environment: process.env.NODE_ENV
    };
    debug(serverInfo);
    _logger.awsLog.debug('Server up and running', serverInfo);
  });
});
//# sourceMappingURL=server.js.map
