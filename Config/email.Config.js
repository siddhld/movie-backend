require('dotenv').config()
const nodemailer = require("nodemailer")


// send mail to the user to forget password reset
let transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT,
    secure : false, //true for 465 port
    auth:{
        user : process.env.EMAIL_USER, // Admin GAMIL ID
        pass :process.env.EMAIL_PASS // Admin Gmaoil Password
    }
})

module.exports =  transporter;