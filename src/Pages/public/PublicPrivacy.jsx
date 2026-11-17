import PublicLegalDocument from '../../components/public/PublicLegalDocument'
import { useGetPrivacyPolicyQuery } from '../../Redux/legalApis'

export default function PublicPrivacy() {
  const query = useGetPrivacyPolicyQuery()
  // Until a per-app policy is saved, the old shared policy is shown.
  return <PublicLegalDocument title="Privacy Policy" query={query} fallbackField="description" />
}
