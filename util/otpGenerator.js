const otpGenerator = require('otp-generator')

exports.otpDigit = async  (length)=>{
    
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    
    return OTP;
    //return otpGenerator.generate(length,{ alphabets: false, upperCase: false, specialChar: false });

}