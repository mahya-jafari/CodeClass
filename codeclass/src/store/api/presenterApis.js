import { baseApi } from "./baseApi";

export const presenterApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Calendar =====
    getPresenterCalendar: builder.query({
      query: () => "/presenter/calendar",
      providesTags: ["Classes"],
    }),

    // ===== Webinars =====
    getWebinars: builder.query({
      query: () => "/presenter/webinars",
      providesTags: ["Webinars"],
    }),
    createWebinar: builder.mutation({
      query: (body) => ({
        url: "/presenter/webinars",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Webinars"],
    }),
    deleteWebinar: builder.mutation({
      query: (id) => ({
        url: `/presenter/webinars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Webinars"],
    }),

    // ===== Pamphlets =====
    getPamphlets: builder.query({
      query: () => "/presenter/pamphlets",
      providesTags: ["Classes"],
    }),
    uploadPamphlet: builder.mutation({
      query: (body) => ({
        url: "/presenter/pamphlets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),
    deletePamphlet: builder.mutation({
      query: (id) => ({
        url: `/presenter/pamphlets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classes"],
    }),

    // ===== Profile =====
    getProfile: builder.query({
      query: () => "/presenter/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/presenter/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/presenter/change-password",
        method: "POST",
        body,
      }),
    }),

    // ===== New Class =====
    createClass: builder.mutation({
      query: (body) => ({
        url: "/presenter/classes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Classes"],
    }),

    // ===== My Classes =====
    getMyClasses: builder.query({
      query: () => "/presenter/classes",
      providesTags: ["Classes"],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/presenter/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Classes"],
    }),
    getClassDetail: builder.query({
      query: (id) => `/presenter/classes/${id}`,
      providesTags: (result, error, id) => [{ type: "Classes", id }],
    }),

    // ===== Messages =====
    getMessages: builder.query({
      query: () => "/presenter/messages",
      providesTags: ["Messages"],
    }),
    getChatMessages: builder.query({
      query: (id) => `/presenter/messages/${id}`,
      providesTags: (result, error, id) => [{ type: "Messages", id }],
    }),
    sendMessage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/presenter/messages/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Messages", id }],
    }),

    // ===== Finance =====
    getFinanceSummary: builder.query({
      query: () => "/presenter/finance/summary",
      providesTags: ["Finance"],
    }),
    getTransactions: builder.query({
      query: () => "/presenter/finance/transactions",
      providesTags: ["Finance"],
    }),
    getBanks: builder.query({
      query: () => "/presenter/finance/banks",
      providesTags: ["Finance"],
    }),
    addBank: builder.mutation({
      query: (body) => ({
        url: "/presenter/finance/banks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Finance"],
    }),
    deleteBank: builder.mutation({
      query: (id) => ({
        url: `/presenter/finance/banks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Finance"],
    }),
    
    // ===== Dashboard =====
    getDashboardStats: builder.query({
      query: () => "/presenter/dashboard/stats",
      providesTags: ["Classes", "Webinars", "Finance"],
    }),
    getDashboardClasses: builder.query({
      query: () => "/presenter/dashboard/classes",
      providesTags: ["Classes"],
    }),
    getDashboardWebinars: builder.query({
      query: () => "/presenter/dashboard/webinars",
      providesTags: ["Webinars"],
    }),

     // ===== classroom =====
    getClassroomParticipants: builder.query({
      query: (classId) => `/presenter/classroom/${classId}/participants`,
      providesTags: ["Classes"],
    }),
    getClassroomMessages: builder.query({
      query: (classId) => `/presenter/classroom/${classId}/messages`,
      providesTags: ["Messages"],
    }),
    sendClassroomMessage: builder.mutation({
      query: ({ classId, ...body }) => ({
        url: `/presenter/classroom/${classId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPresenterCalendarQuery,
  useGetWebinarsQuery,
  useCreateWebinarMutation,
  useDeleteWebinarMutation,
  useGetPamphletsQuery,
  useUploadPamphletMutation,
  useDeletePamphletMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useCreateClassMutation,
  useGetMyClassesQuery,
  useDeleteClassMutation,
  useGetClassDetailQuery,
  useGetMessagesQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useGetFinanceSummaryQuery,
  useGetTransactionsQuery,
  useGetBanksQuery,
  useAddBankMutation,
  useDeleteBankMutation,
  useGetDashboardStatsQuery,
  useGetDashboardClassesQuery,
  useGetDashboardWebinarsQuery,
  useGetClassroomParticipantsQuery,
  useGetClassroomMessagesQuery,
  useSendClassroomMessageMutation,
} = presenterApis;