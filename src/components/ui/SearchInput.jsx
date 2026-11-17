import { Input } from 'antd'
import { HiMagnifyingGlass } from 'react-icons/hi2'

export default function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <Input
      allowClear
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      prefix={<HiMagnifyingGlass className="text-slate-400" />}
      className={`w-full sm:w-64 ${className}`}
    />
  )
}
