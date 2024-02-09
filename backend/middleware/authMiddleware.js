import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModels.js'


const protect = asyncHandler(async (req, res, next) =>{
        let token;

        token = req.cookies.jwt

        if(token){
                try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET)

                        req.user = await User.findById(decoded.userId).select('-password').lean()

                        next()
                } catch (error) {
                        res.status(401)
                        throw new Error('not authorised : invalid token')        
                }
        }else{
                res.status(401);
                throw new Error('not authorised : no token')
        }
})

export  {protect}