const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


const requestGuestUserToken = async(req, res , next)=>{
     try{
        // Retrieving user from authentication request
        const user = await User.find(req.user.id);

        if(!user){
            // Generate generate UUID

            const guestsUuid = uuidv4();
            
            // Generate JWT Token
            token = jwt.sign(
                { userId: guestsUuid }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.EXPIRY_FOR_NEW_USER || '1h' }
            );
        }
    }catch (error){
        res.status(500).json({message:'Server Error'});
    }

}