import express from "express";
import { User, generatejwtToken } from "../models/users.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../Controller/auth.js";



const router = express.Router();

//for signup
router.post("/signup", async(req,res,nex)=>{
try {
    //find user is already registred
    let user = await User.findOne({email:req.body.email})
    if(user) return res.status(400).json({message:"User already exits"})

    //generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPasword = await bcrypt.hash(req.body.password, salt)

    //update the password

     user = await new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPasword
    }).save()
    //sve the user
    

    //generate jwtToken

    const token = await generatejwtToken(user._id)
    return res.status(200).json({message:"sucessfully logged in", token})
    
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal sever error"})
    
}
})
//for login
router.post("/login",async(req,res)=>{
    try {
        //user is valid
        const user = await User.findOne({email:req.body.email})
        if(!user){
        return res.status(400).json({message:"Authentication failed"})
        }
        //password valid
        const password = await bcrypt.compare(req.body.password, user.password)
        if(!password){
            return res.status(400).json({message:"Authentication failed"})
        }
        //generte token
        const token = await generatejwtToken(user._id)
        return res.status(200).json({message:"logged in sucessfully", token})

        
    } catch (error) {
        console.log(error)
    return res.status(500).json({message:"Internal sever error"})
        
    }
})
// for logout
router.get("/logout", async (req, res) => {
    try {
        var deleteToken = req.headers["x-auth-token"];
        
        deleteToken=undefined;
        console.log(deleteToken)

        return res.status(200).json({data:"token deleted..!"})
        

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})


//reset link
router.post("/forgotpassword", async(req, res)=>{
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ Err: "please enter valid email" });

        }
        const matchedUser = await User.findOne({ email });
        if (!matchedUser) {
            return res.status(400).json({ Err: "user not found exists" });

        }
        const randomString =
            Math.random().toString(16).substring(2, 15) +
            Math.random().toString(16).substring(2, 15);


        matchedUser.token_reset_password = randomString;

        await User.findByIdAndUpdate(matchedUser.id, matchedUser);

         //sending email for resetting
         const resetUrl = `${req.protocol}://${req.get('host')}/url/reset-new-password/${randomString}`;
         console.log(resetUrl);
 
         const msg = `This one is reset url  ${resetUrl}`
         await sendEmail({
             email: User.email,
             subject: 'Reset link for verifiction of forgot password',
             msg: msg
 
         })
         return res.status(200).json({ data: "Mail send sucessfully",msg})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal sever error"})
    }
 
})

//update password
router.post("/reset-new-password/:token", async (req, res) => {
    try {
        const resetUrl = req.params.id;
        const { password } = req.body;
        const matchedUser = await User.findOne({ token_reset_password: resetUrl });
        if (matchedUser === null || matchedUser.token_reset_password === "") {
            return res
                .status(400)
                .json({ Err: "user not exists or reset link expired" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        matchedUser.password = hashedPassword;
        matchedUser.token_reset_password = `Password Updated on ${new Date()}`;


        await User.findByIdAndUpdate(matchedUser.id, matchedUser);
        return res.status(200).json({
            message: `${matchedUser.name} password has beed changed sucessfully`,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal sever error"})
    }
})

export const taskUserRouter = router;
