const jwt = require("jsonwebtoken");
const db = require(`../util/db`);
const { QueryTypes } = require('sequelize');
const User = require("../models/user");
module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    // throw error;
    return res.status(401).json({ error: error.message, status: 401 });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "pd_JWTSecret_123");
  } catch (err) {
    err.statusCode = 500;
    // throw err;
    return res.status(500).json({ error: err.message, status: 500 });
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    // throw error;
    return res.json({ error: error.message, status: 401 });
  }
  
   req.userId = decodedToken.id;
   console.log("token ------>", decodedToken);

  console.log("userId ---------------->", req.userId);
  
   //const tokenExist = await db.query(`SELECT id FROM users WHERE jwt_token='${token}'`,{ type: QueryTypes.SELECT });
   //console.log('token checking in databse existing tokenExist====>',tokenExist)
   
   const user = await User.findOne({where:{jwt_token:token}});


   console.log('!user===>',!user)
   console.log('user===>',user)
   
   if(!user){ 
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      // throw error;
      return res.json({ error: error.message, status: 401 }); 
    }
  //return res.json(user);
   
   next();

};
