
require("dotenv").config();
const moment = require('moment');
const User = require("../models/user");


//import { Op } from "sequelize";
// const stripe = require('stripe')(process.env.STRIPE_API, {
//     apiVersion: '2020-08-27',
//     appInfo: { // For sample support and debugging, not required for production:
//       name: "stripe-samples/accept-a-payment/custom-payment-flow",
//       version: "0.0.2",
//       url: "https://github.com/stripe-samples"
//     }
// });



const stripe = require('stripe')(process.env.STRIPE_API);



exports.PaymentIntentsSuccess = async (req, res, next)=>{
    
    try{        
        //User 
        let user = await User.findByPk(req.userId);
        if(!user){return res.status(400).json({status:'failed',message:`User isn't exists.`});}
        user.oneTimePaid=true; user = await user.save();    
        return res.status(200).json({status:"success",user});       
    }catch(err){ next(err); }

}





exports.PaymentSheet = async (req, res, next)=>{
    
    try{

         // Use an existing Customer ID if this is a returning customer.
        const customer = await stripe.customers.create();
        
        const ephemeralKey = await stripe.ephemeralKeys.create(
           {customer: customer.id},
           {apiVersion: '2022-08-01'}
        );

        const paymentIntent = await stripe.paymentIntents.create({
        //New Amount 0.99 cent
        amount: 99, 
        //amount: 25 * 100, OLD PRIC $25
        currency: 'USD',
        customer: customer.id,
        automatic_payment_methods: { enabled:true},
        });
    
        res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        //publishableKey: 'pk_test_qblFNYngBkEdjEZ16jxxoWSM'
        });


    }catch(err){ next(err); }
}




exports.createPaymentIntent = async (req, res, next)=>{

    try{

        const {paymentMethodType,currency,paymentMethodOptions} = req.body;
        // Each payment method type has support for different currencies. In order to
        // support many payment method types and several currencies, this server
        // endpoint accepts both the payment method type and the currency as
        // parameters.
        //
        // Some example payment method types include `card`, `ideal`, and `alipay`.
        const params = {
            payment_method_types: [paymentMethodType],
            //amount: 5999,
            amount: 25 * 100, // Charging Rs 25
            currency: currency,
        }

        // If this is for an ACSS payment, we add payment_method_options to create
        // the Mandate.
        if(paymentMethodType === 'acss_debit') {
            params.payment_method_options = {
            acss_debit: {
                mandate_options: {
                payment_schedule: 'sporadic',
                transaction_type: 'personal',
                },
            },
            }
        } else if (paymentMethodType === 'konbini') {
            /**
             * Default value of the payment_method_options
             */
            params.payment_method_options = {
            konbini: {
                product_description: 'Tシャツ',
                expires_after_days: 3,
            },
            }
        } else if (paymentMethodType === 'customer_balance') {
            params.payment_method_data = {
            type: 'customer_balance',
            }
            params.confirm = true
            params.customer = req.body.customerId || await stripe.customers.create().then(data => data.id)
        }

        /**
         * If API given this data, we can overwride it
         */
        if (paymentMethodOptions) {
            params.payment_method_options = paymentMethodOptions
        }

        // Create a PaymentIntent with the amount, currency, and a payment method type.
        //
        // See the documentation [0] for the full list of supported parameters.
        //
        // [0] https://stripe.com/docs/api/payment_intents/create
        try {
            const paymentIntent = await stripe.paymentIntents.create(params);

            // Send publishable key and PaymentIntent details to client
            res.send({
            clientSecret: paymentIntent.client_secret,
            nextAction: paymentIntent.next_action,
            });
        } catch (e) {
            return res.status(400).send({
            error: {
                message: e.message,
            },
            });
        }

    
    }catch(err){next(err);}
    


}





exports.createCustomer = async (req, res, next)=>{

    try{
        //for test purpose
        //req.userId=342;

        const {name,email} = req.body;
        if(!name){return res.status(400).json({status:'error',message:`Name is required.`}); }
        if(!email){return res.status(400).json({status:'error',message:`Email is required.`}); }
        if(!req.userId){return res.status(400).json({status:'error',message:`userId is required via jwt.`}); }

        const user = await User.findOne({ where:{id:req.userId}})
        if(!user){return res.status(400).json({status:'error',message:`userId isn'n exist.`});}

        const customer = await stripe.customers.create({
            email: email,
            name: name,

            shipping: {
              address: {
                city: '',
                country: '',
                line1: '',
                postal_code: '',
                state: '',
              },
              name: name,
            },
            address: {
              city: '',
              country: '',
              line1: '',
              postal_code: '',
              state: '',
            },
          });

          if(!customer){return res.status(500).json({status:'error',message:`Couldn't customer create.`});}
          else
          {
            user.stripeCustomerId = customer.id; 
            await user.save();    
            return res.status(200).json({status:'success',message:'customer has been created.',customer,user});
          }

    }catch(err) { return res.status(400).json({ status:"error",message:err.message}); }

   
}





