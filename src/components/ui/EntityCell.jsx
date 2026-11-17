import { Avatar } from 'antd'
import { imageUrl, initials } from '../../lib/format'

export default function EntityCell({ image, name, subtitle, size = 36, shape = 'circle' }) {
  const src = imageUrl(image)
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar
        src={src}
        size={size}
        shape={shape}
        className="shrink-0 bg-brand-50 font-semibold text-brand-700"
      >
        {initials(name)}
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{name || '—'}</p>
        {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}
