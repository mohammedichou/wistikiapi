'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('role', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
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
//# sourceMappingURL=role.js.map
