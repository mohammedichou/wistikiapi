'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('wistiki_has_position', {
		wistiki_serial_number: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'wistiki',
				key: 'serial_number'
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
		},
		position_end_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		underscored: true,
		freezeTableName: true,
		timestamps: false,
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		paranoid: true,
		defaultScope: {
			where: {
				position_end_date: null
			}
		},
		scopes: {
			not_active: {
				where: {
					position_end_date: {
						$ne: null
					}
				}
			},
			last: {
				limit: 1,
				order: [['position_id', 'DESC']]
			}
		}
	});
};
//# sourceMappingURL=wistiki_has_position.js.map
