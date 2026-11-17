import { useCallback, useState } from 'react'
import { Button, Tabs, Tooltip } from 'antd'
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineUser,
  HiOutlineBuildingStorefront,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'
import PageHeader from '../ui/PageHeader'
import Panel from '../ui/Panel'
import { ErrorState, LoadingBlock } from '../ui/QueryState'
import StatusBadge from '../ui/StatusBadge'
import LegalEditor from './LegalEditor'
import { url } from '../../Redux/server'

// Stable key per document version so saving one tab never resets the other.
const hashOf = (str = '') => {
  let h = 0
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0
  return `${str.length}-${h}`
}

const AUDIENCE_ICON = {
  customer: HiOutlineUser,
  client: HiOutlineBuildingStorefront,
  all: HiOutlineDevicePhoneMobile,
}

function EndpointHint({ endpoint }) {
  const [copied, setCopied] = useState(false)
  const full = `${url}${endpoint}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
      <code className="min-w-0 flex-1 truncate text-xs text-slate-600">GET {endpoint}</code>
      <Tooltip title={copied ? 'Copied' : 'Copy full URL'}>
        <button
          type="button"
          onClick={copy}
          className="cursor-pointer bg-transparent text-slate-500 hover:text-slate-900"
          aria-label="Copy endpoint URL"
        >
          {copied ? <HiOutlineCheck className="h-4 w-4 text-emerald-600" /> : <HiOutlineClipboardDocument className="h-4 w-4" />}
        </button>
      </Tooltip>
    </div>
  )
}

/**
 * documents: [{ key, label, audience, description, field, fallbackField?, endpoint, save }]
 * Each document is one editable text stored in `query.data.data[field]`.
 */
export default function LegalDocumentPage({ title, subtitle, query, documents, saving, publicPath }) {
  const [active, setActive] = useState(documents[0].key)
  const [dirtyMap, setDirtyMap] = useState({})
  const onDirty = useCallback(
    (key) => (dirty) => setDirtyMap((prev) => (prev[key] === dirty ? prev : { ...prev, [key]: dirty })),
    []
  )
  const [dirtyHandlers] = useState(() =>
    Object.fromEntries(documents.map((d) => [d.key, onDirty(d.key)]))
  )

  if (query.isLoading) return <LoadingBlock rows={10} />
  if (query.isError && !query.data) {
    return (
      <div className="surface">
        <ErrorState error={query.error} onRetry={query.refetch} />
      </div>
    )
  }

  const doc = query.data?.data || {}
  const current = documents.find((d) => d.key === active) || documents[0]

  // Legacy single-text documents are used as the starting point until the
  // per-app version has been saved once.
  const valueFor = (d) => doc[d.field] || (d.fallbackField ? doc[d.fallbackField] : '') || ''

  // Save, then re-read from the server and confirm the text was stored.
  // Protects against a backend that answers "success" but drops the field.
  const saveAndVerify = async (d, html) => {
    await d.save(html)
    const { data } = await query.refetch()
    if (data?.data?.[d.field] !== html) {
      throw new Error(
        'The server accepted the request but did not store the text. The backend is probably outdated and needs to be deployed.'
      )
    }
  }

  const renderEditor = (d) => {
    const value = valueFor(d)
    return (
      <LegalEditor
        key={`${d.key}:${hashOf(value)}`}
        value={value}
        updatedAt={value ? doc.updatedAt : undefined}
        saving={saving}
        onSave={(html) => saveAndVerify(d, html)}
        onDirtyChange={dirtyHandlers[d.key]}
        allowSaveUnchanged={!doc[d.field] && Boolean(value)}
        placeholder={`Write the ${d.label.toLowerCase()} here…`}
      />
    )
  }

  const statusFor = (d) => {
    if (doc[d.field]) return <StatusBadge tone="success">Published</StatusBadge>
    if (d.fallbackField && doc[d.fallbackField]) {
      return (
        <Tooltip title="The app currently shows the old shared text. Save this version to publish it separately.">
          <span>
            <StatusBadge tone="brand">Shared text</StatusBadge>
          </span>
        </Tooltip>
      )
    }
    return <StatusBadge tone="warning">Missing</StatusBadge>
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          publicPath && (
            <a href={publicPath} target="_blank" rel="noopener noreferrer">
              <Button icon={<HiOutlineArrowTopRightOnSquare className="h-4 w-4" />}>View public page</Button>
            </a>
          )
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel bodyClassName="p-4 sm:p-6">
          {documents.length > 1 ? (
            <Tabs
              activeKey={active}
              onChange={setActive}
              items={documents.map((d) => {
                const Icon = AUDIENCE_ICON[d.audience] || HiOutlineDevicePhoneMobile
                return {
                  key: d.key,
                  label: (
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {d.label}
                      {dirtyMap[d.key] && (
                        <span className="h-2 w-2 rounded-full bg-amber-500" aria-label="Unsaved changes" />
                      )}
                    </span>
                  ),
                  children: renderEditor(d),
                }
              })}
            />
          ) : (
            renderEditor(documents[0])
          )}
        </Panel>

        <aside className="space-y-4">
          <Panel title="Publishing status">
            <ul className="space-y-3">
              {documents.map((d) => (
                <li key={d.key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-700">{d.label}</span>
                  {statusFor(d)}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Where it appears">
            <p className="text-sm leading-relaxed text-slate-600">{current.description}</p>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Mobile app endpoint
            </p>
            <EndpointHint endpoint={current.endpoint} />
          </Panel>

          <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 ring-1 ring-inset ring-amber-200">
            Legal texts must be reviewed by a lawyer before publishing. Changes go live in the apps
            immediately after saving.
          </div>
        </aside>
      </div>
    </div>
  )
}
