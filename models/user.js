const { DataTypes, Model } = require("sequelize");

const sequelize = require("../util/db");
const Location = require("./location");
const Picture = require("./picture");
const userPaidFor = require("./userPaidFor");

const User = sequelize.define(
  "user",{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    identity: {
      type: DataTypes.STRING,
    },
    interest: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.STRING,
    },
    relationPreference: {
      type: DataTypes.STRING,
    },
    favDrink: {
      type: DataTypes.STRING,
    },
    favSong: {
      type: DataTypes.STRING,
    },
    hobbies: {
      type: DataTypes.STRING,
    },
    petPeeve: {
      type: DataTypes.STRING,
    },
    
    qrCodeId: {
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    oneTimePaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stripeSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stripeCustomerId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    stripeSubsStartDate:{
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    stripeSubsEndDate:{
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    otpEmailCode:{
      default:null,
      allowNull:true,
      type:DataTypes.STRING
    },
    otpEmailSentAt:{
      default:null,
      allowNull:true,
      type:DataTypes.DATE
    },
    fcmToken:{
      default:null,
      allowNull: true,
      type:DataTypes.STRING
    },
    jwt_token:{
      default:null,
      allowNull: true,
      type:DataTypes.TEXT
    },
    showbar:{
      default:true,
      allowNull: false,
      type:DataTypes.BOOLEAN
    },
    todayOtpVerified:{
      default:false,
      allowNull: false,
      type:DataTypes.BOOLEAN
    },
    imageUrl:{
      default:null,
      allowNull: true,
      type:DataTypes.STRING
    }

  },
  { timestamps: false }
);

User.associate = (model) => {
  User.hasOne(Picture, {
    onDelete: "CASCADE",
  });
};
User.associate = (model) => {
  User.belongsTo(Location, {
    onDelete: "CASCADE",
  });
};
User.associate = (model) => {
  User.hasOne(userPaidFor, {
    onDelete: "CASCADE",
  });
};

module.exports = User;
