const express= require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/userModel");
const {generateAccessToken}=require("../utils/tokenutils");
const {generateRefreshToken}=require("../utils/tokenutils");
const {verifyRefreshToken}=require("../utils/tokenutils")

router.post("/register", async (req,res)=>{
  try {
    const { firstName, lastName, email, password , isAdmin } = req.body;
    const user = new User( {firstName,lastName,email,password,isAdmin} );
    await user.save();
    res.status(200).send({ message: "User registered" });
  } 
  catch(e) {
    res.status(500).send(e);
  }
});

router.post("/login", async (req,res)=>{

  const { email, password } = req.body;
  const user = await User.findOne( { email } );
  const password1 = await bcrypt.compare(password,user.password);

  if(user && password1) {
    const accessToken= generateAccessToken(user);
    const refreshToken=generateRefreshToken(user);
    res.json({accessToken,refreshToken});
  }
  else return res.status(400).send("User not found")
});


router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const decodedToken = verifyRefreshToken(refreshToken);
  if (decodedToken) {
    const user = await User.findById(decodedToken.id);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({accessToken,refreshToken});
  }
});

module.exports=router;