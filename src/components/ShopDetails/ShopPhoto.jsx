import { Image } from 'antd'
import { imageUrl } from '../../lib/format'
import { EmptyState } from '../ui/QueryState'

export default function ShopPhoto({ shopImages = [] }) {
  if (!shopImages?.length) {
    return <EmptyState title="No photos uploaded" description="The shop hasn't added any photos yet." />
  }

  return (
    <Image.PreviewGroup>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shopImages.map((photo, i) => (
          <div
            key={`${photo}-${i}`}
            className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-inset ring-slate-200"
          >
            <Image
              src={imageUrl(photo)}
              alt={`Shop photo ${i + 1}`}
              width="100%"
              height="100%"
              className="object-cover"
              rootClassName="h-full w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </Image.PreviewGroup>
  )
}
