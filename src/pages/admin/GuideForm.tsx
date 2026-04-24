import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Loader2, X } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import RichTextEditor from '../../components/admin/RichTextEditor'
import {
  createGuide,
  deleteGuideImage,
  getGuide,
  getGuideImageUrl,
  updateGuide,
  uploadGuideImage,
} from '../../lib/guides'
import type { GuideArticleFormData, GuideCategory } from '../../types'

const CATEGORIES: GuideCategory[] = [
  'Buying Guides',
  'Finance & Costs',
  'Car Care & Maintenance',
  'Selling Your Car',
]

const EMPTY_FORM: GuideArticleFormData = {
  title: '',
  category: 'Buying Guides',
  excerpt: '',
  content: '',
  coverImageId: '',
  readTime: '',
  published: true,
  slug: '',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-slate-900 text-base border-b border-slate-100 pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  children,
  error,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function GuideForm() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<GuideArticleFormData>(EMPTY_FORM)
  const [removedCoverId, setRemovedCoverId] = useState<string | null>(null)
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null)
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof GuideArticleFormData | 'general', string>>>({})

  useEffect(() => {
    if (!id) return
    getGuide(id)
      .then((article) => {
        const { $id, $createdAt, $updatedAt, ...rest } = article
        void $id; void $createdAt; void $updatedAt
        setForm(rest)
      })
      .catch((e) => setErrors({ general: e.message }))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof GuideArticleFormData>(key: K, value: GuideArticleFormData[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'title' && !isEdit) {
        next.slug = slugify(value as string)
      }
      return next
    })
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (form.coverImageId) setRemovedCoverId(form.coverImageId)
    setForm((f) => ({ ...f, coverImageId: '' }))
    setNewCoverFile(file)
    setNewCoverPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function handleRemoveCover() {
    if (form.coverImageId) setRemovedCoverId(form.coverImageId)
    setForm((f) => ({ ...f, coverImageId: '' }))
    setNewCoverFile(null)
    setNewCoverPreview(null)
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.title.trim())   e.title   = 'Title is required'
    if (!form.category)       e.category = 'Category is required'
    if (!form.content.trim() || form.content === '<p></p>') e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      let coverImageId = form.coverImageId

      if (removedCoverId) await deleteGuideImage(removedCoverId)
      if (newCoverFile) coverImageId = await uploadGuideImage(newCoverFile)

      const payload: GuideArticleFormData = { ...form, coverImageId }

      if (isEdit && id) {
        await updateGuide(id, payload)
      } else {
        await createGuide(payload)
      }

      navigate('/admin/guides')
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Failed to save article' })
    } finally {
      setSubmitting(false)
    }
  }

  const coverSrc = newCoverPreview ?? (form.coverImageId ? getGuideImageUrl(form.coverImageId, 400) : null)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={36} className="animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/guides" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Article' : 'New Article'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update the article content and settings' : 'Write and publish a new guide article'}
            </p>
          </div>
        </div>

        {errors.general && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <Section title="Article Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Title" required error={errors.title}>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="e.g. How to Buy a Used Car: The Complete Guide"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Category" required error={errors.category}>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value as GuideCategory)}
                  className={inputCls}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </Field>

              <Field label="Read Time" hint="e.g. 5 min read">
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => set('readTime', e.target.value)}
                  placeholder="5 min read"
                  className={inputCls}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Excerpt" hint="Short description shown on the guides listing page">
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => set('excerpt', e.target.value)}
                    placeholder="A brief summary of what this article covers…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>

              <Field label="URL Slug" hint="Auto-generated from title — edit if needed">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  placeholder="how-to-buy-a-used-car"
                  className={inputCls}
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.published ? 'published' : 'draft'}
                  onChange={(e) => set('published', e.target.value === 'published')}
                  className={inputCls}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (not visible to users)</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Cover Image */}
          <Section title="Cover Image">
            {coverSrc ? (
              <div className="relative w-full max-w-sm">
                <img
                  src={coverSrc}
                  alt="Cover"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow"
                >
                  <X size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-2 right-2 text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow hover:bg-slate-50 font-medium text-slate-600"
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-10 text-center cursor-pointer transition-colors hover:bg-blue-50/20"
              >
                <ImagePlus size={28} className="mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 font-medium">Click to upload cover image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10 MB</p>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </Section>

          {/* Rich Text Content */}
          <Section title="Article Content">
            <Field label="Content" required error={errors.content}>
              <RichTextEditor
                content={form.content}
                onChange={(html) => set('content', html)}
                placeholder="Write your article here… Use the toolbar to add headings, lists, images, links, and more."
              />
            </Field>
          </Section>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/admin/guides"
              className="flex-1 py-3 text-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEdit ? 'Saving…' : 'Publishing…'}
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Publish Article'
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
