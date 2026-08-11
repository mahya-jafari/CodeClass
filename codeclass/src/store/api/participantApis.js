import { baseApi } from "./baseApi";

export const participantApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Webinars =====
    getParticipantWebinars: builder.query({
    query: () => "/participant/webinars",
    providesTags: ["Webinars"],
    }),
    toggleJoinWebinar: builder.mutation({
    query: (id) => ({
        url: `/participant/webinars/${id}/join`,
        method: "POST",
    }),
    invalidatesTags: ["Webinars"],
    }),

    // ===== Profile =====
    getParticipantProfile: builder.query({
    query: () => "/participant/profile",
    providesTags: ["User"],
    }),
    updateParticipantProfile: builder.mutation({
    query: (body) => ({
        url: "/participant/profile",
        method: "PUT",
        body,
    }),
    invalidatesTags: ["User"],
    }),
    changeParticipantPassword: builder.mutation({
    query: (body) => ({
        url: "/participant/change-password",
        method: "POST",
        body,
    }),
    }),

    // ===== Pamphlets =====
    getParticipantPamphlets: builder.query({
    query: () => "/participant/pamphlets",
    providesTags: ["Classes"],
    }),

    // ===== My Classes =====
    getParticipantClasses: builder.query({
    query: () => "/participant/classes",
    providesTags: ["Classes"],
    }),

    // ===== Finance =====
    getParticipantFinance: builder.query({
    query: () => "/participant/finance",
    providesTags: ["Finance"],
    }),
    chargeWallet: builder.mutation({
    query: (body) => ({
        url: "/participant/finance/charge",
        method: "POST",
        body,
    }),
    invalidatesTags: ["Finance"],
    }),
    retryPayment: builder.mutation({
    query: (id) => ({
        url: `/participant/finance/payments/${id}/retry`,
        method: "POST",
    }),
    invalidatesTags: ["Finance"],
    }),

    // ===== Certificates =====
    getParticipantCertificates: builder.query({
    query: () => "/participant/certificates",
    providesTags: ["Classes"],
    }),

    // ===== Calendar =====
    getParticipantCalendar: builder.query({
    query: () => "/participant/calendar",
    providesTags: ["Classes"],
    }),

    // ===== Assignments =====
    getParticipantAssignments: builder.query({
    query: () => "/participant/assignments",
    providesTags: ["Classes"],
    }),
    submitAssignment: builder.mutation({
    query: ({ id, ...body }) => ({
        url: `/participant/assignments/${id}/submit`,
        method: "POST",
        body,
    }),
    invalidatesTags: ["Classes"],
    }),

    // ===== Messages =====
    getParticipantMessages: builder.query({
    query: () => "/participant/messages",
    providesTags: ["Messages"],
    }),
    getParticipantChat: builder.query({
    query: (id) => `/participant/messages/${id}`,
    providesTags: (result, error, id) => [{ type: "Messages", id }],
    }),
    sendParticipantMessage: builder.mutation({
    query: ({ id, ...body }) => ({
        url: `/participant/messages/${id}`,
        method: "POST",
        body,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: "Messages", id }],
    }),

    // ===== Dashboard =====
    getParticipantDashboard: builder.query({
    query: () => "/participant/dashboard",
    providesTags: ["Classes", "Webinars"],
    }),

    // ===== Classroom =====
    getParticipantClassroomParticipants: builder.query({
    query: (id) => `/participant/classroom/${id}/participants`,
    providesTags: ["Classes"],
    }),
    getParticipantClassroomMessages: builder.query({
    query: (id) => `/participant/classroom/${id}/messages`,
    providesTags: ["Messages"],
    }),
 }),
});   

export const {
  useGetParticipantWebinarsQuery,
  useToggleJoinWebinarMutation,
  useGetParticipantProfileQuery,
  useUpdateParticipantProfileMutation,
  useChangeParticipantPasswordMutation,
  useGetParticipantPamphletsQuery,
  useGetParticipantClassesQuery,
  useGetParticipantFinanceQuery,
  useChargeWalletMutation,
  useRetryPaymentMutation,
  useGetParticipantCertificatesQuery,
  useGetParticipantCalendarQuery,
  useGetParticipantAssignmentsQuery,
  useSubmitAssignmentMutation,
  useGetParticipantMessagesQuery,
  useGetParticipantChatQuery,
  useSendParticipantMessageMutation,
  useGetParticipantDashboardQuery,
  useGetParticipantClassroomParticipantsQuery,
  useGetParticipantClassroomMessagesQuery,
} = participantApis;