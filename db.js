import mongoose from "mongoose";


export function dbConnection(){
    const params = {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
    try{
        mongoose.connect("mongodb+srv://vijipriya:vijipriya123@cluster0.w5ylrtc.mongodb.net/url", params)
        console.log("Database coonected sucessfully..!")

    }
    catch(error){
        console.log("Error connecting DB...",error)
    }
}