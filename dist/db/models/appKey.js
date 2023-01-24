'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('appKey', {
		application_id: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'application',
				key: 'id'
			}
		},
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		expireAt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true
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
//# sourceMappingURL=appKey.js.map
