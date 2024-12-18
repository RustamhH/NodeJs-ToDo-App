const User = require('../models/userModel');

const isAdmin = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user);
        if(!user) return res.sendStatus(404); 

        if(!user.isAdmin) return res.sendStatus(403); 

        next();
    }
    catch(e) {
        res.sendStatus(500);
    }
}
module.exports={isAdmin};