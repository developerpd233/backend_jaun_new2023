const nodeCron = require("node-cron");
const User = require("../models/user");
const db = require(`../util/db`);


exports.dailyCST5am = nodeCron.schedule("0 5 * * *", async ()=> {
//exports.dailyCST5am = nodeCron.schedule("* * * * *", async ()=> {        
    //const usersUpdate = await User.update({oneTimePaid:false},{where:{}}); 
    //console.log(`CronJob run expire one time paymnet effected users=${usersUpdate}`);
    
    // console.log(`One Time Payment expiration for all userCronJob Running===> At`,new Date().toLocaleString());
    let jwt_showbar_upt =  await db.query(`UPDATE users SET jwt_token=NULL, showbar='0', todayOtpVerified='0' `)    
    const updstring = 'all users jwt_token=null & showbar=0 at 5am daily update=='+JSON.stringify(jwt_showbar_upt);
    // console.log(updstring);
    await db.query(`INSERT INTO logs (id ,log ,createdAt ,updatedAt) VALUES (NULL, '${updstring}', now(), now())`)


    // console.log(`chat_rooms table truncating start.....`);
    let chatroom_truncated =  await db.query(`TRUNCATE TABLE chat_rooms`)
    const updstring2 = 'chatroom chats has been cleared via truncated result==>'+JSON.stringify(chatroom_truncated);
    // console.log('updstring2======>',updstring2);
    await db.query(`INSERT INTO logs (id ,log ,createdAt ,updatedAt) VALUES (NULL, '${updstring2}', now(), now())`)



},{scheduled: true,timezone: "America/Los_Angeles"});
//},{scheduled: true,timezone: "Asia/Karachi"});
