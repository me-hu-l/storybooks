import asyncHandler from "express-async-handler";
import Story from "../models/storyModels.js";
import mongoose from "mongoose";
import User from "../models/userModels.js";

// @desc get story add page
// route GET /api/stories/add
// @access private
const getStoryAddPage = asyncHandler(async (req, res) => {
  res.status(201).json({
    user: req.user,
    stories: [],
  });
});

// @desc add story to database
// route POST /api/stories
// @access private
const addStory = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;

  const story = await Story.create(req.body);
  res.status(201).json({
    user: req.user,
    stories: story,
  });
});

// @desc get all the public stories
// route GET /api/stories
// @access private
const getPublicStories = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("following");

  const followingIds = user.following;

  const stories = await Story.find({
    $or: [
      { status: "public" },
      { $and: [{ status: "private" }, { user: { $in: followingIds } }] },
    ],
  })
    .populate({
      path: "user",
      select:
        "-password -followers -following -pendingRequests -pendingSentRequests",
    })
    .sort({ createdAt: "desc" })
    .lean();

  res.status(200).json({
    user: req.user,
    stories: stories,
  });
});

// @desc get specific story
// route GET /api/stories/:id
// @access private
const getSpecificStory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("following");

  const followingIds = user.following;

  const story = await Story.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        title: 1,
        body: 1,
        status: 1,
        user: {
          _id: 1,
          name: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          followersCount: { $size: "$user.followers" },
          followingCount: { $size: "$user.following" },
          pendingRequestsCount: { $size: "$user.pendingRequests" },
          pendingSentRequestsCount: { $size: "$user.pendingSentRequests" },
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (
    !story ||
    (story[0].status === "private" &&
      !followingIds.includes(story[0].user._id) &&
      !story[0].user._id.equals(req.user._id))
  ) {
    res.status(404);
    throw new Error("Story not found");
  }

  res.status(200).json({
    user: req.user,
    stories: story,
  });
});

// @desc get story edit page
// route GET /api/stories/edit/:id
// @access private
const getEditPage = asyncHandler(async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();

  if (!story) {
    res.status(404);
    throw new Error("story not found");
  }

  if (!story.user.equals(req.user._id)) {
    res.status(401);
    throw new Error("not authorised to edit");
  } else {
    res.status(200).json({
      user: req.user,
      stories: story,
    });
  }
});

// @desc update specific story
// route PUT /api/stories/:id
// @access private
const updateStory = asyncHandler(async (req, res) => {
  let story = await Story.findById(req.params.id).lean();

  if (!story) {
    res.status(404);
    throw new Error("story not found");
  }

  if (!story.user.equals(req.user._id)) {
    res.status(401);
    throw new Error("not authorised to update the story");
  } else {
    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      user: req.user,
      stories: story,
    });
  }
});

// @desc delete specific story
// route DELETE /api/stories/:id
// @access private
const deleteStory = asyncHandler(async (req, res) => {
  let story = await Story.findById(req.params.id).lean();

  if (!story.user.equals(req.user._id)) {
    res.status(401);
    throw new Error("not authorised to delete the story");
  }

  await Story.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: " successfully deleted",
  });
});

// @desc get all public stories of a specific user
// route GET /api/stories/user/:userId
// @access private
const getUserStories = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("following");

  const followingIds = user.following;

  const loggedInUserId = req.user._id;
  const targetUserId = req.params.userId;

  const isFollowing = followingIds.some((id) => id.equals(targetUserId));

  let pipeline;

  if (isFollowing) {
    // If the logged-in user is following the target user, fetch all stories (public and private)
    pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(targetUserId),
        },
      },
    ];
  } else {
    // If the logged-in user is not following the target user, fetch only public stories
    pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(targetUserId),
          status: "public",
        },
      },
    ];
  }

  // Add common stages to both pipelines
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        title: 1,
        body: 1,
        status: 1,
        user: {
          _id: 1,
          name: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          followersCount: { $size: "$user.followers" },
          followingCount: { $size: "$user.following" },
          pendingRequestsCount: { $size: "$user.pendingRequests" },
          pendingSentRequestsCount: { $size: "$user.pendingSentRequests" },
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    }
  );

  const stories = await Story.aggregate(pipeline);

  res.status(200).json({
    user: req.user,
    stories: stories,
  });
});

export {
  getStoryAddPage,
  addStory,
  getPublicStories,
  getSpecificStory,
  getEditPage,
  updateStory,
  deleteStory,
  getUserStories,
};
