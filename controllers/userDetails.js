const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("moment");

const nodemailer = require('nodemailer');
const stripe = require("stripe")(process.env.STRIPE_API);
const schedule = require("node-schedule");

const Location = require("../models/location");
const Picture = require("../models/picture");
const QRCode = require("../models/qrCode");
const User = require("../models/user");
const { uploadSelfie,uploadImageBufferData } = require("../s3");
const userPaidFor = require("../models/userPaidFor");
const db = require(`../util/db`);
const { QueryTypes } = require('sequelize');
const { sendMail } = require('../util/mailer');
const {otpDigit} = require('../util/otpGenerator');
const sharp = require('sharp');


// exports.profileUpdate = async (req,res,next)=>{
//   try{

  
    
//       const errors={};
//       const {otpCode,email,name,identity,interest,age,favDrink,favSong,hobbies,petPeeve,relationPreference,fcmToken}= req.body;  
      
//       if(!age){errors.age=`age is required.`;}
//       if(!name){errors.name=`name is required.`;}
//       if(!email){errors.email=`email is required.`;}
//       if(!otpCode){errors.otpCode=`otpCode is required.`;}
//       if(!identity){errors.identity=`identity is required.`;}
//       if(!interest){errors.interest=`interest is required.`;}
//       if(!favDrink){errors.favDrink=`favDrink is required.`;}
//       if(!favSong){errors.favSong=`favSong is required.`;}
//       if(!hobbies){errors.hobbies=`hobbies is required.`;}
//       if(!petPeeve){errors.petPeeve=`petPeeve is required.`;}
//       if(!relationPreference){errors.relationPreference=`relationPreference is required.`;}
//       if(!fcmToken){errors.fcmToken=`fcmToken is required.`;}
      
//       if(Object.keys(errors).length>0){ return res.status(400
//         ).json({status:'fails',errors}); }

//       let user  = await User.findOne({where:{otpEmailCode:otpCode,email}});

      
      




//   }catch(err){
//     console.log(new Date().toLocaleString(),`catch===>`,{status:`error`,message:err.message});
//     return res.json({status:`error`,message:err.message});
//   }
  
// }




