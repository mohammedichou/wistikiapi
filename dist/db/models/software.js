'use strict';

/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('software', {
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    model_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'model',
        key: 'id'
      }
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
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
//# sourceMappingURL=software.js.map
