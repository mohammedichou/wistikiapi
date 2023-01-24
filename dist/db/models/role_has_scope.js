'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('role_has_scope', {
		role_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			references: {
				model: 'role',
				key: 'id'
			}
		},
		scope_privilege_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			references: {
				model: 'scope',
				key: 'privilege_id'
			}
		},
		scope_resource_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			references: {
				model: 'scope',
				key: 'resource_id'
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
//# sourceMappingURL=role_has_scope.js.map