exports.verifyOtp = async (req,res,next)=>{
  try{

     // this fcm token hard code it for dev purpose 
     //req.body.fcmToken="testing purpose stop";

      console.log(new Date().toLocaleString(),` ===> verifyOtp func called...`);

      const errors={};
      //const otpExpired = await db.query(`SELECT otpEmailSentAt=NULL WHERE id=${user.id}`)
      const {otpCode,email,name,identity,interest,age,favDrink,favSong,hobbies,petPeeve,relationPreference,fcmToken,already_OTPverified}= req.body;  
      
      if(!age){errors.age=`age is required.`;}
      if(!name){errors.name=`name is required.`;}
      if(!email){errors.email=`email is required.`;}

        if (already_OTPverified == 'true') {
          
        }else{
          if(!otpCode){errors.otpCode=`otpCode is required.`;}
        }
      if(!identity){errors.identity=`identity is required.`;}
      if(!interest){errors.interest=`interest is required.`;}
      if(!favDrink){errors.favDrink=`favDrink is required.`;}
      if(!favSong){errors.favSong=`favSong is required.`;}
      if(!hobbies){errors.hobbies=`hobbies is required.`;}
      if(!petPeeve){errors.petPeeve=`petPeeve is required.`;}
      if(!relationPreference){errors.relationPreference=`relationPreference is required.`;}
      if(!fcmToken){errors.fcmToken=`fcmToken is required.`;}
      

      
      if(Object.keys(errors).length>0){ return res.json({status:'fails',errors}); }

      let user;
      if (already_OTPverified == 'true') {
        user  = await User.findOne({where:{todayOtpVerified:1,email}});  
      }else{
        user  = await User.findOne({where:{otpEmailCode:otpCode,email}});
      console.log(new Date().toLocaleString(),`=> findOne user otpEmailCode=${otpCode} ,email=${email} result=`,user);
      }
      
      // return res.json(user);


      if(!user || !user.id){ 
        // console.log(new Date().toLocaleString(),`=> user not exist otpEmailCode=${otpCode} ,email=${email}`);
        console.log(new Date().toLocaleString(),{status:`failed`,message:`Invalid OTP`});
        return res.json({status:`failed`,message:`Invalid OTP`}); 
      }
      else
      {
        const token = jwt.sign({ id: user.id },"pd_JWTSecret_123");
        // console.log(`OTP=${otpCode} & email=${email} successfully verified.`);
        const updated = await db.query(`UPDATE users SET todayOtpVerified='1', age='${age}', name='${name}', identity='${identity}', interest='${interest}', favSong='${favSong}', favDrink='${favDrink}', hobbies='${hobbies}' ,petPeeve='${petPeeve}' ,relationPreference='${relationPreference}' ,showbar='1' ,fcmToken='${fcmToken}' ,jwt_token='${token}' ,otpEmailCode=NULL,otpEmailSentAt=NULL WHERE id=${user.id}`)
        user = await User.findByPk(user.id);
        console.log(`Verified email=${email} row updated user`,updated);
        //const token = jwt.sign({ id: user.id },"pd_JWTSecret_123");
        console.log({ msg:"User email successfully verified by OTP.",token,user});
        return res.status(200).json({ msg:"User email successfully verified by OTP.",token,user});
      
      }

      

      // var otpEmailSentAt = moment(user.otpEmailSentAt);
      // var otpEmailSentAdded = moment(otpEmailSentAt).add(5, 'minutes')
      // //return res.json({otpEmailSentAt,otpEmailSentAdded});

      
      // if(otpEmailSentAdded.diff(otpEmailSentAt) >= 0)
      // {
      //   console.log(new Date().toLocaleString(),`res===>`,{result:'if',otpEmailSentAt,otpEmailSentAdded,current:moment()});
      //   return res.json({result:'if',otpEmailSentAt,otpEmailSentAdded,current:moment()})
      // }
      
      // else
      // { 
      //   console.log(new Date().toLocaleString(),`res===>`,{result:'else',otpEmailSentAt,otpEmailSentAdded,current:moment()});
      //   return res.json({result:'else',otpEmailSentAt,otpEmailSentAdded,current:moment()}); 
      // }
    

      //return res.json();

      // user.age = age;
      // user.name = name;
      // user.identity = identity;
      // user.interest = interest;
      // user.favSong = favSong;
      // user.favDrink = favDrink;
      // user.hobbies = hobbies;
      // user.petPeeve = petPeeve;
      // user.relationPreference = relationPreference;
      // user = await user.save();
      // const token = jwt.sign({ id: user.id },"pd_JWTSecret_123");
      // const updated = await db.query(`UPDATE users SET otpEmailCode=NULL,otpEmailSentAt=NULL WHERE id='${user.id}'`)
      // return res.status(200).json({ msg:"User email successfully verified by OTP.",token,user});


      
      //return res.json(user.otpEmailCode);

      //const otpExpired = await db.query(`SELECT * FROM users WHERE id='${user.id}' && otpEmailSentAt BETWEEN NOW() - INTERVAL 60 MINUTE AND NOW() - INTERVAL 5 MINUTE`)
    

      //return res.json(otpExpired )
      
      //return res.json({user}); 



      //console.log({errors});
      //return res.json(errors);

      // if (!otpCode || !email || !name || !identity || !interest || !age || !favDrink || !favSong || !hobbies || !petPeeve || !relationPreference)
      // {
      //   const error = new Error("You must fill all fields");
      //   error.statusCode = 403;
      //   // throw error.message;
      //   return res.status(403).json({ error: error.message });
      // }
      // else {return res.json({status:`success`,data:req.body});}


      // const {otpCode} = req.body;
      // if(!otpCode){return res.json({status:`failed`,message:`otpCode is required.`});}  
      // const user  = await User.findOne({where:{otpEmailCode:otpCode}});
      // if(!user){ return res.json({status:`failed`,message:`Invalid OTP`}); }
      // else
      // {
      //   //const updated = await db.query(`UPDATE users SET otpEmailCode='NULL,otpEmailSentAt=NULL WHERE id=${user.id}`)
      //   const token = jwt.sign({ id: user.id }, "pd_JWTSecret_123");
      //   return res.status(200).json({ msg:"User email successfully verified by OTP.",token,user});
      // }



  }catch(err){
    console.log(new Date().toLocaleString(),`catch===>`,{status:`error`,message:err.message});
    return res.json({status:`error`,message:err.message});
  }
  
}


