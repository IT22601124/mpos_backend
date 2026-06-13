import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BranchModel = sequelize.define('branches', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'branches',
     timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

});

 Branch.associate = function (models) {
    Branch.hasMany(models.BackendUser, {
      foreignKey: 'branch_id',
      as: 'backend_users',
    });
  };
module.exports = BranchModel;