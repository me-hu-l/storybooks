import asyncHandler from 'express-async-handler'
import Story from '../models/storyModels.js'

// @desc get landing page
// route GET /api
// @access public
const getLandingPage = asyncHandler(async (req, res) =>{
        res.status(200).json({ message: "this is landing page"})
})

// @desc get dashboard
// route GET /api/dashboard
// @access private
const getDashboard = asyncHandler(async (req, res) =>{
        const stories = await Story.find({ user: req.user._id }).lean()
        res.status(200).json({
                user: req.user,
                stories: stories
        })
})

export {
        getLandingPage,
        getDashboard
}
