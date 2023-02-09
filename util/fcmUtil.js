
 var FCM = require('fcm-node');
 var fcm = new FCM(process.env.FCM_SERVER_KEY);
 const User = require("../models/user");

exports.sendNotify = async (toUser,fromUser,title,body)=>{

  console.log(`sendNotify func called params toUser=${toUser}, fromUser=${fromUser} ,title=${title},body=${body}`)  

  const _toUser = await User.findByPk(toUser);
  const _fromUser = await User.findByPk(fromUser);
  

  if(!_toUser && !_toUser?.fcmToken){ console.log(`user or fcmToken not exits. notfication will not send.`); return false; }    
    console.log('userFcmToken====>',_toUser?.fcmToken)
    var message = {
        to: _toUser.fcmToken, 
        //collapse_key: 'your_collapse_key',
        notification:{title:title,body:body},
        data: {  
            user: {id:_fromUser?.id,name:_fromUser?.name},
            //user: {id:_fromUser?.id,name:_fromUser?.name},
        }
    };

    console.log('notifi data message===>', message)
    fcm.send(message,(err, response)=>{
        if (err) {
            console.log("Something has gone wrong!",`err===========>${err}`); return false;
        } else {
            console.log("✨✨✨✨Successfully✨✨✨✨ sent with response: ", response); return response;
        }
    });


}