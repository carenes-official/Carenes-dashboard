import { baseApis } from './baseApis'

const staffApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaff: builder.query({
      query: ({ page, limit, searchTerm, sort } = {}) => ({
        url: '/staff/all-staff',
        params: { page, limit, searchTerm, sort },
      }),
    }),
  }),
})

export const { useGetAllStaffQuery } = staffApis
