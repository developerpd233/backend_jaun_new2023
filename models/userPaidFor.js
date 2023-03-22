    const User = require("./user");
    const sequelize = require("../util/db");
    const { DataTypes, Model } = require("sequelize");

    const userPaidFor = sequelize.define(
      "user_paid_fors",{
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        userId: { 
            type: DataTypes.INTEGER 
        },
        paidForUser: { 
            type: DataTypes.INTEGER 
        },
        paidAt: { 
            type: DataTypes.DATEONLY, 
        },
      },
      { timestamps: true }
    );
    
    userPaidFor.associate = (model) => {
        userPaidFor.belongsTo(User, { onDelete: "CASCADE" });
    };
    
    module.exports = userPaidFor;
    