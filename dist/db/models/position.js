'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('position', {
		id: {
			type: DataTypes.INTEGER(10),
			autoIncrement: true,
			primaryKey: true
		},
		position: {
			type: DataTypes.GEOMETRY('POINT'),
			allowNull: false
		},
		accuracy: {
			type: DataTypes.INTEGER(3),
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		formatted_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		street_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		street_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true
		},
		country_code: {
			type: DataTypes.STRING,
			allowNull: true
		},
		zip_code: {
			type: DataTypes.STRING,
			allowNull: true
		},
		uid: {
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
		paranoid: true
	});
};
//# sourceMappingURL=position.js.map