exports.createSubscriptions = async (req, res, next)=>{

  
    try {

        //for test purpose
        //req.userId=342;    
        //return res.json(req.userId);

        const {priceId,customerId} = req.body;
        //if(!priceId){return res.status(400).json({status:'error',message:`priceId is required.`}); }
        if(!customerId){return res.status(400).json({status:'error',message:`customerId is required.`}); }
        if(!req.userId){return res.status(400).json({status:'error',message:`userId is required via jwt.`}); }

        const user = await User.findOne({ where:{id:req.userId}})
        if(!user){return res.status(400).json({status:'error',message:`userId isn'n exist.`});}
        
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
            //price: priceId,
            price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });

        if(!subscription){ return res.status(400).json({status:'error',message:`userId isn'n exist.`}); }
        
        const startDate =  moment(new Date()).format("YYYY-MM-DD");
        const endDate = moment().add(30, 'days').format("YYYY-MM-DD");

        user.stripeSubscribed = true;
        user.stripeCustomerId = subscription.id;
        user.stripeSubsStartDate = startDate;
        user.stripeSubsEndDate = endDate; 
        await user.save();

        return res.status(200).json({
            status:`success`,user:user,
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });

    
    }catch(err) { return res.status(400).json({ status:"error",message:err.message}); }

    

}





exports.invoicePreview = async (req, res, next)=>{

    try {

        const {priceId,customerId,subscriptionId} = req.body;
        //if(!priceId){return res.status(400).json({status:'error',message:`priceId is required.`}); }
        if(!customerId){return res.status(400).json({status:'error',message:`customerId is required.`}); }
        if(!subscriptionId){return res.status(400).json({status:'error',message:`subscriptionId is required.`}); }

        const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
        );
    
        const invoice = await stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: req.query.subscriptionId,
        subscription_items: [ {
            id: subscription.items.data[0].id,
            //price: priceId,
            price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
        
        }],
        });

        res.status(200).send({ invoice });

    }catch(err) { return res.status(500).json({ status:"error",message:err.message}); }


}





exports.subscriptions = async (req, res, next)=>{

    try {

        const {customerId} = req.params;
        if(!customerId){return res.status(400).json({status:'error',message:`customerId is required.`}); }
      
        const subscriptions = await stripe.subscriptions.list({
            status: 'all',
            customer: customerId,
            expand: ['data.default_payment_method'],
        });

        return res.status(200).json({status:'success',subscriptions});
      
    }catch(err) { return res.status(500).json({ status:"error",message:err.message}); }


}




// exports.webhook = async (req, res, next)=>{

//     try {

//         // Retrieve the event by verifying the signature using the raw body and secret.
//         let event;

//         try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             req.header('Stripe-Signature'),
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//         } catch (err) {
//         console.log(err);
//         console.log(`⚠️  Webhook signature verification failed.`);
//         console.log(
//             `⚠️  Check the env file and enter the correct webhook secret.`
//         );
//         return res.sendStatus(400);
//         }

//         // Extract the object from the event.
//         const dataObject = event.data.object;

//         // Handle the event
//         // Review important events for Billing webhooks
//         // https://stripe.com/docs/billing/webhooks
//         // Remove comment to see the various objects sent for this sample
//         switch (event.type) {
//         case 'invoice.payment_succeeded':
//             if(dataObject['billing_reason'] == 'subscription_create') {
//             // The subscription automatically activates after successful payment
//             // Set the payment method used to pay the first invoice
//             // as the default payment method for that subscription
//             const subscription_id = dataObject['subscription']
//             const payment_intent_id = dataObject['payment_intent']

//             // Retrieve the payment intent used to pay the subscription
//             const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

//             try {
//                 const subscription = await stripe.subscriptions.update(
//                 subscription_id,
//                 {
//                     default_payment_method: payment_intent.payment_method,
//                 },
//                 );

//                 console.log("Default payment method set for subscription:" + payment_intent.payment_method);
//             } catch (err) {
//                 console.log(err);
//                 console.log(`⚠️  Falied to update the default payment method for subscription: ${subscription_id}`);
//             }
//             };

//             break;
//         case 'invoice.payment_failed':
//             // If the payment fails or the customer does not have a valid payment method,
//             //  an invoice.payment_failed event is sent, the subscription becomes past_due.
//             // Use this webhook to notify your user that their payment has
//             // failed and to retrieve new card details.
//             break;
//         case 'invoice.finalized':
//             // If you want to manually send out invoices to your customers
//             // or store them locally to reference to avoid hitting Stripe rate limits.
//             break;
//         case 'customer.subscription.deleted':
//             if (event.request != null) {
//             // handle a subscription cancelled by your request
//             // from above.
//             } else {
//             // handle subscription cancelled automatically based
//             // upon your subscription settings.
//             }
//             break;
//         case 'customer.subscription.trial_will_end':
//             // Send notification to your user that the trial will end
//             break;
//         default:
//         // Unexpected event type
//         }
//         res.sendStatus(200);
        
      
//     }catch(err) { return res.status(500).json({ status:"error",message:err.message}); }


// }