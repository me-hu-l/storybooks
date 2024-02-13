import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

// @desc auth user/set token
// route POST /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select(
    "-followers -following -pendingRequests -pendingSentRequests"
  );

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc register a new user
// route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email }).select(
    "-followers -following -pendingRequests -pendingSentRequests"
  );

  if (userExists) {
    res.status(400);
    throw new Error(`User already exists`);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc logout user
// route POST /api/users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "user logged out" });
});

// @desc get user profile
// route GET /api/users/profile/:userId
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.userId) {
    throw new Error("Not authorised: different user");
  }

  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json(user);
});

// @desc update user profile
// route PUT /api/users/profile/:userId
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.userId) {
    throw new Error("Not authorised: different user");
  }

  const user = await User.findById(req.user._id).select(
    "-followers -following -pendingRequests -pendingSentRequests"
  );

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc follow a user
// route POST /api/users/follow/:targetUserId
// @access private
const followUser = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;

  if (req.user._id.toString() === targetUserId) {
    throw new Error("you can't follow yourself");
  }

  const targetUser = await User.findById(targetUserId).select(
    "-followers -following -pendingSentRequests"
  );
  const reqUser = await User.findById(req.user._id).select(
    "-followers -pendingRequests"
  );

  if (!targetUser || !reqUser) {
    res.status(404);
    throw new Error("User not found");
  } else if (reqUser.following.includes(targetUserId)) {
    res.status(400);
    throw new Error("Already Following");
  } else if (reqUser.pendingSentRequests.includes(targetUserId)) {
    res.status(400);
    throw new Error("Already sent request");
  } else {
    targetUser.pendingRequests.push(req.user._id);
    reqUser.pendingSentRequests.push(targetUserId);

    await targetUser.save();
    await reqUser.save();
  }

  res
    .status(200)
    .json({ success: true, message: "Follow request sent successfully." });
});

// @desc accept follow request from a user
// route PUT /api/users/accept-follow/:followerUserId
// @access private
const acceptFollow = asyncHandler(async (req, res) => {
  const { followerUserId } = req.params;

  if (req.user._id.toString() === followerUserId) {
    throw new Error("you can't accept follow request from yourself");
  }

  const followerUser = await User.findById(followerUserId).select(
    "-followers -pendingRequests"
  );

  const reqUser = await User.findById(req.user._id).select(
    "-following -pendingSentRequests"
  );

  if (!followerUser || !reqUser) {
    res.status(404);
    throw new Error("User not found");
  } else if (!reqUser.pendingRequests.includes(followerUserId)) {
    res.status(400);
    throw new Error("No follow request to accept");
  } else if (reqUser.followers.includes(followerUserId)) {
    res.status(400);
    throw new Error("Already a follower");
  } else {
    followerUser.following.push(req.user._id);
    followerUser.pendingSentRequests.pull(req.user._id);

    reqUser.followers.push(followerUserId);
    reqUser.pendingRequests.pull(followerUserId);

    await reqUser.save();
    await followerUser.save();
  }

  res
    .status(200)
    .json({ success: true, message: "Follow request accepted successfully." });
});

// @desc reject follow request from a user
// route PUT /api/users/reject-follow/:followerUserId
// @access private
const rejectFollow = asyncHandler(async (req, res) => {
  const { followerUserId } = req.params;

  if (req.user._id.toString() === followerUserId) {
    throw new Error("you can't reject follow request from yourself");
  }

  const followerUser = await User.findById(followerUserId).select(
    "-followers -pendingRequests -following"
  );

  const reqUser = await User.findById(req.user._id).select(
    "-following -pendingSentRequests"
  );

  if (!followerUser || !reqUser) {
    res.status(404);
    throw new Error("User not found");
  } else if (!reqUser.pendingRequests.includes(followerUserId)) {
    res.status(400);
    throw new Error("No follow request to reject");
  } else if (reqUser.followers.includes(followerUserId)) {
    res.status(400);
    throw new Error("Already a follower");
  } else {
    followerUser.pendingSentRequests.pull(req.user._id);

    reqUser.pendingRequests.pull(followerUserId);

    await reqUser.save();
    await followerUser.save();
  }

  res
    .status(200)
    .json({ success: true, message: "Follow request rejected successfully." });
});

// @desc get a user's followers
// route GET /api/users/followers/:userId
// @access private
const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select("-following -pendingRequests -pendingSentRequests")
    .populate("followers", "name"); // Populate followers with user names

  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  res.status(200).json({ success: true, followers: user.followers });
});

// @desc get a user's following
// route GET /api/users/following/:userId
// @access private
const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select("-followers -pendingRequests -pendingSentRequests")
    .populate("following", "name"); // Populate followers with user names

  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  res.status(200).json({ success: true, following: user.following });
});

// @desc get a user's pending requests
// route GET /api/users/pending-requests/:userId
// @access private
const getPendingRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user._id.toString()) {
    throw new Error("not authorised");
  }

  const user = await User.findById(userId)
    .select("-following -followers -pendingSentRequests")
    .populate("pendingRequests", "name"); // Populate followers with user names

  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  res
    .status(200)
    .json({ success: true, pendingRequests: user.pendingRequests });
});

// @desc get a user's pending sent requests
// route GET /api/users/pending-sent-requests/:userId
// @access private
const getPendingSentRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user._id.toString()) {
    throw new Error("not authorised");
  }

  const user = await User.findById(userId)
    .select("-following -pendingRequests -followers")
    .populate("pendingSentRequests", "name"); // Populate followers with user names

  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  res
    .status(200)
    .json({ success: true, pendingSentRequests: user.pendingSentRequests });
});

// @desc unfollow a user
// route DELETE /api/users/unfollow/:targetUserId
// @access private
const unfollowUser = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;

  if (req.user._id.toString() === targetUserId) {
    throw new Error("you can't unfollow yourself");
  }

  const targetUser = await User.findById(targetUserId).select(
    "-pendingRequests -following -pendingSentRequests"
  );
  const reqUser = await User.findById(req.user._id).select(
    "-followers -pendingRequests"
  );

  if (!targetUser || !reqUser) {
    res.status(404);
    throw new Error("User not found");
  } else if (!reqUser.following.includes(targetUserId)) {
    res.status(400);
    throw new Error("Already not Following");
  } else {
    targetUser.followers.pull(req.user._id);
    reqUser.following.pull(targetUserId);

    await targetUser.save();
    await reqUser.save();
  }

  res.status(200).json({ success: true, message: "unfollowed successfully." });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  followUser,
  acceptFollow,
  rejectFollow,
  getFollowers,
  getFollowing,
  getPendingRequests,
  getPendingSentRequests,
  unfollowUser,
};
