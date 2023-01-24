'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Privilege = exports.Resource = exports.RoleHasScope = exports.ApplicationHasScope = exports.Role = exports.Scope = exports.AppKey = exports.Application = exports.WistikiHasPosition = exports.WistikiHasOwner = exports.WistikiHasFriend = exports.Wistiki = exports.ThreadHasUser = exports.Thread = exports.Software = exports.Position = exports.Model = exports.MessageHasStatus = exports.Message = exports.DeviceHasPosition = exports.DeviceHasUser = exports.Device = exports.User = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _sequelizeTransparentCacheIoredis = require('sequelize-transparent-cache-ioredis');

var _sequelizeTransparentCacheIoredis2 = _interopRequireDefault(_sequelizeTransparentCacheIoredis);

var _sequelizeTransparentCache = require('sequelize-transparent-cache');

var _sequelizeTransparentCache2 = _interopRequireDefault(_sequelizeTransparentCache);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../lib/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var redis = new _ioredis2.default({
  host: process.env.CACHE_HOST ? process.env.CACHE_HOST : _config2.default.redis.host,
  port: _config2.default.redis.port
});
//TODO: use one redis module instead of different ones

var redisAdaptor = new _sequelizeTransparentCacheIoredis2.default({
  client: redis,
  namespace: 'model',
  lifetime: 60 * 60 * 24
});

var database = _config2.default.database;

var _sequelizeCache = (0, _sequelizeTransparentCache2.default)(redisAdaptor),
    withCache = _sequelizeCache.withCache;

var sequelize = new _sequelize2.default(database.schema, database.username, database.password, {
  replication: database.replication,
  dialect: 'mysql',
  port: database.port,
  pool: {
    minConnections: 20,
    maxIdleTime: 30000
  },
  logging: function logging(log, duration) {
    // sqlLogger.debug(log, {
    //   duration,
    // });
  },
  benchmark: true
});

// Models with cache enabled
var User = withCache(sequelize.import('./models/user'));
var Device = withCache(sequelize.import('./models/device'));
var DeviceHasUser = withCache(sequelize.import('./models/device_has_user'));
var Message = withCache(sequelize.import('./models/message'));
var MessageHasStatus = withCache(sequelize.import('./models/message_has_status'));
var Model = withCache(sequelize.import('./models/model'));
var Software = withCache(sequelize.import('./models/software'));
var Thread = withCache(sequelize.import('./models/thread'));
var ThreadHasUser = withCache(sequelize.import('./models/thread_has_user'));
var Wistiki = withCache(sequelize.import('./models/wistiki'));
var WistikiHasFriend = withCache(sequelize.import('./models/wistiki_has_friend'));
var WistikiHasOwner = withCache(sequelize.import('./models/wistiki_has_owner'));

var DeviceHasPosition = sequelize.import('./models/device_has_position');
var Position = sequelize.import('./models/position');

var WistikiHasPosition = sequelize.import('./models/wistiki_has_position');

var Application = sequelize.import('./models/application');
var AppKey = sequelize.import('./models/appKey');
var Role = sequelize.import('./models/role');
var Resource = sequelize.import('./models/resource');
var Privilege = sequelize.import('./models/privilege');
var Scope = sequelize.import('./models/scope');
var ApplicationHasScope = sequelize.import('./models/application_has_scope');
var RoleHasScope = sequelize.import('./models/role_has_scope');

// ---------------------------------------Application---------------------------------------

Application.belongsTo(User);
Application.hasMany(AppKey, {
  scope: {
    deletedAt: null
  }
});
Scope.belongsToMany(Application, {
  through: {
    model: ApplicationHasScope
  }
});
AppKey.belongsTo(Application);
// ---------------------------------------Role------------------------------------------------

Scope.belongsToMany(Role, {
  through: {
    model: RoleHasScope
  }
});

// ---------------------------------------DeviceHasUser---------------------------------------
DeviceHasUser.belongsTo(Device);
DeviceHasUser.belongsTo(User);

// ---------------------------------------WistikiHasFriend------------------------------------
WistikiHasFriend.belongsTo(User);
WistikiHasFriend.belongsTo(Wistiki);

// ---------------------------------------WistikiHasOwner-------------------------------------
WistikiHasOwner.belongsTo(User);

// ---------------------------------------ThreadHasUser---------------------------------------
ThreadHasUser.belongsTo(User);

// ---------------------------------------MessageHasStatus------------------------------------
MessageHasStatus.belongsTo(Message);
MessageHasStatus.belongsTo(User);

