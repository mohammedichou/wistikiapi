'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('scope', {
		privilege_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			references: {
				model: 'privilege',
				key: 'id'
			}
		},
		resource_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			references: {
				model: 'resource',
				key: 'id'
			}

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
//# sourceMappingURL=scope.js.map
