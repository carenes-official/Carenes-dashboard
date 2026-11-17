import { baseApis } from './baseApis'

const customerApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: ({ page, limit, searchTerm, status } = {}) => ({
        url: '/customer/get-all',
        params: { page, limit, searchTerm, status },
      }),
      providesTags: ['customers'],
    }),
    blockUnblockCustomer: builder.mutation({
      query: ({ id, status }) => ({
        url: `/user/block-unblock/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['customers'],
    }),
  }),
})

export const { useGetAllCustomersQuery, useBlockUnblockCustomerMutation } = customerApis
