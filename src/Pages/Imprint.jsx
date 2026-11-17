import LegalDocumentPage from '../components/legal/LegalDocumentPage'
import { useGetImprintQuery, useSaveImprintMutation } from '../Redux/legalApis'

export default function Imprint() {
  const query = useGetImprintQuery()
  const [save, { isLoading }] = useSaveImprintMutation()

  return (
    <LegalDocumentPage
      title="Imprint (Impressum)"
      subtitle="Legal notice required in Germany (§ 5 DDG). One imprint is shared by both apps."
      query={query}
      saving={isLoading}
      publicPath="/imprint"
      documents={[
        {
          key: 'imprint',
          label: 'Imprint',
          audience: 'all',
          field: 'description',
          endpoint: '/manage/get-imprint',
          description:
            'Shown in both the customer app and the salon owner app. Must be reachable within two taps and include company name, address, representative, contact, register entry and VAT ID.',
          save: (html) => save({ description: html }).unwrap(),
        },
      ]}
    />
  )
}
