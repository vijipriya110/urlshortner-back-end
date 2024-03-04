import mongoose from "mongoose"
import  jwt  from "jsonwebtoken";
//Schema for user contents
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password: {
        type: String,
        required: true
    },
    account_activated:{
        type:Boolean,
        default:false
    },
    token_activate_account:{
        type:String
    },
    token_reset_password:{
        type:String
    },
    urlshortener:{
        
    }
})

const generatejwtToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}

const User = mongoose.model("user",userSchema)
export {User, generatejwtToken}