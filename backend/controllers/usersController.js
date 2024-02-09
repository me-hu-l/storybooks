import asyncHandler from 'express-async-handler'
import User from '../models/userModels.js'
import generateToken from '../utils/generateToken.js'

// @desc auth user/set token
// route POST /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) =>{
        const {email, password} = req.body

        const user = await User.findOne({email});
        if(user && (await user.matchPasswords(password))){
                generateToken(res, user._id)
                res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email
                })
        }else{
                res.status(401);
                throw new Error('Invalid email or password')
        }
})

// @desc register a new user
// route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) =>{
        const {name, email, password} = req.body
        
        const userExists = await User.findOne({ email})

        if(userExists){
                res.status(400);
                throw new Error(`User already exists`)
        }

        const user = await User.create({
                name,
                email,
                password
        })

        if(user){
                generateToken(res, user._id)
                res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email
                })
        }else{
                res.status(400);
                throw new Error('Invalid user data')
        }
})

// @desc logout user
// route POST /api/users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) =>{
        res.cookie('jwt', '', {
                httpOnly: true,
                expires: new Date(0)
        })

        res.status(200).json({ message: 'user logged out'})
})

// @desc get user profile
// route GET /api/users/profile/:userId
// @access private
const getUserProfile = asyncHandler(async (req, res) =>{
        
        if(req.user._id.toString() !== req.params.userId){
                throw new Error('Not authorised: different user');
        }

        const user = {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email
        }

        res.status(200).json(user)
})

// @desc update user profile
// route PUT /api/users/profile/:userId
// @access private
const updateUserProfile = asyncHandler(async (req, res) =>{

        if(req.user._id .toString() !== req.params.userId){
                throw new Error('Not authorised: different user');
        }

        const user = await User.findById(req.user._id)

        if(user){
                user.name = req.body.name || user.name
                user.email = req.body.email || user.email

                if(req.body.password){
                        user.password = req.body.password
                }

                const updatedUser = await user.save();

                res.status(200).json({
                        _id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                })
        }else{
                res.status(404)
                throw new Error('user not found')
        }

})

export {
        authUser,
        registerUser,
        logoutUser,
        getUserProfile,
        updateUserProfile
}