const express = require('express')
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser')
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");
//Rout1 get all the notes
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try{
    const notes =  await Note.find({user : req.user.id})
    res.json(notes)}
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal server error")
     }
})
//add notes by post request
router.post('/addnote',fetchuser,[
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Enter a valid name").isLength({ min:5 }),
    
], async (req,res)=>{
    try {
        const {title, description,tag}=req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title,description,tag,user:req.user.id
        })
       const saveNote= await note.save();
        res.json(saveNote)
    } catch(err){
        console.error(err.message);
        res.status(500).send("Internal server error")
     }

})
// update and existing notes
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    try {
        const {title, description,tag}=req.body;
        const newNote = {};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
       // find
       let note = await Note.findById(req.params.id);
       if(!note){return res.status(404).send("Not found")}

       if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
       }
       note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note)
    } catch(err){
        console.error(err.message);
        res.status(500).send("Internal server error")
     }

})
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
    try {
        const {title, description,tag}=req.body;
        const newNote = {};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
       // find
       let note = await Note.findById(req.params.id);
       if(!note){return res.status(404).send("Not found")}

       if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
       }
       note = await Note.findByIdAndDelete(req.params.id,{$set:newNote},{new:true})
        res.json({"Success":"Note has been deleted",note:note})
    } catch(err){
        console.error(err.message);
        res.status(500).send("Internal server error")
     }

})
module.exports=router