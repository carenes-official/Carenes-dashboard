import { baseApis } from './baseApis'

const supportApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    // Public contact form
    contactSupport: builder.mutation({
      query: (body) => ({ url: '/support/contact', method: 'POST', body }),
    }),

    // Admin
    getSupportTickets: builder.query({
      query: ({ page, limit, status, searchTerm } = {}) => ({
        url: '/support/tickets',
        params: { page, limit, status, searchTerm },
      }),
      providesTags: ['support'],
    }),
    updateSupportTicket: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/support/tickets/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['support'],
    }),
    deleteSupportTicket: builder.mutation({
      query: (id) => ({ url: `/support/tickets/${id}`, method: 'DELETE' }),
      invalidatesTags: ['support'],
    }),
  }),
})

export const {
  useContactSupportMutation,
  useGetSupportTicketsQuery,
  useUpdateSupportTicketMutation,
  useDeleteSupportTicketMutation,
} = supportApis
