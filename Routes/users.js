import express from "express";
import { User, generatejwtToken } from "../models/users.js";
import bcrypt from "bcrypt";



const router = express.Router();

router.post("/signup", async(req,res,nex)=>{
try {
    //find user is already registred
    const user = await User.findOne({email:req.body.email})
    if(user) return res.status(400).json({message:"user already exits"})

    //generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPasword = await bcrypt.hash(req.body.password, salt)

    //update the password

     user = await new User({
        name:req.body.name,
        email:req.body.email,
        contact:req.body.contact,
        password:hashedPasword
    }).save()

    //generate jwtToken

    const token = await generatejwtToken(user._id)
    return res.status(201).json({message:"sucessfully logged in", token})
    
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal sever error"})
    
}
})

router.post("/login",async(req,res)=>{
    try {
        //user is valid
        const user = await User.findOne({email:req.body.email})
        if(!user){
        return res.status(400).json({message:"Invalid user.."})
        }
        //password valid
        const password = await bcrypt.compare(req.body.password, user.password)
        if(!password){
            return res.status(400).json({message:"Invalid password.."})
        }
        //generte token
        const token = await generatejwtToken(user._id)
        return res.status(200).json({message:"logged in sucessfully", token})

        
    } catch (error) {
        console.log(error)
    return res.status(500).json({message:"Internal sever error"})
        
    }
})

export const userRouter = router;
