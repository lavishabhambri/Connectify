const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const {MONGOURI} = require('./keys');
require('./models/user')

app.get('/', (req, res)=>{
  res.send("Hello world")
})

// Connect to DB
mongoose.connect(MONGOURI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
  console.log("Connected to mongoose");
})

mongoose.connection.on('error', (err)=>{
  console.log("Error connecting to mongoose ", err);
})


app.listen(PORT,()=>{
  console.log("server is running on port:", PORT);
})
