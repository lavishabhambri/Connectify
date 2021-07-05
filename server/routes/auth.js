const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');  // For hashing the password
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin')

// If user wants to access the protected route then the user must be logged in and it is checked by middleware
// router.get('/protected', requireLogin, (req,res)=>{
//   res.send("Hello user");
// })

router.post('/signup',(req, res)=>{
  // Dereferencing
  const {name, email, password} = req.body;
  if(!name || !email || !password){
    return res.status(422).json({error: "Enter all the fields"})
  }
  User.findOne({email:email})
  .then((savedUser)=>{
    if(savedUser){
      return res.status(422).json({error:"User already exists with the email"})
    }
    bcrypt.hash(password, 12)
    .then(hashedpassword=>{
      const user = new User({
        email,
        password: hashedpassword,
        name
      })
      user.save()
      .then(user=>{
        res.json({message:"Saved successfully"})
      })
      .catch(err=>{
        console.log(err);
      })
    })

  })
  .catch(err=>{
    console.log(err);
  })
})

// Signin
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
               return res.json({message:"Successfully signed in"});
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})



module.exports = router;
