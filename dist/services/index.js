'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function () {
    this.use('/users', _aclMiddleware2.default, _root2.default).use('/users/:email/ring', _send_push2.default).use('/password', _aclMiddleware2.default, _root4.default).use('/login', _aclMiddleware2.default, _login2.default).use('/users/:email/confirmation', _aclMiddleware2.default, _confirmation2.default).use('/users/:email/devices', _aclMiddleware2.default, _devices2.default).use('/users/:email/wistikis', _aclMiddleware2.default, _wistikis2.default).use('/users/:email/threads', _aclMiddleware2.default, _threads2.default).use('/users/:email/threads/:tid/messages', _aclMiddleware2.default, _messages2.default).use('/users/:email/messages', _aclMiddleware2.default, _messages4.default).use('/wistikis/:sn/friends', _aclMiddleware2.default, _friends2.default).use('/wistikis/:sn/owner', _aclMiddleware2.default, _owner2.default).use('/wistikis/:sn/positions', _aclMiddleware2.default, _positions2.default).use('/wistikis/:sn/founds', _aclMiddleware2.default, _founds2.default).use('/wistikettes/:sn/founds', _aclMiddleware2.default, _founds4.default).use('/wistikettes/:sn/calls', _aclMiddleware2.default, _calls2.default, function (req, res, next) {
      if (req.method === 'GET') {
        res.set('Content-Type', 'text/xml');
        res.end(res.data);
      } else {
        next();
      }
    }).use('/wistikis/:sn/recovery', _aclMiddleware2.default, _recovery2.default).use('/wistikis', _aclMiddleware2.default, _root8.default).use('/devices', _aclMiddleware2.default, _devices2.default).use('/positions', _aclMiddleware2.default, _root10.default).use('/version', _version2.default).use('/applications/:app_id/keys', _aclMiddleware2.default, _keys2.default).use('/messages', _aclMiddleware2.default, _root12.default)

    // Todo later for admin role
    .use('/softwares', _aclMiddleware2.default, _software2.default).use('/models', _aclMiddleware2.default, _root6.default).use('/firmwares', _aclMiddleware2.default, _firmwares2.default);
  };
};

var _root = require('./users/root');

var _root2 = _interopRequireDefault(_root);

var _root3 = require('./password/root');

var _root4 = _interopRequireDefault(_root3);

var _wistikis = require('./users/wistikis');

var _wistikis2 = _interopRequireDefault(_wistikis);

var _threads = require('./users/threads');

var _threads2 = _interopRequireDefault(_threads);

var _messages = require('./users/threads/messages');

var _messages2 = _interopRequireDefault(_messages);

var _confirmation = require('./users/confirmation');

var _confirmation2 = _interopRequireDefault(_confirmation);

var _messages3 = require('./users/messages');

var _messages4 = _interopRequireDefault(_messages3);

var _founds = require('./wistikis/founds');

var _founds2 = _interopRequireDefault(_founds);

var _founds3 = require('./wistikette/founds');

var _founds4 = _interopRequireDefault(_founds3);

var _calls = require('./wistikette/calls');

var _calls2 = _interopRequireDefault(_calls);

var _software = require('./software');

var _software2 = _interopRequireDefault(_software);

var _root5 = require('./models/root');

var _root6 = _interopRequireDefault(_root5);

var _devices = require('./users/devices');

var _devices2 = _interopRequireDefault(_devices);

var _root7 = require('./wistikis/root');

var _root8 = _interopRequireDefault(_root7);

var _firmwares = require('./firmwares');

var _firmwares2 = _interopRequireDefault(_firmwares);

var _friends = require('./wistikis/friends');

var _friends2 = _interopRequireDefault(_friends);

var _owner = require('./wistikis/owner');

var _owner2 = _interopRequireDefault(_owner);

var _positions = require('./wistikis/positions');

var _positions2 = _interopRequireDefault(_positions);

var _recovery = require('./wistikis/recovery');

var _recovery2 = _interopRequireDefault(_recovery);

var _root9 = require('./positions/root');

var _root10 = _interopRequireDefault(_root9);

var _keys = require('./applications/keys');

var _keys2 = _interopRequireDefault(_keys);

var _root11 = require('./messages/root');

var _root12 = _interopRequireDefault(_root11);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

var _aclMiddleware = require('../middlewares/aclMiddleware');

var _aclMiddleware2 = _interopRequireDefault(_aclMiddleware);

var _send_push = require('./send_push');

var _send_push2 = _interopRequireDefault(_send_push);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('darwin:services');
//# sourceMappingURL=index.js.map
