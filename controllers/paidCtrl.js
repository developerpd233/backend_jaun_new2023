
const moment = require("moment");
const { Op } = require("sequelize");
const userPaidFor = require("../models/userPaidFor")

exports.setUserPaidFor = async (req, res, next)=>{

    try{

        const {userId} = req;
        const {paidForUser} = req.body;
        const todayDate = moment().format('YYYY-MM-DD')
        if(!userId){ return res.status(400).json({status:'failed',message:'userId is required in jwt.'});}        
        if(!paidForUser){ return res.status(400).json({status:'failed',message:'paidForUser is required.'});}        

        
        const userPaidForCheck = await userPaidFor.findOne({
            where:{userId:userId,paidForUser:paidForUser,paidAt:todayDate}
        })

        if(userPaidForCheck){ return res.status(400).json({status:'failed',message:`Already paid for ${paidForUser}->user  at ${todayDate}`}); }

        
        const userPaid = await userPaidFor.create({
            userId:userId,
            paidForUser:paidForUser,
            paidAt:moment().format('YYYY-MM-DD')
        });
        
        return res.status(200).json({status:'success',message:`Successfully created paid history.`,userPaid});


    }catch(err){return res.status(500).json({status:'error',message:err.message});}


}