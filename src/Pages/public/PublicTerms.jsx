import PublicLegalDocument from '../../components/public/PublicLegalDocument'
import { useGetTermsAndConditionsQuery } from '../../Redux/legalApis'

export default function PublicTerms() {
  const query = useGetTermsAndConditionsQuery()
  return <PublicLegalDocument title="Terms & Conditions" query={query} />
}
