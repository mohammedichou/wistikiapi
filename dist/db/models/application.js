'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('application', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		master_key: {
			type: DataTypes.STRING,
			allowNull: false
		},
		user_email: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'user',
				key: 'email'
			}
		}
	}, {
		underscored: true,
		freezeTableName: true,
		timestamps: false,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		paranoid: true
	});
};
//# sourceMappingURL=application.js.map
