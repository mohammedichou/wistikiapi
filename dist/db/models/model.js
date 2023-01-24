'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('model', {
    id: {
      type: DataTypes.INTEGER(10),
      autoIncrement: true,
      primaryKey: true
    },
    commercial_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    icon_url: {
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
//# sourceMappingURL=model.js.map
