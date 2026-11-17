import LegalDocumentPage from '../components/legal/LegalDocumentPage'
import {
  useGetTermsAndConditionsQuery,
  useSaveTermsAndConditionsMutation,
} from '../Redux/legalApis'

export default function TermsConditions() {
  const query = useGetTermsAndConditionsQuery()
  const [save, { isLoading }] = useSaveTermsAndConditionsMutation()

  return (
    <LegalDocumentPage
      title="Terms & Conditions"
      subtitle="Separate terms for customers and for salon owners. Each app only shows its own version."
      query={query}
      saving={isLoading}
      publicPath="/terms-conditions"
      documents={[
        {
          key: 'customer',
          label: 'Customer app',
          audience: 'customer',
          field: 'descriptionForCustomerApp',
          endpoint: '/manage/get-terms-conditions?app=customer',
          description:
            'Shown to customers in the Carenes customer app (sign-up checkbox and Settings → Terms & Conditions).',
          save: (html) => save({ descriptionForCustomerApp: html }).unwrap(),
        },
        {
          key: 'client',
          label: 'Salon owner app',
          audience: 'client',
          field: 'descriptionForClientApp',
          endpoint: '/manage/get-terms-conditions?app=client',
          description:
            'Shown to salon owners in the Carenes salon app (registration and Settings). Covers the platform relationship with businesses.',
          save: (html) => save({ descriptionForClientApp: html }).unwrap(),
        },
      ]}
    />
  )
}
