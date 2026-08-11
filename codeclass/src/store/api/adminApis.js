import { baseApi } from "./baseApi";

export const adminApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
        query: () => "/admin/profile",
        providesTags: ["User"],
        }),
    getAdminDashboard: builder.query({
    query: () => "/admin/dashboard",
    providesTags: ["User", "Classes", "Webinars", "Finance"],
    }),    
  // Users
    getAdminUsers: builder.query({
    query: () => "/admin/users",
    providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
    query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { status },
    }),
    invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
    query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
    }),
    invalidatesTags: ["User"],
    }),

    // Classes
    getAdminClasses: builder.query({
    query: () => "/admin/classes",
    providesTags: ["Classes"],
    }),
    updateClassStatus: builder.mutation({
    query: ({ id, status }) => ({
        url: `/admin/classes/${id}/status`,
        method: "PATCH",
        body: { status },
    }),
    invalidatesTags: ["Classes"],
    }),
    deleteAdminClass: builder.mutation({
    query: (id) => ({
        url: `/admin/classes/${id}`,
        method: "DELETE",
    }),
    invalidatesTags: ["Classes"],
    }),

    // Webinars
    getAdminWebinars: builder.query({
    query: () => "/admin/webinars",
    providesTags: ["Webinars"],
    }),
    updateWebinarStatus: builder.mutation({
    query: ({ id, status }) => ({
        url: `/admin/webinars/${id}/status`,
        method: "PATCH",
        body: { status },
    }),
    invalidatesTags: ["Webinars"],
    }),

    // Finance
    getAdminFinance: builder.query({
    query: () => "/admin/finance",
    providesTags: ["Finance"],
    }),
    approveWithdrawal: builder.mutation({
    query: (id) => ({
        url: `/admin/finance/withdrawals/${id}/approve`,
        method: "POST",
    }),
    invalidatesTags: ["Finance"],
    }),
    rejectWithdrawal: builder.mutation({
    query: (id) => ({
        url: `/admin/finance/withdrawals/${id}/reject`,
        method: "POST",
    }),
    invalidatesTags: ["Finance"],
    }),

    // Certificates
    getAdminCertificates: builder.query({
    query: () => "/admin/certificates",
    providesTags: ["Classes"],
    }),

    // Assignments
    getAdminAssignments: builder.query({
    query: () => "/admin/assignments",
    providesTags: ["Classes"],
    }),

    // Messages
    getAdminMessages: builder.query({
    query: () => "/admin/messages",
    providesTags: ["Messages"],
    }),

    // Reports
    getAdminReports: builder.query({
    query: () => "/admin/reports",
    providesTags: ["Finance", "Classes"],
    }),

    // Settings
    getAdminSettings: builder.query({
    query: () => "/admin/settings",
    providesTags: ["User"],
    }),
    updateAdminSettings: builder.mutation({
    query: (body) => ({
        url: "/admin/settings",
        method: "PUT",
        body,
    }),
    invalidatesTags: ["User"],
    }),
     }),
});

export const {
  useGetAdminProfileQuery,
  useGetAdminDashboardQuery,
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAdminClassesQuery,
  useUpdateClassStatusMutation,
  useDeleteAdminClassMutation,
  useGetAdminWebinarsQuery,
  useUpdateWebinarStatusMutation,
  useGetAdminFinanceQuery,
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
  useGetAdminCertificatesQuery,
  useGetAdminAssignmentsQuery,
  useGetAdminMessagesQuery,
  useGetAdminReportsQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = adminApis;