exports.newUser = async (req, res, next) => {
  
  //return res.send("786 newUser");

  //req.body.fcmToken="testing purpose stop";

  const qrId = req.params.qrId;
  console.log("params---", req.params);
  const {
    email,
    name,
    identity,
    interest,
    age,
    favDrink,
    favSong,
    hobbies,
    petPeeve,
    relationPreference,
    fcmToken,
  } = req.body;

  try {
    if (
      !email &&
      !name &&
      !identity &&
      !interest &&
      !age &&
      !favDrink &&
      !favSong &&
      !hobbies &&
      !petPeeve &&
      !relationPreference &&
      !fcmToken
    ) {

      const error = new Error("You must fill all fields.");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }

    // const validateEmail = (email) => {
    //   return email.match(
    //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   );
    // };
    // if (!validateEmail(email)) {
    //   const error = new Error("Email is not valid");
    //   error.statusCode = 403;
    //   // throw error.message;
    //   return res.status(403).json({ error: error.message });
    // }

    // if (!email) {
    //   const error = new Error("Email cannot be empty");
    //   error.statusCode = 403;
    //   // throw error.message;
    //   return res.status(403).json({ error: error.message });
    // }

    if (!name) {
      const error = new Error("Name cannot be empty");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }

    if (!age) {
      const error = new Error("Please enter your age");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }
    if (!relationPreference) {
      const error = new Error("Please enter your relation Preference");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }

    const qrCode = await QRCode.findByPk(qrId);
    if (!qrCode) {
      return res.status(404).json({
        msg: "No such QR or QRcode may be not scanned correctly",
      });
    }

    if (!email) {
      const error = new Error("Email cannot be empty");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }

    if (!fcmToken) {
      const error = new Error("fcmToken cannot be empty");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }

    

    const existingUser =  await User.findOne({where:{ email:email }});
   
    if (existingUser && existingUser?.todayOtpVerified===true){

      const token = jwt.sign({ id: existingUser.id }, "pd_JWTSecret_123");
      console.log('jwt_token stored in db. token=====>',token)
      const updated = await db.query(`UPDATE users SET jwt_token='${token}' ,showbar='1' WHERE id=${existingUser?.id}`)
      return res.status(200).json({
        msg: "User Data Stored",
        newUser:existingUser,
        token,
      });
      
    }
    
    if(existingUser && existingUser?.todayOtpVerified===false){

      try{  
          const otpCode = await otpDigit(4);
          var transporter = nodemailer.createTransport({
            port: 587,
            host: "smtp.gmail.com",
            auth: {
              user: "sr.professor2772@gmail.com",
              pass: "zdotbnqkwymcmija"
            }
          });

          var mailOptions = {
            to: email,
            from: 'sr.professor2772@gmail.com',
            subject: 'VBAR Email Verification',
            text: `OTP CODE ${otpCode}`
          };

          let mailSent = await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              return res.json({status:'error',message:error.message});
            } else {
              console.log('Email sent: ' + info.response);
              return res.json({status:'success',message:'Email sent: ' + info.response});
            }
          }); 

          const updated = await db.query(`UPDATE users SET otpEmailCode='${otpCode}',otpEmailSentAt=NOW() WHERE id=${existingUser.id}`)
          return res.json({status:'verify',message:`You have already signup. Please verify your Email via OTP.`});

      }catch(err){ return res.json({status:'error',message:err.message});}
  




    }


   

    // const customer = await stripe.customers.create(
    //   {
    //     email,
    //   },
    //   { apiKey: process.env.STRIPE_API }
    // );
    // const existsUser = await User.findOne({ where: { email: email } });

    // if (existsUser) {
    //   return res.json({ message: "A user with that email already exists!" });
    // }
    let showbar=true;
    let todayOtpVerified=false;
    const newUser = await qrCode.createUser({
      email,
      name,
      identity,
      interest,
      age,
      favDrink,
      favSong,
      hobbies,
      petPeeve,
      relationPreference,
      fcmToken,
      showbar,
      todayOtpVerified
    });
    const token = jwt.sign({ id: newUser.id }, "pd_JWTSecret_123");
    console.log('jwt_token stored in db. token=====>',token)
    const updated = await db.query(`UPDATE users SET jwt_token='${token}' ,showbar='1' WHERE id=${newUser.id}`)
    res.status(200).json({
      msg: "User Data Stored",
      newUser,
      token,
    });
  } catch (error) {
    error.statusCode = 403;
    // throw error.message;
    console.log(error);
    return res.status(500).json({ error: "Something went wrong on our side" });
  }
};





