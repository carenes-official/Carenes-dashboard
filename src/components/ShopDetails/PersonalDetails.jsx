import { fullName } from '../../lib/format'
import DetailGrid from './DetailGrid'

export default function PersonalDetails({ shopData = {} }) {
  const category =
    shopData.shopCategoryId?.categoryName ||
    (typeof shopData.shopCategory === 'string' ? shopData.shopCategory : undefined)

  return (
    <DetailGrid
      items={[
        { label: 'Owner', value: fullName(shopData.firstName, shopData.lastName) },
        { label: 'Shop name', value: shopData.shopName },
        { label: 'Shop type', value: category },
        { label: 'Email', value: shopData.email },
        { label: 'Contact', value: shopData.phoneNumber },
        { label: 'City', value: shopData.city },
        { label: 'Address', value: shopData.address },
        { label: 'Gender category', value: shopData.shopGenderCategory },
      ]}
    />
  )
}
