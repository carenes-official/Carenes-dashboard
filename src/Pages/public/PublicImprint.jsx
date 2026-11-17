import PublicLegalDocument from '../../components/public/PublicLegalDocument'
import { useGetImprintQuery } from '../../Redux/legalApis'

export default function PublicImprint() {
  const query = useGetImprintQuery()
  return <PublicLegalDocument title="Imprint" query={query} split={false} />
}
