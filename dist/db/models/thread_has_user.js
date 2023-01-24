'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('thread_has_user', {
		thread_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'thread',
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
		}
	}, {
		underscored: true,
		freezeTableName: true,
		timestamps: false,
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		paranoid: true
	});
};
//# sourceMappingURL=thread_has_user.js.map
