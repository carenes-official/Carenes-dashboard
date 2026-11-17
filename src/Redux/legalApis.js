import { baseApis } from './baseApis'

/**
 * Legal documents shown inside the mobile apps.
 * Terms & privacy are separate for the customer app and the salon owner
 * (client) app; the imprint is shared by both apps.
 */
const legalApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditions: builder.query({
      query: () => '/manage/get-terms-conditions',
      providesTags: ['termsAndCondition'],
    }),
    saveTermsAndConditions: builder.mutation({
      query: (body) => ({ url: '/manage/add-terms-conditions', method: 'POST', body }),
      invalidatesTags: ['termsAndCondition'],
    }),
    getPrivacyPolicy: builder.query({
      query: () => '/manage/get-privacy-policy',
      providesTags: ['privacyPolicy'],
    }),
    savePrivacyPolicy: builder.mutation({
      query: (body) => ({ url: '/manage/add-privacy-policy', method: 'POST', body }),
      invalidatesTags: ['privacyPolicy'],
    }),
    getImprint: builder.query({
      query: () => '/manage/get-imprint',
      providesTags: ['imprint'],
    }),
    saveImprint: builder.mutation({
      query: (body) => ({ url: '/manage/add-imprint', method: 'POST', body }),
      invalidatesTags: ['imprint'],
    }),
  }),
})

export const {
  useGetTermsAndConditionsQuery,
  useSaveTermsAndConditionsMutation,
  useGetPrivacyPolicyQuery,
  useSavePrivacyPolicyMutation,
  useGetImprintQuery,
  useSaveImprintMutation,
} = legalApis
