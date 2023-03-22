const log = require("../models/log")


exports.store = async (req,res,next)=>{    
    try{

        const {logText} = req.body;
        if(!logText){return res.status(200).json({status:'failed',message:`logText field is required.`});}
        const _log = await log.create({log:logText})
        return res.json({status:`success`,logData:_log});

    }catch(err){ return res.json({status:'error',message:err.message});}
}