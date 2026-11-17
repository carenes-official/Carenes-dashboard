import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Segmented, Skeleton } from 'antd'
import DOMPurify from 'dompurify'
import { HiOutlineUser, HiOutlineBuildingStorefront, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import { ErrorState } from '../ui/QueryState'

// URL value -> stored field. `?type=` lets the apps deep-link to their version.
const AUDIENCES = {
  customer: { label: 'Customers', field: 'descriptionForCustomerApp', icon: HiOutlineUser },
  salon: { label: 'Salon owners', field: 'descriptionForClientApp', icon: HiOutlineBuildingStorefront },
}

const sanitize = (html) => {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, ADD_ATTR: ['target'] })
  // Open external links in a new tab safely.
  return clean.replace(/<a /g, '<a rel="noopener noreferrer" ')
}

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

/**
 * Public page for a legal document. With `split`, the document has a version
 * for customers and one for salon owners and the reader can switch between them.
 */
export default function PublicLegalDocument({ title, query, split = true, singleField = 'description', fallbackField }) {
  const [params, setParams] = useSearchParams()
  const rawType = params.get('type')
  const typeParam = rawType === 'client' ? 'salon' : rawType
  const audience = AUDIENCES[typeParam] ? typeParam : 'customer'

  useEffect(() => {
    document.title = `${title} · Carenes`
  }, [title])

  const doc = query.data?.data
  const html = useMemo(() => {
    if (!doc) return ''
    const raw = split
      ? doc[AUDIENCES[audience].field] || (fallbackField ? doc[fallbackField] : '')
      : doc[singleField]
    return raw ? sanitize(raw) : ''
  }, [doc, audience, split, singleField, fallbackField])

  const setAudience = (value) => {
    const next = new URLSearchParams(params)
    next.set('type', value)
    setParams(next, { replace: true })
  }

  const updated = formatDate(doc?.updatedAt)

  return (
    <article>
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {updated && <p className="mt-3 text-sm text-slate-500">Last updated {updated}</p>}

        {split && (
          <div className="mt-6 flex justify-center">
            <Segmented
              size="large"
              value={audience}
              onChange={setAudience}
              options={Object.entries(AUDIENCES).map(([value, { label, icon: Icon }]) => ({
                value,
                label: (
                  <span className="flex items-center gap-2 px-1">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                ),
              }))}
            />
          </div>
        )}
      </header>

      <div className="surface mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-10">
        {query.isLoading ? (
          <Skeleton active paragraph={{ rows: 14 }} />
        ) : query.isError && !query.data ? (
          <ErrorState error={query.error} onRetry={query.refetch} title="Could not load this document" />
        ) : html ? (
          <div className="legal-prose" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="py-10 text-center text-slate-500">This document will be published soon.</p>
        )}
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center ring-1 ring-inset ring-slate-200 sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold text-slate-900">Questions about this document?</p>
          <p className="text-sm text-slate-500">Our team is happy to help.</p>
        </div>
        <Link
          to="/support"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
          Contact support
        </Link>
      </div>
    </article>
  )
}
