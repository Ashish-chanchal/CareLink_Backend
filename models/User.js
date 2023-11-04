const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
     usertype:{
        type : String,
        required : true
     },
     name:{
        type : String,
        required : true
     },
     email:{
        type:String,
        required : true,
        unique:true
     },
     password:{
        type:String,
        required : true,
     },
     confirmpassword:{
      type:String,
      required : false,
   },
});
const User =mongoose.model('user',UserSchema);
module.exports = User