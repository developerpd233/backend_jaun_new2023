const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const Roles = sequelize.define(
    "roles",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
    },
      { timestamps: false }

);


module.exports = Roles;
