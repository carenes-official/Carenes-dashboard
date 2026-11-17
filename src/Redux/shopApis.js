import { baseApis } from './baseApis'

const shopApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllShop: builder.query({
      query: ({ searchTerm, page, limit, status } = {}) => ({
        url: '/client/get-all-client',
        params: { page, limit, status, searchTerm },
      }),
      providesTags: ['shop'],
    }),
    updateShop: builder.mutation({
      query: ({ id, data }) => ({
        url: `/client/update-status/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['shop'],
    }),
    getOneShopDetails: builder.query({
      query: ({ id }) => `/client/get-shop-details/${id}`,
      providesTags: ['shop'],
    }),
    getAllServiceFromOneShop: builder.query({
      query: ({ page, limit, shop }) => ({
        url: '/service/get-all',
        params: { page, limit, shop },
      }),
    }),
    getOneShopBusinessHour: builder.query({
      query: ({ entityId, entityType }) => ({
        url: '/business-hour/get-business-hour',
        params: { entityId, entityType },
      }),
    }),
    getOneShopAllStaff: builder.query({
      query: ({ page, limit, shop }) => ({
        url: '/staff/all-staff',
        params: { page, limit, shop },
      }),
    }),
  }),
})

export const {
  useGetAllShopQuery,
  useGetOneShopBusinessHourQuery,
  useGetOneShopAllStaffQuery,
  useUpdateShopMutation,
  useGetOneShopDetailsQuery,
  useGetAllServiceFromOneShopQuery,
} = shopApis
