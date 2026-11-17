import { baseApis } from './baseApis'

const transactionApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: ({ page, limit, senderEntityType } = {}) => ({
        url: '/transaction/get-all-transaction',
        params: { page, limit, senderEntityType },
      }),
    }),
  }),
})

export const { useGetAllTransactionsQuery } = transactionApis
