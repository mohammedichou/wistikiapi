'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('message_has_status', {
		message_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'message',
				key: 'id'
			}
		},
		user_email: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'user',
				key: 'email'
			}
		},
		read: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: '0'
		},
		status_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		underscored: true,
		freezeTableName: true,
		timestamps: false,
		createdAt: 'status_date',
		updatedAt: 'status_date',
		deletedAt: false,
		paranoid: true,
		hooks: {
			beforeCreate: function beforeCreate(messageStatus, fn) {
				messageStatus.status_date = (0, _moment2.default)().utc();
			}
		}
	});
};
//# sourceMappingURL=message_has_status.js.map
