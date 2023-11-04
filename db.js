const mongoose = require('mongoose')
const mongoURI ="mongodb://127.0.0.1:27017/CareLink"

const connectToMongo  =  ()=>{
    mongoose.connect(mongoURI)
    console.log('connect to mongo Successfully')
}

module.exports =connectToMongo;