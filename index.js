const connectToMongo = require('./db.js');
const express = require('express')
var cors = require('cors')

connectToMongo();
var app = express()
app.use(cors())
const port = 5000;

app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/doctors',require('./routes/userdata.js'))

app.listen(port, () => {
  console.log(`CareLInk Backend listening at http://localhost:${port}`)
})