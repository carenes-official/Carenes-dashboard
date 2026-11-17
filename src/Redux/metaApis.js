import { baseApis } from './baseApis'

const metaApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getMetaData: builder.query({
      query: () => '/meta/get-meta-data',
    }),
    getSalesProfitChartData: builder.query({
      query: (year) => ({ url: '/meta/sales-profit-chart-data', params: { year } }),
    }),
  }),
})

export const { useGetMetaDataQuery, useGetSalesProfitChartDataQuery } = metaApis
