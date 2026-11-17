import { useEffect, useMemo, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'
import { Button, Popconfirm, Segmented, Tooltip } from 'antd'
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineArrowUturnLeft,
  HiOutlineCloudArrowUp,
} from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../Redux/baseApis'
import { formatDateTime } from '../../lib/format'

const textOf = (html = '') =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const wordCount = (html) => {
  const text = textOf(html)
  return text ? text.split(' ').length : 0
}

// Sandboxed preview: no scripts run, mirrors the app's web view.
const previewDocument = (html) => `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;padding:20px;font:14px/1.7 Inter,system-ui,-apple-system,sans-serif;color:#1e293b;word-break:break-word}
h1{font-size:22px;margin:20px 0 8px}h2{font-size:18px;margin:18px 0 6px}h3{font-size:16px;margin:14px 0 6px}
p{margin:0 0 10px}a{color:#016A70}ul,ol{padding-left:20px}table{border-collapse:collapse}td,th{border:1px solid #e2e8f0;padding:6px 10px}
</style></head><body>${html || '<p style="color:#94a3b8">Nothing to preview yet.</p>'}</body></html>`

export default function LegalEditor({
  value = '',
  updatedAt,
  onSave,
  saving = false,
  placeholder = 'Start writing…',
  onDirtyChange,
  minWords = 1,
  allowSaveUnchanged = false,
}) {
  const initial = value || ''
  const contentRef = useRef(initial)
  const [editorKey, setEditorKey] = useState(0)
  const [mode, setMode] = useState('edit')
  const [dirty, setDirty] = useState(false)
  const [words, setWords] = useState(() => wordCount(initial))

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  // Memoised so Jodit is not re-created on every keystroke.
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder,
      height: 560,
      minHeight: 420,
      toolbarAdaptive: false,
      toolbarSticky: true,
      toolbarStickyOffset: 64,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html',
      buttons:
        'paragraph,bold,italic,underline,strikethrough,|,ul,ol,|,outdent,indent,align,|,link,table,hr,|,undo,redo,eraser,|,source,fullsize',
      link: { noFollowCheckbox: false, openInNewTabCheckbox: true },
      cleanHTML: { fillEmptyParagraph: false },
      disablePlugins: 'speech-recognize,ai-assistant,print,about',
    }),
    [placeholder]
  )

  // Jodit re-serialises the HTML right after mounting and fires onChange.
  // Treat changes in that first moment as the baseline, not as user edits.
  const baselineRef = useRef(initial)
  const mountedAtRef = useRef(Date.now())

  const handleChange = (html) => {
    contentRef.current = html
    if (Date.now() - mountedAtRef.current < 600) {
      baselineRef.current = html
      return
    }
    setDirty(html !== baselineRef.current)
    setWords(wordCount(html))
  }

  const discard = () => {
    contentRef.current = initial
    baselineRef.current = initial
    mountedAtRef.current = Date.now()
    setDirty(false)
    setWords(wordCount(initial))
    setEditorKey((k) => k + 1)
  }

  const save = async () => {
    const html = contentRef.current || ''
    if (wordCount(html) < minWords) {
      toast.error('Content cannot be empty.')
      return
    }
    try {
      await onSave(html)
      toast.success('Published. The app will show the new version.')
      setDirty(false)
    } catch (err) {
      toast.error(getErrorMessage(err, err?.message || 'Could not save. Please try again.'), {
        duration: 8000,
      })
    }
  }

  return (
    <div className="legal-editor">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'edit', label: 'Edit', icon: <HiOutlinePencilSquare className="inline h-4 w-4" /> },
            { value: 'preview', label: 'Preview', icon: <HiOutlineEye className="inline h-4 w-4" /> },
          ]}
        />
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{words.toLocaleString('de-DE')} words</span>
          <span className="hidden h-3 w-px bg-slate-200 sm:block" />
          <span>Last published: {updatedAt ? formatDateTime(updatedAt) : 'never'}</span>
        </div>
      </div>

      <div className={mode === 'edit' ? '' : 'hidden'}>
        <JoditEditor
          key={editorKey}
          value={contentRef.current}
          config={config}
          onChange={handleChange}
          onBlur={handleChange}
        />
      </div>
      {mode === 'preview' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-6">
          <div className="mx-auto max-w-[430px] overflow-hidden rounded-[28px] border-[6px] border-slate-900 bg-white shadow-lift">
            <iframe
              title="App preview"
              sandbox=""
              srcDoc={previewDocument(contentRef.current)}
              className="block h-[600px] w-full border-0"
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {dirty ? (
            <span className="font-medium text-amber-600">● Unsaved changes</span>
          ) : (
            'All changes published'
          )}
        </p>
        <div className="flex gap-2">
          <Popconfirm
            title="Discard unsaved changes?"
            description="The editor will go back to the published version."
            okText="Discard"
            okButtonProps={{ danger: true }}
            onConfirm={discard}
            disabled={!dirty}
          >
            <Tooltip title={dirty ? '' : 'No changes to discard'}>
              <Button icon={<HiOutlineArrowUturnLeft />} disabled={!dirty || saving}>
                Discard
              </Button>
            </Tooltip>
          </Popconfirm>
          <Button
            type="primary"
            icon={<HiOutlineCloudArrowUp />}
            loading={saving}
            disabled={!dirty && !allowSaveUnchanged}
            onClick={save}
          >
            Save & publish
          </Button>
        </div>
      </div>
    </div>
  )
}
