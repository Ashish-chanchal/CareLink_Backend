const express = require('express')
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser')
const User = require("../models/User");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const { body, validationResult } = require("express-validator");


// Set up the Multer storage engine
const storage = multer.diskStorage({
  destination: 'uploads/', // Define the directory to store uploaded files
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const extname = path.extname(file.originalname);
    const filename = Date.now() + extname;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// Define a route to create a user with a profile photo
router.post('/userupdate/:id', upload.single('profilePhoto'), async (req, res) => {
    const userId = req.params.id;

    const { usertype, name, email } = req.body;
    const user = await User.findOne({ _id: userId }, { password: 0 });
   
      user.usertype=usertype;
      user.name=name;
      user.email=email;
  
      try {
        await user.save();
       let user1 = await User.findByIdAndUpdate(userId,{$set:user},{new:true})
        res.json({ message: user1 });
      } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
      }
  });

//Rout1 get all the notes
router.get('/fetchusedata/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Find the user by _id in the database
      const user = await User.findOne({ _id: userId }, { password: 0 });
      if (user) {
        res.json(user); // Send the user data as JSON response
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data' });
    }
  });
//add notes by post request
router.post('/adddoctor',fetchuser,[
    body("name", "Enter a valid title").isLength({ min: 5 }),
    body("email", "Enter a vaild").isLength({ min:5 }),
    body("doctorof", "Enter a valid name").isLength({ min:5 }),
    body("email", "Enter a valid name").isLength({ min:5 }),
    
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
router.put('/updateprofile/:id',fetchuser, async (req,res)=>{
    try {
        const {title, description,tag}=req.body;
        const newdata = {};
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