// ---------------------------------------Wistiki--------------------------------------------
Wistiki.belongsTo(Model);
Wistiki.belongsToMany(User, {
  through: {
    model: WistikiHasOwner,
    unique: true,
    scope: {
      ownership_end_date: null
    }
  },
  foreignKey: 'wistiki_serial_number',
  as: 'owner'

});
Wistiki.belongsToMany(User, {
  through: {
    model: WistikiHasFriend,
    scope: {
      share_end_date: null
    }
  },
  foreignKey: 'wistiki_serial_number',
  as: 'friends'
});

Model.hasMany(Software);
Model.hasOne(Software, {
  as: 'last_software',
  foreignKey: 'model_id',
  scope: {
    status: '1'
  }
});
Wistiki.belongsToMany(Position, {
  through: {
    model: WistikiHasPosition,
    scope: {
      position_end_date: null
    }
  },
  foreignKey: 'wistiki_serial_number',
  as: 'positions'
});

Wistiki.hasOne(WistikiHasPosition, {
  as: 'last_position',
  foreignKey: 'wistiki_serial_number'
});

// ---------------------------------------Device---------------------------------------
Device.belongsToMany(User, {
  through: {
    model: DeviceHasUser
  },
  foreignKey: 'device_uid',
  as: 'owner'
});
Device.belongsToMany(Position, {
  through: {
    model: DeviceHasPosition
  },
  foreignKey: 'device_uid',
  as: 'positions'
});

// ---------------------------------------Thread---------------------------------------
Thread.belongsToMany(User, {
  through: {
    model: ThreadHasUser
  },
  foreignKey: 'thread_id',
  as: {
    singular: 'participant',
    plural: 'participants'
  }
});

Thread.belongsTo(User, { as: 'creator', foreignKey: 'user_email' });
Thread.hasMany(Message);
Thread.hasOne(Message, {
  as: 'last_message',
  foreignKey: 'thread_id'
});

// ---------------------------------------Message---------------------------------------

Message.belongsTo(Thread);
Message.belongsTo(User, { as: 'author', foreignKey: 'user_email' });
Message.hasMany(MessageHasStatus, { as: 'states', foreignKey: 'message_id' });

// ---------------------------------------User---------------------------------------
User.belongsToMany(Thread, {
  through: {
    model: ThreadHasUser
  }
});

User.hasMany(Message);

User.belongsToMany(Wistiki, {
  through: {
    model: WistikiHasOwner,
    scope: {
      ownership_end_date: null
    },
    unique: true
  },
  foreignKey: 'user_email',
  as: 'activeOwnership'
});

User.belongsToMany(Device, {
  through: {
    model: DeviceHasUser
  },
  foreignKey: 'user_email',
  as: 'ownedDevices'

});

User.belongsToMany(Wistiki, {
  through: {
    model: WistikiHasFriend,
    scope: {
      share_end_date: null
    }
  },
  foreignKey: 'user_email',
  as: {
    singular: 'activeSharedWistiki',
    plural: 'activeSharedWistikis'
  }
});

// ---------------------------------------Position---------------------------------------
Position.belongsToMany(Wistiki, {
  through: {
    model: WistikiHasPosition,
    scope: {
      position_end_date: null
    }
  },
  foreignKey: 'position_id',
  as: {
    singular: 'activePosition',
    plural: 'activePositions'
  }
});

// ---------------------------------------WistikiHasPosition---------------------------------------
WistikiHasPosition.belongsTo(Position);
exports.User = User;
exports.Device = Device;
exports.DeviceHasUser = DeviceHasUser;
exports.DeviceHasPosition = DeviceHasPosition;
exports.Message = Message;
exports.MessageHasStatus = MessageHasStatus;
exports.Model = Model;
exports.Position = Position;
exports.Software = Software;
exports.Thread = Thread;
exports.ThreadHasUser = ThreadHasUser;
exports.Wistiki = Wistiki;
exports.WistikiHasFriend = WistikiHasFriend;
exports.WistikiHasOwner = WistikiHasOwner;
exports.WistikiHasPosition = WistikiHasPosition;
exports.Application = Application;
exports.AppKey = AppKey;
exports.Scope = Scope;
exports.Role = Role;
exports.ApplicationHasScope = ApplicationHasScope;
exports.RoleHasScope = RoleHasScope;
exports.Resource = Resource;
exports.Privilege = Privilege;
exports.default = sequelize;
//# sourceMappingURL=index.js.map
