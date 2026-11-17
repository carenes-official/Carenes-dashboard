import { baseApis } from './baseApis'

const payOnShopApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllShopData: builder.query({
      query: ({ page, limit, searchTerm } = {}) => ({
        url: '/client/pay-on-shop-data',
        params: { page, limit, searchTerm },
      }),
      providesTags: ['payOnShop'],
    }),
    notifyAllShop: builder.mutation({
      query: () => ({ url: '/client/notify-all-shops', method: 'POST' }),
      invalidatesTags: ['payOnShop'],
    }),
    notifyOneShop: builder.mutation({
      query: (id) => ({ url: `/client/notify-single-shop/${id}`, method: 'POST' }),
    }),
  }),
})

export const {
  useGetAllShopDataQuery,
  useNotifyAllShopMutation,
  useNotifyOneShopMutation,
} = payOnShopApis
