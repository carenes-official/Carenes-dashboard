import LegalDocumentPage from '../components/legal/LegalDocumentPage'
import { useGetPrivacyPolicyQuery, useSavePrivacyPolicyMutation } from '../Redux/legalApis'

export default function PrivacyPolicy() {
  const query = useGetPrivacyPolicyQuery()
  const [save, { isLoading }] = useSavePrivacyPolicyMutation()

  return (
    <LegalDocumentPage
      title="Privacy Policy"
      subtitle="Separate privacy policies for customers and for salon owners, as each app processes different data."
      query={query}
      saving={isLoading}
      publicPath="/privacy-policy"
      documents={[
        {
          key: 'customer',
          label: 'Customer app',
          audience: 'customer',
          field: 'descriptionForCustomerApp',
          fallbackField: 'description',
          endpoint: '/manage/get-privacy-policy?app=customer',
          description:
            'Shown to customers in the Carenes customer app. Older app versions that read the single legacy policy also receive this text.',
          save: (html) => save({ descriptionForCustomerApp: html }).unwrap(),
        },
        {
          key: 'client',
          label: 'Salon owner app',
          audience: 'client',
          field: 'descriptionForClientApp',
          fallbackField: 'description',
          endpoint: '/manage/get-privacy-policy?app=client',
          description:
            'Shown to salon owners in the Carenes salon app. Should cover business, staff, payout and booking data.',
          save: (html) => save({ descriptionForClientApp: html }).unwrap(),
        },
      ]}
    />
  )
}
