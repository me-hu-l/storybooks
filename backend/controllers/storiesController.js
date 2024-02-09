import asyncHandler from 'express-async-handler'
import Story from '../models/storyModels.js'

// @desc get story add page
// route GET /api/stories/add
// @access private
const getStoryAddPage = asyncHandler(async (req, res) =>{
        res.status(201).json({
                user: req.user,
                stories: []
        })
})

// @desc add story to database
// route POST /api/stories
// @access private
const addStory = asyncHandler(async (req, res) =>{

        req.body.user = req.user._id

        const story = await Story.create(req.body)
        res.status(201).json({
                user: req.user,
                stories: story
        })
})

// @desc get all the public stories
// route GET /api/stories
// @access private
const getPublicStories = asyncHandler(async (req, res) =>{
        const stories = await Story.find({status: "public"}).populate('user').sort({ createdAt: 'desc'}).lean()

        res.status(200).json({
                user: req.user,
                stories: stories
        })
})

// @desc get specific story
// route GET /api/stories/:id
// @access private
const getSpecificStory = asyncHandler(async (req, res) =>{

        let story = await Story.findById({_id: req.params.id}).populate('user').lean()

        if(!story || (story.status === 'private' && !story.user._id.equals(req.user._id))){
                res.status(404);
                throw new Error('Story not found')
        }

        res.status(200).json({
                user:req.user,
                stories: story
        })
})

// @desc get story edit page
// route GET /api/stories/edit/:id
// @access private
const getEditPage = asyncHandler(async (req, res) =>{
        const story = await Story.findOne({_id:req.params.id}).lean()

        if(!story){
                res.status(404)
                throw new Error('story not found')
        }

        if(!story.user.equals(req.user._id)){
                res.status(401)
                throw new Error('not authorised to edit')
        }else{
                res.status(200).json({
                        user: req.user,
                        stories: story
                })
        }
})

// @desc update specific story
// route PUT /api/stories/:id
// @access private
const updateStory = asyncHandler(async (req, res) =>{

        let story = await Story.findById(req.params.id).lean()

        if(!story){
                res.status(404)
                throw new Error('story not found')
        }

        if(!story.user.equals(req.user._id)){
                res.status(401)
                throw new Error('not authorised to update the story')
        }else{
                story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
                        new: true,
                        runValidators: true
                })
                res.status(200).json({
                        user: req.user,
                        stories: story
                })
        }
        
})

// @desc delete specific story
// route DELETE /api/stories/:id
// @access private
const deleteStory = asyncHandler(async (req, res) =>{

        let story = await Story.findById(req.params.id).lean()
        
        if(!story.user.equals(req.user._id)){
                res.status(401)
                throw new Error('not authorised to delete the story')
        }

        await Story.deleteOne({_id: req.params.id})
        res.status(200).json({
                message: ' successfully deleted'
        })
        
})

// @desc get all public stories of a specific user
// route GET /api/stories/user/:userId
// @access private
const getUserStories = asyncHandler(async (req, res) =>{

        const stories = await Story.find({
                user: req.params.userId,
                status: 'public'
        })
        .populate('user').lean()

        res.status(200).json({
                user: req.user,
                stories: stories
        })

})

export {
        getStoryAddPage,
        addStory,
        getPublicStories,
        getSpecificStory,
        getEditPage,
        updateStory,
        deleteStory,
        getUserStories
}