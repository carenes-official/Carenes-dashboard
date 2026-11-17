import { baseApis } from './baseApis'

const categoryApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getMyCategories: builder.query({
      query: ({ page, limit } = {}) => ({
        url: '/shop-category/get-all',
        params: { page, limit },
      }),
      providesTags: ['category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({ url: '/shop-category/create', method: 'POST', body: data }),
      invalidatesTags: ['category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/shop-category/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/shop-category/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['category'],
    }),
  }),
})

export const {
  useGetMyCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApis
