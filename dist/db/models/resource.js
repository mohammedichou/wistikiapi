'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('resource', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		underscored: true,
		freezeTableName: true,
		timestamps: false,
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		paranoid: false
	});
};
//# sourceMappingURL=resource.js.map
