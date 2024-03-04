import mongoose from "mongoose";


const {ObjectId} = mongoose.Schema
const notesSchema = new mongoose.Schema(
    {
        companyName:{
            type:String,
            required:true
        },
        package:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        position:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        skill:{
            type:String,
            required:true
        },
        qualification:{
            type:String,
            required:true
        },
        user:{
            type:{ObjectId},
            ref:"user"
        }
    }
)

const Notes = mongoose.model("notes",notesSchema)
export {Notes}