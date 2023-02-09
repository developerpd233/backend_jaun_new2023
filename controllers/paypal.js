const moment = require('moment');
const braintree = require("braintree");
const User = require("../models/user");

// const gateway = new braintree.BraintreeGateway({
//     environment: braintree.Environment.Sandbox,
//     merchantId: "bgsnk4hg5chxsj5s",
//     publicKey: "6r4tnrxc5wb2xxjf",
//     privateKey: "6cfef1fed111d704c0477f2d0be669cf"
// });

const planId="9vc2";
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "sz79ghp72c8thv9q",
    publicKey: "kw7y7n6rr3vwdvc9",
    privateKey: "ddfbb9e87f2cebac777163e231d35cf1"
});

exports.clientToken = async (req, res, next)=>{
    try{
      gateway.clientToken.generate({}).then(response => {
        const {clientToken} = response;
        console.log('host/client_token api called generate clientToken===>',clientToken)
        return clientToken ? res.status(200).json({status:'success',clientToken}) : res.status(500).json({status:'error',message:`clientToken isn't found.`})
      });
    }catch(err){next(err)}
}



exports.checkout = async (req, res, next)=>{
    try{

        const {nonceFromTheClient,deviceDataFromTheClient}  = req?.body;
        if(!nonceFromTheClient){return res.status(400).json({status:`failed`,message:`nonceFromTheClient is required.`});}
        if(!deviceDataFromTheClient){return res.status(400).json({status:`failed`,message:`deviceDataFromTheClient is required.`});}
         
        console.log('nonceFromTheClient===>',nonceFromTheClient,'\n','deviceDataFromTheClient===>',deviceDataFromTheClient);
         if(!nonceFromTheClient){return res.status(400).json({status:`failed`,message:`payment_method_nonce not found.`});}  
         console.log('nonceFromTheClient===>',nonceFromTheClient)
         gateway.transaction.sale({
          amount: "0.99",
          paymentMethodNonce: nonceFromTheClient,
          deviceData: deviceDataFromTheClient,
          options: {
            submitForSettlement: true
          }
        }, (err, result) => {
          console.log('err===========>',err,'\n','result=========>',result)
          return !err ? res.status(200).json({status:`success`,result}) : res.status(500).json({status:`error`,message:err.message,err});
        });
  
     }catch(err){next(err);}
    
};
  

