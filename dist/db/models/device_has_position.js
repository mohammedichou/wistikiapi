'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('device_has_position', {
		device_uid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'device',
				key: 'uid'
			}
		},
		position_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'position',
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
		paranoid: true
	});
};
//# sourceMappingURL=device_has_position.js.map
