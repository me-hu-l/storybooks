import { apiSlice } from "./apiSlice";
const STORIES_URL = "/api/stories";

export const storiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicStories: builder.mutation({
      query: () => ({
        url: `${STORIES_URL}`,
        method: "GET",
      }),
    }),
    getSpecificStory: builder.mutation({
      query: (body) => ({
        url: `${STORIES_URL}/${body.id}`,
        method: "GET",
      }),
    }),
    addStory: builder.mutation({
      query: (data) => ({
        url: `${STORIES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateStory: builder.mutation({
      query: (data) => ({
        url: `${STORIES_URL}/${data.id}`,
        method: "PUT",
        body: { title: data.title, status: data.status, body: data.body },
      }),
    }),
    deleteStory: builder.mutation({
      query: (data) => ({
        url: `${STORIES_URL}/${data.storyId}`,
        method: "DELETE",
      }),
    }),
    getUserStories: builder.mutation({
      query: (data) => ({
        url: `${STORIES_URL}/user/${data.userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPublicStoriesMutation,
  useGetSpecificStoryMutation,
  useAddStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
  useGetUserStoriesMutation
} = storiesApiSlice;
