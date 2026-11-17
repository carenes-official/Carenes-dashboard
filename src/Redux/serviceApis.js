import { baseApis } from './baseApis'

const serviceApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    // Service categories (shop categories) with service counts and sales.
    getAllServices: builder.query({
      query: ({ page, limit } = {}) => ({
        url: '/shop-category/get-all',
        params: { page, limit },
      }),
      providesTags: ['category'],
    }),
    getOneService: builder.query({
      query: ({ shopCategory, sort, searchTerm, page, limit }) => ({
        url: '/service/get-all',
        params: { shopCategory, page, limit, sort, searchTerm },
      }),
    }),
  }),
})

export const { useGetAllServicesQuery, useGetOneServiceQuery } = serviceApis
