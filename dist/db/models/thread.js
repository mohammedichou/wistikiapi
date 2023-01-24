'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('thread', {
		id: {
			type: DataTypes.INTEGER(10),
			autoIncrement: true,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
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
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		paranoid: true
	});
};
//# sourceMappingURL=thread.js.map
