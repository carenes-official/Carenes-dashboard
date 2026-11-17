import { baseApis } from './baseApis'

const notificationApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ limit, page } = {}) => ({
        url: '/notification/get-all-notification',
        params: { limit, page },
      }),
      providesTags: ['notifications'],
    }),
    readAllNotifications: builder.mutation({
      query: () => ({ url: '/notification/see-notification', method: 'PATCH' }),
      invalidatesTags: ['notifications'],
    }),
  }),
})

export const { useGetAllNotificationsQuery, useReadAllNotificationsMutation } =
  notificationApis