exports.getUser = async (req, res, next) => {
  
  const userId = req.params.userId;
  try {
  
    let user = await User.findByPk(userId, { include: Picture });
    
    //let user2 = await db.query(`SELECT * FROM users where id='${userId}'`,{ type: QueryTypes.SELECT })

    if (!user) {
      return res.status(404).json({ msg: "No User Found" });
    }

    const todayDate = moment().format('YYYY-MM-DD')

    const paidForUserData = await userPaidFor.findAll({
      attributes:['paidForUser'],
      where:{userId:userId,paidAt:todayDate}
    });
  
    const paidUserIds = paidForUserData.map(row=>row.paidForUser)
    console.log({ msg: "user Fetched",paidUserIds,user, customerId: user.stripeCustomerId });
    return res.json({ msg: "user Fetched",paidUserIds,user, customerId: user.stripeCustomerId });
  
  } catch (error) {
    error.statusCode = 403;
    // throw error.message;
    return res.status(500).json({ error: "Something went wrong on our side" });
  }

};




exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const {
    name,
    identity,
    interest,
    age,
    favDrink,
    favSong,
    hobbies,
    petPeeve,
    relationPreference,
  } = req.body;

  try {
    const fetchUser = await User.findOne({ where: { id: userId } });
    if (!fetchUser) {
      const error = new Error("No User found!");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }
    const singleUser = await fetchUser.update({
      name,
      identity,
      interest,
      age,
      favDrink,
      favSong,
      hobbies,
      petPeeve,
      relationPreference,
    });
    res.json({ msg: "User Updated", singleUser });
  } catch (error) {
    error.statusCode = 403;
    // throw error.message;
    return res.status(500).json({ error: "Something went wrong on our side" });
  }
};




exports.getAllUsers = async (req, res, next) => {
  const qrId = req.params.qrId;
  try {
    if (!qrId) {
      const error = new Error(
        "No such QR or QRcode may be not scanned correctly "
      );
      error.statusCode = 404;
      // throw error.message;
      return res.status(404).json({ error: error.message });
    }
    const allUsers = await User.findAll(
      { where: { qrCodeId: qrId } },
      { include: Picture }
    );
    if (!allUsers) {
      const error = new Error("No users in this Bar at the moment");
      error.statusCode = 403;
      // throw error.message;
      return res.status(403).json({ error: error.message });
    }
    res.status(200).json({ msg: "all users", allUsers });
  } catch (error) {
    error.statusCode = 403;
    // throw error.message;
    return res.status(500).json({ error: "Something went wrong on our side" });
  }
};

