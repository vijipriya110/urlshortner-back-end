import mongoose from "mongoose"
import  jwt  from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    contact:{
        type:Number
    },
    password:{
        type:String,
        required:true
    }
})

const generatejwtToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY)
}

const User = mongoose.model("user",userSchema)
export {User, generatejwtToken}