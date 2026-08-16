import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Classes", "Webinars", "Finance", "Messages", "Coupons", "Reviews", "Presenters", "certificates"],
  endpoints: () => ({}),
});