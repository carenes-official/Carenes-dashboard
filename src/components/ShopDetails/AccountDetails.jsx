import DetailGrid from './DetailGrid'

// Show only the last 4 digits of the account number on screen.
const mask = (value) => {
  if (!value) return value
  const s = String(value)
  return s.length <= 4 ? s : `•••• ${s.slice(-4)}`
}

export default function AccountDetails({ shopData = {} }) {
  return (
    <DetailGrid
      items={[
        { label: 'Bank name', value: shopData.bankName },
        { label: 'Account holder', value: shopData.bankAccountName },
        { label: 'Account number', value: mask(shopData.bankAccountNumber) },
        { label: 'Branch code', value: shopData.branchCode },
        { label: 'Bank city', value: shopData.bankCity },
      ]}
    />
  )
}
