
const User = require("../models/user");
const ChatRoom = require("../models/chatRoom");
const Picture = require("../models/picture");
const {Op} = require('sequelize');


exports.getContacts = async (req, res, next)=>{

    try{

        //stagging purpose
        //req.userId=30;
        
        const authUserId =  req.userId;
        const chatUserIds = await ChatRoom.findAll({
            attributes:['senderId','receiverId'],
            where: {
                 [Op.or]: [{senderId:authUserId}, {receiverId:authUserId}]
            },
        })   

        let senderIds  = chatUserIds.map(row=>row.senderId)
        let receiverIds  = chatUserIds.map(row=>row.receiverId)
        let bothIds = [...senderIds,...receiverIds];
        let uniqBothIds = [...new Set(bothIds)];
        uniqBothIds = uniqBothIds.filter(id=>id!=authUserId);

        //const authIndex = uniqBothIds.indexOf((authUserId))
        //return res.json({authIndex});

        //return res.json(uniqBothIds);
        
        let users =  await User.findAll({
            where: {
                id:uniqBothIds,
                //id:{ [Op.ne]:authUserId },
            },
            include: [
                {
                model:Picture,
                attributes:['imageUrl']
            }],
            distinct:true 
            //attributes:['id','name','identity','age','relationPreference','petPeeve','qrCodeId']
        });

        //users = users.map(row=>row.email);

        // users = users.filter(function(item, pos) {
        //     return users.indexOf(item) !== pos;
        // })

        // obj.arr = obj.arr.filter((value, index, self) =>
        //     index === self.findIndex((t) => (
        //     t.place === value.place && t.name === value.name
        // ))
        // )
        const unique=[];
        //users.map(x => users.filter(a => a.email == x.email).length > 0 ? null : unique.push(x));
        users.map(x => unique.filter(a => a?.email == x?.email).length > 0 ? null : unique.push(x));
        users = unique;
        console.log('unique', unique)
        return res.status(200).json({status:'success',countUser:users.length,users});

        
        
        //stagging purpose
        //req.userId=317
        
        // const senderId =  req.userId;
        // const receiverId =  req.userId;

        // const users =  await User.findAll({
        //     where: {
        //         [Op.or]: [{oneTimePaid: 1}, {stripeSubscribed: 1}]
        //     },
        //     include: [
        //         {
        //         model:Picture,
        //         attributes:['imageUrl']
        //     }],
        //     attributes:['id','name','identity','age','relationPreference','petPeeve','qrCodeId']
        // });
        // return res.status(200).json({status:'success',countUser:users.length,users});


        // const chatroomIDs = await ChatRoom.findAll({
        //     where:{
        //         senderId:[senderId,receiverId],
        //         receiverId:[receiverId,senderId]
        //     },
        //     attributes:['id','senderId','receiverId']
        // });
        
    }catch(err){next(err);}

}


exports.getHistory = async (req, res, next)=>{

    try{

        //for testing purpose..
        //req.userId=312;

        const receiverId =  req.userId;
        const senderId =  req.params.userId;
        
        const senderUser = await User.findOne({ where:{id:senderId} });
        if(!senderUser || !senderUser.id){res.json({status:'fails',message:`Sender user id isn't exixt.`});}
        else
        {
            let chatHistory = await ChatRoom.findAll({
                where:{
                    senderId:[senderId,receiverId],
                    receiverId:[receiverId,senderId]
                }
                // Add order conditions here....
                ,order: [
                    ['id', 'DESC'],
                ],
            })            

            for(let row of chatHistory){
                //row.dataValues.senderUser=await User.findByPk(parseInt(row.dataValues.senderId),{ attributes: ['id','name','email','imageUrl']});

                // row.dataValues.user=await User.findByPk(parseInt(senderId),{ attributes: ['id','name','email','imageUrl']});
                // row.dataValues.sender=await User.findByPk(parseInt(receiverId),{ attributes: ['id','name','email','imageUrl']});
                // row.dataValues.receiver=await User.findByPk(parseInt(senderId),{ attributes: ['id','name','email','imageUrl']});

                
                let user = await User.findByPk(parseInt(senderId),{ attributes: ['id','name','email','imageUrl']});
                let sender = await User.findByPk(parseInt(receiverId),{ attributes: ['id','name','email','imageUrl']});
                let receiver = await User.findByPk(parseInt(senderId),{ attributes: ['id','name','email','imageUrl']});

                //console.log('check Sender', row.dataValues.senderId===receiverId)
                if(row.dataValues.senderId===receiverId){

                    row.dataValues.name = receiver.dataValues.name;
                    row.dataValues.imageUrl = receiver.dataValues.imageUrl;
                }
                else
                {
                    row.dataValues.name = sender.dataValues.name;
                    row.dataValues.imageUrl = sender.dataValues.imageUrl;
                }

                row.dataValues.user = user;
                row.dataValues.sender = sender;
                row.dataValues.receiver = receiver;


            }
            //console.log('chatHistory===>', chatHistory)

            return res.json({status:'success',totalChat:chatHistory.length,chatHistory})
        
        }

    
    }catch(err){next(err);}
    
 


}