exports.uploadSelfie = async (req, res) => {
 
  console.log('uploadSelfie function called')

  try{
    
    console.log('try uploadSelfie function called')


    let {file,userId} = req;

    if(!file){
      return res.status(400).json({msg:`Please Provide your image`});
    }    

    if(file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg"){
      return res.status(422).json({error:"Image must be in jpeg OR png format"});
    }

    const user = await User.findByPk(userId);
    if(!user){ return res.status(400).json({ error: "No User found" });}


    const buffer = await sharp(file.path).resize(400).toBuffer();
    const result = await  uploadImageBufferData(file.originalname,buffer);
    if(!result || !result.Location){return res.status(500).json({msg:`Couldn'n image upload.`})}

    console.log('imageUrl => result.Location====>', result.Location)
    const imageUrlUpdDb = await db.query(`UPDATE users SET imageUrl='${result.Location}' where id='${userId}'`)
    console.log(`update imageUrl in user clumn  imageUrlUpdDb===>`, result.Location)

    const image = await user.createPicture({ imageUrl: result.Location });

    const job = schedule.scheduleJob("0 5 * * *", async function () {
      const currPic = image.id;
      const deletedPic = await Picture.destroy({
        where: { id: currPic, userId: user.id },
      });
      console.log(`${deletedPic} Pic Deleted: with id: -> ${currPic}`);
      schedule.gracefulShutdown();
    });
    console.log("ressssssssssssss ------------->", req.userId);

    return res.status(200).json({ msg: "Image uploaded",imageUrl:result.Location,image,result  });
    

  }catch(err){ return res.status(500).json({error:err.message}); }


  // console.log(new Date().toLocaleString(),`uploadSelfie func called...`);

  // const file = req.file;
  // console.log(new Date().toLocaleString(),`req.file====>`,file);

  // // const userId = req.params.userId;
  // try {
  //   if (!file) {
  //     console.log(new Date().toLocaleString(),`!file condition=1 ====>`,file);

  //     console.log(new Date().toLocaleString(),`res.status(400).json ====>`,{
  //       msg: "Please Provide your image",
  //     });
      
  //     return res.status(400).json({
  //       msg: "Please Provide your image",
  //     });
  //   }

  //   if (
  //     file.mimetype !== "image/png" &&
  //     file.mimetype !== "image/jpg" &&
  //     file.mimetype !== "image/jpeg"
  //   ) {

  //     console.log(new Date().toLocaleString(),`res statsu=422 json=`,{ error: "Image must be in jpeg OR png format" });
  //     return res
  //       .status(422)
  //       .json({ error: "Image must be in jpeg OR png format" });
  //   }

  //   const result = await uploadSelfie(file);

  //   const user = await User.findByPk(req.userId);
  //   if (!user) {
  //     console.log(new Date().toLocaleString(),`User.findByPk(req.userId)=`,{ error: "No User found" });
  //     res.status(400).json({ error: "No User found" });
  //   }

  //   const image = await user.createPicture({
  //     imageUrl: result.Location,
  //   });

  //   console.log(new Date().toLocaleString(),`user.createPicture = `,image);

  //   const job = schedule.scheduleJob("0 5 * * *", async function () {
  //     const currPic = image.id;
  //     const deletedPic = await Picture.destroy({
  //       where: { id: currPic, userId: user.id },
  //     });
  //     console.log(`${deletedPic} Pic Deleted: with id: -> ${currPic}`);
  //     schedule.gracefulShutdown();
  //   });
  //   console.log("ressssssssssssss ------------->", req.userId);

  //   res.status(200).json({ msg: "Image uploaded", result, image });
  //   console.log(new Date().toLocaleString(),`res.status(200).json=`,{ msg: "Image uploaded", result, image });
  // } catch (error) {
  //   error.statusCode = 403;
  //   // throw error.message;
  //   console.log(new Date().toLocaleString(),`res.status(500).json=`,{error:"Something went wrong on our side" });
  //   return res.status(500).json({ error: "Something went wrong on our side" });
  // }
};


