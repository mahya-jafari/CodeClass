import { baseApi } from "./baseApi";

export const adminApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminProfile: builder.query({
            query: () => "/admin/profile",
            providesTags: ["User"],
        }),
        updateAdminProfile: builder.mutation({
            query: (body) => ({
                url: "/admin/profile",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        changeAdminPassword: builder.mutation({
            query: (body) => ({
                url: "/admin/profile/password",
                method: "PUT",
                body,
            }),
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

        getAdminFinance: builder.query({
            query: () => "/admin/finance",
            providesTags: ["Finance"],
        }),
        approveWithdrawal: builder.mutation({ query: (id) => ({ url: `/admin/finance/withdrawals/${id}/approve`, method: "POST" }), invalidatesTags: ["Finance"] }),
        rejectWithdrawal: builder.mutation({ query: (id) => ({ url: `/admin/finance/withdrawals/${id}/reject`, method: "POST" }), invalidatesTags: ["Finance"] }),

        // Certificates
        getAdminCertificates: builder.query({
            query: () => "/admin/certificates",
            providesTags: ["Certificates"],
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
        getAdminMessageThread: builder.query({
            query: (id) => `/admin/messages/${id}/thread`,
            providesTags: (result, error, id) => [{ type: "Messages", id }],
        }),
        sendAdminMessageReply: builder.mutation({
            query: ({ id, text }) => ({
                url: `/admin/messages/${id}/thread`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Messages", id }],
        }),
        updateMessageStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/messages/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Messages"],
        }),
        markMessageRead: builder.mutation({
            query: (id) => ({
                url: `/admin/messages/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Messages"],
        }),
        deleteAdminMessage: builder.mutation({
            query: (id) => ({
                url: `/admin/messages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Messages"],
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
    useUpdateAdminProfileMutation,
    useChangeAdminPasswordMutation,
    useGetAdminDashboardQuery,
    useGetAdminUsersQuery,
    useGetAdminClassesQuery,
    useGetAdminWebinarsQuery,
    useGetAdminFinanceQuery,
    useGetAdminCertificatesQuery,
    useGetAdminAssignmentsQuery,
    useGetAdminMessagesQuery,
    useGetAdminMessageThreadQuery,
    useSendAdminMessageReplyMutation,
    useUpdateMessageStatusMutation,
    useMarkMessageReadMutation,
    useDeleteAdminMessageMutation,
    useGetAdminReportsQuery,
    useGetAdminSettingsQuery,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
    useUpdateClassStatusMutation,
    useDeleteAdminClassMutation,
    useUpdateWebinarStatusMutation,
    useApproveWithdrawalMutation,
    useRejectWithdrawalMutation,
    useUpdateAdminSettingsMutation,
} = adminApis;