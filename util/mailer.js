var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     port: process.env.MAIL_PORT,
//     host: process.env.MAIL_HOST,
//     auth: {
//       user: process.env.MAIL_USERNAME,
//       pass: process.env.MAIL_PASSWORD
//     }
// });

// var transporter = nodemailer.createTransport({
//     port: 465,
//     host: "mail.webappcart.com",
//     auth: {
//       user: "juan@webappcart.com",
//       pass: "o4$rP~LAZJ;3"
//     }
// });

// var transporter = nodemailer.createTransport({
//     port: 587,
//     host: "mail.webappcart.com",
//     auth: {
//       user: "jesse@webappcart.com",
//       pass: "z~8@}nI&cYmw"
//     }
// });


exports.sendMail = async (mailOptions)=>{

    // return new Promise(async (resolve,reject)=>{    
            
    //     var transporter = nodemailer.createTransport({
    //         port: 587,
    //         host: "smtp.gmail.com",
    //         auth: {
    //         user: "sr.professor2772@gmail.com",
    //         pass: "zdotbnqkwymcmija"
    //         }
    //     });

    //     await transporter.sendMail(mailOptions,(error,info)=>{
    //         if (error) {
    //             reject(error);
    //         } else {
    //             resolve({message:'Email sent: ',info})
    //         }
    //     }); 
    // });

}