exports.updateSelfie = async (req, res) => {
  const file = req.file;
  try {
    if (!file) {
      return res.json({
        msg: "Please Provide your image (must be in jpeg/jpg/png format) ",
      });
    }
    const result = await uploadSelfie(file);
    const findImage = await Picture.findOne({ where: { userId: req.userId } });
    const image = await findImage.update(
      {
        imageUrl: result.Location,
        // userId: userId,
      },
      { where: { id: req.userId } }
    );
    res.status(200).json({ msg: "Image updated", result, image });
  } catch (error) {
    error.statusCode = 403;
    // throw error.message;
    return res.status(500).json({ error: "Something went wrong on our side" });
  }
};



//Mohsin Code..
exports.addUserToLocation = async (req, res, next) => {

  try {

    //return res.json("addUserToLocation");
    //testing 
    //req.userId=3

    const {locationId} = req.params;
    if(!req.userId){return res.status(400).json({status:`failed`,message:`userId is required.`});}  
    if(!locationId){return res.status(400).json({status:`failed`,message:`locationId is required.`});}  
    
    const newLocation = await Location.findOne({ where: { id: locationId }, });
    if(!newLocation){return res.status(400).json({status:`failed`,message:"No Such Location" });}  
  
    const userLocDel1 = await db.query(`DELETE FROM location_user WHERE user_id=${req.userId}`)
    const userLocDel2 =  await db.query(`DELETE FROM location_user WHERE user_id=${req.userId} AND location_id=${locationId}`)
    const userLocInsert =  await db.query(`INSERT INTO location_user SET user_id=${req.userId} , location_id=${locationId}`)

    return res.json({ msg: "Location updated", newLocation });
    
  }catch (err) {return res.status(500).json({status:`error`,message:err.message});}
  
};


// exports.addUserToLocation = async (req, res, next) => {
//   try {
//     if (!req.body.locationId) {
//       return res.json({ error: "Location Cannot be Empty" });
//     }
//     const user = await User.findByPk(req.userId);

//     if (!user) {
//       return res.status(404).json({ msg: "No User with that id exists" });
//     }

//     const location = await Location.findOne({
//       where: { id: req.body.locationId },
//     });
//     const getLocation = await location.addUser(user);

//     res.json({
//       msg: `Added user to Location ${location.location}`,
//       location: location.location,
//     });
//   } catch (error) {
//     error.statusCode = 403;
//     // throw error.message;
//     return res.status(500).json({ error: "Something went wrong on our side" });
//   }
// };



//Mohsin Code
exports.updateUserLocation = async (req, res, next) => {

  try {

    //return res.json("updateUserLocation");
    //testing 
    //req.userId=3
    console.log(`updateUserLocation API Request req.params===>`,req.params);

    const {locationId} = req.params;
    if(!req.userId){return res.status(400).json({status:`failed`,message:`userId is required.`});}  
    if(!locationId){return res.status(400).json({status:`failed`,message:`locationId is required.`});}  
    
    const newLocation = await Location.findOne({ where: { id: locationId }, });
    if(!newLocation){return res.status(400).json({status:`failed`,message:"No Such Location" });}  
  
    const userLocDel1 = await db.query(`DELETE FROM location_user WHERE user_id=${req.userId}`)
    const userLocDel2 =  await db.query(`DELETE FROM location_user WHERE user_id=${req.userId} AND location_id=${locationId}`)
    const userLocInsert =  await db.query(`INSERT INTO location_user SET user_id=${req.userId} , location_id=${locationId}`)

    console.log(`updateUserLocation API Response===>`,{ msg: "Location updated", newLocation });
    
    return res.json({ msg: "Location updated", newLocation });
    
  }catch (err) {return res.status(500).json({status:`error`,message:err.message});}

};

//Previous Dev Code
// exports.updateUserLocation = async (req, res, next) => {
//   // const userId = req.params.userId;
//   const locationId = req.params.locationId;
//   try {
//     if (!req.userId) {
//       return res.status(404).json({ msg: "No User with that id exists" });
//     }

//     const user = await User.findByPk(req.userId);
//     if (!user) {
//       res.status(400).json({ error: "No User found" });
//     }

