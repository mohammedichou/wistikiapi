'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _device = require('./models/device');

Object.defineProperty(exports, 'DeviceModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_device).default;
  }
});

var _application = require('./models/application');

Object.defineProperty(exports, 'ApplicationModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_application).default;
  }
});

var _wistiki = require('./models/wistiki');

Object.defineProperty(exports, 'WistikiModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_wistiki).default;
  }
});

var _wistiki_has_owner = require('./models/wistiki_has_owner');

Object.defineProperty(exports, 'WistikiHasOwnerModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_wistiki_has_owner).default;
  }
});

var _wistiki_has_friend = require('./models/wistiki_has_friend');

Object.defineProperty(exports, 'WistikiHasFriendModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_wistiki_has_friend).default;
  }
});

var _user = require('./models/user');

Object.defineProperty(exports, 'UserModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_user).default;
  }
});

var _message = require('./models/message');

Object.defineProperty(exports, 'MessageModelPermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_message).default;
  }
});

var _id = require('./services/users/id');

Object.defineProperty(exports, 'UserServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id).default;
  }
});

var _root = require('./services/users/root');

Object.defineProperty(exports, 'UsersServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root).default;
  }
});

var _id2 = require('./services/login/id');

Object.defineProperty(exports, 'LoginServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id2).default;
  }
});

var _root2 = require('./services/login/root');

Object.defineProperty(exports, 'LoginRootServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root2).default;
  }
});

var _verify = require('./services/verify');

Object.defineProperty(exports, 'VerifyServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_verify).default;
  }
});

var _root3 = require('./services/users/devices/root');

Object.defineProperty(exports, 'UserDevicesServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root3).default;
  }
});

var _id3 = require('./services/users/devices/id');

Object.defineProperty(exports, 'UserDeviceServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id3).default;
  }
});

var _root4 = require('./services/users/wistikis/root');

Object.defineProperty(exports, 'UserWistikisServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root4).default;
  }
});

var _id4 = require('./services/users/wistikis/id');

Object.defineProperty(exports, 'UserWistikiServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id4).default;
  }
});

var _id5 = require('./services/wistikis/id');

Object.defineProperty(exports, 'WistikiServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id5).default;
  }
});

var _root5 = require('./services/wistikis/root');

Object.defineProperty(exports, 'WistikisServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root5).default;
  }
});

var _root6 = require('./services/wistikis/friends/root');

Object.defineProperty(exports, 'WistikiFriendsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root6).default;
  }
});

var _root7 = require('./services/wistikis/owner/root');

Object.defineProperty(exports, 'WistikiOwnerServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root7).default;
  }
});

var _id6 = require('./services/wistikis/friends/id');

Object.defineProperty(exports, 'WistikiFriendServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id6).default;
  }
});

var _founds = require('./services/wistikis/founds');

Object.defineProperty(exports, 'WistikiFoundsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_founds).default;
  }
});

var _founds2 = require('./services/wistikette/founds');

Object.defineProperty(exports, 'WistiketteFoundsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_founds2).default;
  }
});

var _calls = require('./services/wistikette/calls');

Object.defineProperty(exports, 'WistiketteCallsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_calls).default;
  }
});

var _recovery = require('./services/wistikis/recovery');

Object.defineProperty(exports, 'WistikiRecoveryServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_recovery).default;
  }
});

var _positions = require('./services/wistikis/positions');

Object.defineProperty(exports, 'WistikiPositionsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_positions).default;
  }
});

var _root8 = require('./services/password/root');

Object.defineProperty(exports, 'PasswordRootServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root8).default;
  }
});

var _id7 = require('./services/password/id');

Object.defineProperty(exports, 'PasswordServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id7).default;
  }
});

var _root9 = require('./services/positions/root');

Object.defineProperty(exports, 'PositionsRootServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root9).default;
  }
});

var _root10 = require('./services/users/threads/root');

Object.defineProperty(exports, 'UserThreadsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root10).default;
  }
});

var _root11 = require('./services/users/messages/root');

Object.defineProperty(exports, 'UserMessagesServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root11).default;
  }
});

var _messages = require('./services/users/threads/messages');

Object.defineProperty(exports, 'UserThreadMessagesServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_messages).default;
  }
});

var _id8 = require('./services/users/confirmation/id');

Object.defineProperty(exports, 'UserConfirmationServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id8).default;
  }
});

var _keys = require('./services/applications/keys');

Object.defineProperty(exports, 'ApplicationKeysServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_keys).default;
  }
});

var _root12 = require('./services/messages/root');

Object.defineProperty(exports, 'MessagesServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root12).default;
  }
});

var _id9 = require('./services/messages/id');

Object.defineProperty(exports, 'MessageServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id9).default;
  }
});

var _root13 = require('./services/models/root');

Object.defineProperty(exports, 'ModelsServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_root13).default;
  }
});

var _id10 = require('./services/models/id');

Object.defineProperty(exports, 'ModelServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_id10).default;
  }
});

var _calls_callback = require('./services/wistikette/calls_callback');

Object.defineProperty(exports, 'WistikiCallsCallbackServicePermission', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_calls_callback).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map