exports.subscriptionCustomerToken = async (req,res,next)=>{
    
  try{

      const {name,email}  = req?.body;
      if(!name){return res.status(400).json({status:`failed`,message:`name is required.`});}
      if(!email){return res.status(400).json({status:`failed`,message:`email is required.`});}

      gateway.customer.create({firstName:name,lastName:name,email:email},(customerErr,customerData)=>{

        if(customerErr || !customerData || !customerData?.customer?.globalId){
          let errRes={status:`error`,message:`Couldn't create customer.`,customerErr,customerData}; 
          console.log('errRes',errRes); return res.status(500).json(errRes);  
        }
        

        gateway.clientToken.generate({customerId:customerData?.customer?.globalId},(clientTokenErr,clientTokenRes) =>{
          
          if(clientTokenErr || !clientTokenRes || !clientTokenRes?.clientToken){
            let errRes={status:`error`,message:`Couldn't create clientToken.`,clientTokenErr,clientTokenRes}; 
            console.log('errRes=====>',errRes); return res.status(500).json(errRes);
          }

          let successRes={status:`success`,customerId:customerData?.customer?.globalId,clientToken:clientTokenRes?.clientToken};
          console.log('successRes=================================',successRes); return res.status(200).json(successRes);
      
        });


          
      });


      // gateway.subscription.create({ 
      //   planId:"9vc2",
      //   paymentMethodToken:"tokencc_bh_gz2ypn_yf83mg_tsb2y4_x6p5m3_2qz",
      // },(error, result)=>{
      //   console.log(`error=======>`,error,`result======>`,result)
      //   return !error ? res.status(200).json({result}) : res.status(500).json({error});
      // });

      // gateway.clientToken.generate({
      //   customerId:"Y3VzdG9tZXJfNTg0MDI2ODY3"
      // }, (err, response) => {
      //   // pass clientToken to your front-end
      //   console.log('err',err)
      //   const clientToken = response.clientToken
      //   console.log('clientToken=====>',clientToken)
      //   return res.json({clientToken});
      
      // });


      // gateway.customer.find("Y3VzdG9tZXJfNTg0MDI2ODY3").then(customer => {
      //   //customer.paymentMethods; // array of PaymentMethod objects
      //   console.log('customer',customer);
      //   return res.json({customer});

      // });


      // gateway.customer.create({
      //   firstName: "Charity",
      //   lastName: "Smith",
      // }, (err, result) => {

      //   console.log('result===>',result ,'err===>',err)
      //   return res.json({err, result});
        
      // });

   



          // gateway.paymentMethod.create({
          //   paymentMethodNonce:`tokencc_bc_s8jjm2_yr9b4x_k9yffp_9xnmtb_863`
          //   }, (error,result) => {

          //     console.log('error', error);
          //     console.log('result',result)
          //     return res.json({result});
              
          //   });



      // const {nonceFromTheClient}  = req?.body;
      // if(!nonceFromTheClient){return res.status(400).json({status:`failed`,message:`nonceFromTheClient is required.`});}

      // gateway.customer.create({
      //   firstName: "Test",
      //   lastName: "Test",
      // }, (cusErr,cusData) => {
        
      //   if(cusErr || !cusData || !cusData?.customer?.id){ let cusRes={status:`error`,message:`coundn't create customer.`,error:cusErr}; console.log(cusRes); return res.status(500).json(cusRes);}

      //      console.log('cusData?.customer?.id====>', cusData?.customer?.id)
      //       gateway.paymentMethod.create({
      //       customerId: cusData?.customer?.id,
      //       paymentMethodNonce: nonceFromTheClient
      //       }, (error,result) => {

      //         //if(error || !paymentMethod || !paymentMethod?.customer?.id){ let resobj={status:`error`,message:`coundn't create paymentMethod.`,error}; console.log(resobj); return res.status(500).json(resobj);}
      //         console.log('error', error);

      //         console.log('result',result)
      //         return res.json({result});
              
      //       });

      
      // });


      // gateway.paymentMethod.create({
      //   customerId:"Y3VzdG9tZXJfNTg0MDI2ODY3",
      //   paymentMethodNonce:"f4936c4b-b2a6-0fe2-c1da-49c200660c87",
      // }, (error, result) => {

      //   console.log(`error=======>`,error,`result======>`,result)
      //   return !error ? res.status(200).json({result}) : res.status(500).json({error});

      // });

      // gateway.subscription.create({ 
      //   planId:"9vc2",
      //   paymentMethodToken:"cGF5bWVudG1ldGhvZF9jY19wOWdtdGU1eQ",
      // },(error, result)=>{
      //   console.log(`error=======>`,error,`result======>`,result)
      //   return !error ? res.status(200).json({result}) : res.status(500).json({error});
      // });

    }catch(err){ next(err); }

  }



  
  exports.subscriptionPaymentMethod = async (req,res,next)=>{

    try{

      const {customerId,paymentMethodNonce}  = req?.body;
      const user = await User.findByPk(req.userId);
      if(!user){return res.status(400).json({status:`failed`,message:`User not found.`});}
      if(!customerId){return res.status(400).json({status:`failed`,message:`customerId is required.`});}
      if(!paymentMethodNonce){return res.status(400).json({status:`failed`,message:`paymentMethodNonce is required.`});}

      gateway.paymentMethod.create({customerId:customerId,paymentMethodNonce:paymentMethodNonce,},(payMethErr,payMethData) => {

        if(payMethErr || !payMethData){
          let payMethErrRes={status:`error`,message:`Couldn't create paymentMethod.`,payMethErr,payMethData}
          console.log('payMethErrRes==========>',payMethErrRes); return res.status(500).json(payMethErrRes);
        }
      
        // console.log('payMethData====>',payMethData)
        // return res.json({payMethData});

         gateway.subscription.create({planId:planId,paymentMethodToken:payMethData?.paymentMethod?.graphQLId,},async (subscripErr,subscripData)=>{
      
          if(subscripErr || !subscripData){
            let subscripErrRes={status:`error`,message:`Couldn't create paymentMethod.`,payMethErr,payMethData}
            console.log('subscripErrRes==========>',subscripErrRes); return res.status(500).json(subscripErrRes);
          }
          
          const startDate =  moment(new Date()).format("YYYY-MM-DD");
          const endDate = moment().add(30, 'days').format("YYYY-MM-DD");
  
          user.stripeSubscribed = true;
          user.stripeCustomerId = customerId;
          user.stripeSubsStartDate = startDate;
          user.stripeSubsEndDate = endDate; 
          await user.save();
          let successRes={status:`success`,user,subscription:subscripData};
          console.log('successRes',successRes); return res.status(200).json(successRes);


        });

        


      });


      // gateway.customer.create({firstName:name,lastName:name,email:email},(customerErr,customerData)=>{

      //   if(customerErr || !customerData || !customerData?.customer?.globalId){
      //     let errRes={status:`error`,message:`Couldn't create customer.`,customerErr,customerData}; 
      //     console.log('errRes',errRes); return res.status(500).json(errRes);  
      //   }
        

      //   gateway.clientToken.generate({customerId:customerData?.customer?.globalId},(clientTokenErr,clientTokenRes) =>{
          
      //     if(clientTokenErr || !clientTokenRes || !clientTokenRes?.clientToken){
      //       let errRes={status:`error`,message:`Couldn't create clientToken.`,clientTokenErr,clientTokenRes}; 
      //       console.log('errRes=====>',errRes); return res.status(500).json(errRes);
      //     }

      //     let successRes={status:`success`,clientToken:clientTokenRes?.clientToken};
      //     console.log('successRes',successRes); return res.status(200).json(successRes);
      
      //   });


          
      // });


      // gateway.subscription.create({ 
      //   planId:"9vc2",
      //   paymentMethodToken:"tokencc_bh_gz2ypn_yf83mg_tsb2y4_x6p5m3_2qz",
      // },(error, result)=>{
      //   console.log(`error=======>`,error,`result======>`,result)
      //   return !error ? res.status(200).json({result}) : res.status(500).json({error});
      // });

      // gateway.clientToken.generate({
      //   customerId:"Y3VzdG9tZXJfNTg0MDI2ODY3"
      // }, (err, response) => {
      //   // pass clientToken to your front-end
      //   console.log('err',err)
      //   const clientToken = response.clientToken
      //   console.log('clientToken=====>',clientToken)
      //   return res.json({clientToken});
      
      // });


      // gateway.customer.find("Y3VzdG9tZXJfNTg0MDI2ODY3").then(customer => {
      //   //customer.paymentMethods; // array of PaymentMethod objects
      //   console.log('customer',customer);
      //   return res.json({customer});

      // });


      // gateway.customer.create({
      //   firstName: "Charity",
      //   lastName: "Smith",
      // }, (err, result) => {

      //   console.log('result===>',result ,'err===>',err)
      //   return res.json({err, result});
        
      // });

   



          // gateway.paymentMethod.create({
          //   paymentMethodNonce:`tokencc_bc_s8jjm2_yr9b4x_k9yffp_9xnmtb_863`
          //   }, (error,result) => {

          //     console.log('error', error);
          //     console.log('result',result)
          //     return res.json({result});
              
          //   });



      // const {nonceFromTheClient}  = req?.body;
      // if(!nonceFromTheClient){return res.status(400).json({status:`failed`,message:`nonceFromTheClient is required.`});}

      // gateway.customer.create({
      //   firstName: "Test",
      //   lastName: "Test",
      // }, (cusErr,cusData) => {
        
      //   if(cusErr || !cusData || !cusData?.customer?.id){ let cusRes={status:`error`,message:`coundn't create customer.`,error:cusErr}; console.log(cusRes); return res.status(500).json(cusRes);}

      //      console.log('cusData?.customer?.id====>', cusData?.customer?.id)
      //       gateway.paymentMethod.create({
      //       customerId: cusData?.customer?.id,
      //       paymentMethodNonce: nonceFromTheClient
      //       }, (error,result) => {

      //         //if(error || !paymentMethod || !paymentMethod?.customer?.id){ let resobj={status:`error`,message:`coundn't create paymentMethod.`,error}; console.log(resobj); return res.status(500).json(resobj);}
      //         console.log('error', error);

      //         console.log('result',result)
      //         return res.json({result});
              
      //       });

      
      // });


      // gateway.paymentMethod.create({
      //   customerId:"Y3VzdG9tZXJfNTg0MDI2ODY3",
      //   paymentMethodNonce:"f4936c4b-b2a6-0fe2-c1da-49c200660c87",
      // }, (error, result) => {

      //   console.log(`error=======>`,error,`result======>`,result)
      //   return !error ? res.status(200).json({result}) : res.status(500).json({error});

      // });

      // gateway.subscription.create({ 
      //   planId:"9vc2",
      //   paymentMethodToken:"cGF5bWVudG1ldGhvZF9jY19wOWdtdGU1eQ",
      // },(error, result)=>{
      //   console.log(`error=======>`,error,`result======>`,result)
      //   return !error ? res.status(200).json({result}) : res.status(500).json({error});
      // });

    }catch(err){ next(err); }

  }