//     const location = await Location.findOne({
//       where: { id: locationId },
//     });

//     if (!location) {
//       return res.status(404).json({ error: "No Such Location" });
//     }

//     const newLocation = await user.setLocations(location);
//     res.json({ msg: "Location updated", newLocation });
//   } catch (error) {
//     error.statusCode = 403;
//     // throw error.message;
//     return res.status(500).json({ error: "Something went wrong on our side" });
//   }
// };


//Mohsin Code..
exports.getLocationUser = async (req, res, next) => {
  try {
    //testing 
    //req.userId=3
    console.log(`getLocationUser API Request req.params===>`,req.params);
    const {qrId,locationId} = req.params;
    if(!req.userId){return res.status(400).json({status:`failed`,message:`userId is required.`});}  
    if(!locationId){return res.status(400).json({status:`failed`,message:`locationId is required.`});}  

    const location = await db.query(`SELECT id,location as name,qrCodeId FROM locations WHERE id=${locationId}`,{ type: QueryTypes.SELECT })
    
    if(!location[0] || !location[0].id){return res.status(400).res({status:`status`,message:`location not found.`});}
    
    let resData={id:locationId,qrCodeId:1,location:location[0].name,msg:`users for id: ${locationId} fetched`,users:{}};
    
    resData.users.users = await db.query(`SELECT id,name,identity,interest,age,relationPreference,favDrink,favSong,hobbies,petPeeve,oneTimePaid,stripeSubscribed,user_status,qrCodeId,imageUrl FROM users WHERE showbar='1' AND id IN (SELECT user_id FROM location_user WHERE location_id=${locationId})`,{ type: QueryTypes.SELECT })
    //node js develoeper comment by me
    // resData.users.users = await db.query(`SELECT id,name,identity,interest,age,relationPreference,favDrink,favSong,hobbies,petPeeve,oneTimePaid,stripeSubscribed,user_status,qrCodeId,imageUrl FROM users WHERE id!='${req.userId}' AND showbar='1' AND id IN (SELECT user_id FROM location_user WHERE location_id=${locationId}) `,{ type: QueryTypes.SELECT })
    
    
    //resData.users.users = await db.query(`SELECT id,name,identity,interest,age,relationPreference,favDrink,favSong,hobbies,petPeeve,oneTimePaid,stripeSubscribed,user_status,qrCodeId ,(SELECT imageUrl FROM pictures WHERE pictures.userId=users.id LIMIT 1) AS imageUrl FROM users WHERE id!='${req.userId}' AND id IN (SELECT user_id FROM location_user WHERE location_id=${locationId}) `,{ type: QueryTypes.SELECT })
    console.log(`getLocationUser API Response resData===>`,resData);
    console.log(`getLocationUser API Response resData.users.users)===>`,resData.users.users);
    return res.json(resData);

  }catch (err) {return res.status(500).json({status:`error`,message:err.message});}
  
};


//Misbah Code.
// exports.getLocationUser = async (req, res, next) => {
//   //return res.json('getLocationUser');
//   const locationId = req.params.locationId;
//   const qrId = req.params.qrId;

//   try {
//     if (!locationId) {
//       const error = new Error("No Such location");
//       error.statusCode = 403;
//       // throw error.message;
//       return res.status(404).json({ error: error.message });
//     }
//     const users = await Location.findByPk(locationId, {
//       include: [
//         {
//           model: User,
//           all: true,
//           nested: true,
//         },

//         // { where: { qrCodeId: qrId } },
//       ],
//     });
//     if (users.dataValues.users.length === 0) {
//       return res.status(404).json({ msg: "No Users in this location" });
//     }
//     console.log(users.dataValues.users[0]);
//     res.json({ msg: `users for id: ${locationId} fetched`,countUsers:users.users.length,users });
//   } catch (error) {
//     error.statusCode = 403;
//     // throw error.message;
//     console.log(error);
//     return res.status(500).json({ error: "Something went wrong on our side" });
//   }
// };
