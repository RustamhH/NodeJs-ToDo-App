const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET  = process.env.ACCESS_TOKEN_SECRET;

async function authenticateAccessToken(req,res,next){
  const authHeader=req.headers["authorization"];

  const token= authHeader && authHeader.split(" ")[1];
  
  console.log(token)
  
  if(!token) return res.sendStatus(405);


  jwt.verify(token,ACCESS_TOKEN_SECRET,(err,user)=>{
      if(err) return res.sendStatus(403);

      res.locals.user=user;
      req.user=user.id;
      next();
  });
}





module.exports = { authenticateAccessToken };