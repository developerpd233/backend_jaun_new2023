const sequelize = require("../util/db");
const { DataTypes, Model } = require("sequelize");
const log = sequelize.define("logs",{
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        log: { 
            type: DataTypes.TEXT, 
        },
      },
      { timestamps: true }
);        
module.exports = log;
    