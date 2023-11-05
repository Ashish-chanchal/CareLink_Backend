const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoctorSchema = new Schema({
   name:{
      type : String,
      required : true
   },
   email:{
      type:String,
      required : true,
   },
   phoneno:{
      type : String,
      required : true
   },
   doctorof:{
      type : String,
      required : true
   },
   schedule:{
      type : String,
      required : true
   }

});
const Doctor = mongoose.model('doctor',DoctorSchema);
module.exports = Doctor
