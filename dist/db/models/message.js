'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('message', {
		id: {
			type: DataTypes.INTEGER(10),
			autoIncrement: true,
			primaryKey: true
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		user_email: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'user',
				key: 'email'
			}
		},
		thread_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			references: {
				model: 'thread',
				key: 'id'
			}
		},
		type: {
			type: DataTypes.ENUM('NOTIFICATION', 'MESSAGE'),
			allowNull: true,
			defaultValue: 'MESSAGE'
		}
	}, {
		underscored: true,
		freezeTableName: true,
		timestamps: false,
		createdAt: 'date',
		updatedAt: false,
		deletedAt: false,
		paranoid: false,
		hooks: {
			beforeCreate: function beforeCreate(message, fn) {
				message.date = (0, _moment2.default)().utc();
			}
		}
	});
};
//# sourceMappingURL=message.js.map
