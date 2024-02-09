import { apiSlice } from "./apiSlice";
const ROOT_URL = "api";

export const rootApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalStories: builder.mutation({
        query: () => ({
          url: `${ROOT_URL}/dashboard`,
          method: "GET",
        }),
      }),
  }),
});

export const {
  useGetPersonalStoriesMutation
} = rootApiSlice;