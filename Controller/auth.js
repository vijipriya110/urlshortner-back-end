import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import nodemailer from "nodemailer";
 

const isAuthenticted = async(req,res,next) => {
    let token;
    if(req.headers){
    try {
        token = await req.headers["x-auth-token"];
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode)
        req.user = await User.findById(decode.id).select("_id name email")
        console.log(req.user)
        next()
        
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Invalid Authorization"})
         
    }
   
} 

}
 
export {isAuthenticted}

export const sendEmail = async (options) => {

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "502d54e8157a68",
        pass: "dc6c43d0f8af65"
      }
    });
  
    var mailOptions = {
      from: 'vijipriyatest@gmail.com',
      to: 'friend@yahoo.com',
      subject: options.subject,
      text: options.msg
    };
  
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  
  };


