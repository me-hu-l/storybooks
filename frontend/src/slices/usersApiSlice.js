import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/${data._id}`,
        method: "PUT",
        body: data,
      }),
    }),
    followUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/follow/${data.targetUserId}`,
        method: "POST",
      }),
    }),
    acceptFollowRequest: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/accept-follow/${data.followerUserId}`,
        method: "PUT",
      }),
    }),
    rejectFollowRequest: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reject-follow/${data.followerUserId}`,
        method: "PUT",
      }),
    }),
    getFollowers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/followers/${data.userId}`,
        method: "GET",
      }),
    }),
    getFollowing: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/following/${data.userId}`,
        method: "GET",
      }),
    }),
    getPendingRequests: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/pending-requests/${data.userId}`,
        method: "GET",
      }),
    }),
    getPendingSentRequests: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/pending-sent-requests/${data.userId}`,
        method: "GET",
      }),
    }),
    unfollowUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/unfollow/${data.targetUserId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useFollowUserMutation,
  useAcceptFollowRequestMutation,
  useRejectFollowRequestMutation,
  useGetFollowersMutation,
  useGetFollowingMutation,
  useGetPendingRequestsMutation,
  useGetPendingSentRequestsMutation,
  useUnfollowUserMutation,
} = usersApiSlice;
