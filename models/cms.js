const { DataTypes } = require("sequelize");

const sequelize = require("../util/db");

const CMS = sequelize.define(
  "content_pages",
  
  
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    page_text: {
      type: DataTypes.STRING,
    },
    excerpt: {
      type: DataTypes.STRING,
    },
    // created_at: {
    //   type: DataTypes.STRING,
    // },
  },
  { timestamps: true }
);

module.exports = CMS;
