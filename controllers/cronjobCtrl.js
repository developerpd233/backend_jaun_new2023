const User = require("../models/user");
const db = require(`../util/db`);



exports.dailyCST5am = async (req, res, next)=>{
    try{

        //const usersUpdate = await User.update({oneTimePaid:false},{where:{}}); 
        //console.log(`CronJob run expire one time paymnet effected users=${usersUpdate}`);
        console.log(`Onet Time Payment expiration for all userCronJob Running===> At`,new Date().toLocaleString());
        let jwt_showbar_upt =  await db.query(`UPDATE users SET jwt_token=NULL ,showbar='0' `)
        const updstring = 'all users jwt_token=null & showbar=0 at 5am daily update=='+JSON.stringify(jwt_showbar_upt);
        console.log(updstring);
        await db.query(`INSERT INTO logs (id ,log ,createdAt ,updatedAt) VALUES (NULL, '${updstring}', now(), now())`)
        return res.json('dailyCST5am run done.');
        
    }catch(err){ next(err); }
}
