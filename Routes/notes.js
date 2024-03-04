import express from "express";
import { Notes } from "../models/notes.js";


const router = express.Router();

router.get("/all",async(req,res)=>{
    try {
        const notes = await Notes.find()
        if(!notes){
            return res.status(400).json({message:"Could not found any info"})
        }
        return res.status(200).json({message:"Sucessfully got your data", data:notes})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal sever error"})
        
    }
})
router.get("/user",async(req,res)=>{
    try {
        const notes = await Notes.find({user: req.user._id}).populate("user", "name email")
        if(!notes){
            return res.status(400).json({message:"Could not found any info"})
        }
        return res.status(200).json({message:"Sucessfully got your data", data:notes})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal sever error"})
        
    }
})

router.post("/add",async(req,res)=>{
    try {
        //new date logic
        const postedDate = new Date().toJSON().slice(0,10)
        const notes = await new Notes(
            {
                ...req.body,
                date:postedDate,
                user: req.user._id
                }
                ).save()
                if(!notes){
                    return res.status(400).json({message:"error in saave notes"})
                }
                return res.status(200).json({message:"notes save sucessfully", data:notes})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal sever error"})
        
    }
})
router.put("/edit/:id", async (req, res) => {
    try {
        const updatedNotes = await Notes.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedNotes) {
            return res
                .status(400)
                .json({ message: "Error Occured" })
        }
        res.status(200).json({ message: "Sucessfully updated", data: updatedNotes })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const deletedNotes = await Notes.findByIdAndDelete({
            _id: req.params.id
        })
        if (!deletedNotes) {
            return res
                .status(400)
                .json({ message: "Error Occured" })
        }
        res.status(200).json({ message: "Sucessfully Deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})



export const notesRouter = router