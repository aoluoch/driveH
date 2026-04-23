import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Plus, Sparkles, X } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ImageUploader from '../../components/admin/ImageUploader'
import AIAssistant from '../../components/admin/AIAssistant'
import {
  createCar,
  deleteCarImage,
  getCar,
  updateCar,
  uploadCarImage,
} from '../../lib/cars'
import type { AIGeneratedCar, CarFormData } from '../../types'

const EMPTY_FORM: CarFormData = {
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuelType: 'Petrol',
  transmission: 'Automatic',
  engine: '',
  condition: 'Used',
  description: '',
  location: '',
  images: [],
  isSold: false,
  features: [],
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-slate-900 text-base border-b border-slate-100 pb-3">{title}</h2>
      {children}
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
  error,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
const selectCls = inputCls

export default function CarForm() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<CarFormData>(EMPTY_FORM)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [showAI, setShowAI] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CarFormData | 'general', string>>>({})

  useEffect(() => {
    if (!id) return
    getCar(id)
      .then((car) => {
        const { $id, $createdAt, $updatedAt, images, ...rest } = car
        setForm({ ...rest, images: [] })
        setExistingImages(images)
      })
      .catch((e) => setErrors({ general: e.message }))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof CarFormData>(key: K, value: CarFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  // ── AI fill ──────────────────────────────────────────────────────────────
  function handleAIGenerate(data: AIGeneratedCar) {
    setForm((f) => ({
      ...f,
      title:        data.title        || f.title,
      brand:        data.brand        || f.brand,
      model:        data.model        || f.model,
      year:         data.year         || f.year,
      fuelType:     (data.fuelType as CarFormData['fuelType'])       || f.fuelType,
      transmission: (data.transmission as CarFormData['transmission']) || f.transmission,
      engine:       data.engine       || f.engine,
      condition:    (data.condition as CarFormData['condition'])     || f.condition,
      description:  data.description  || f.description,
      features:     data.features.length > 0 ? data.features : f.features,
    }))
  }

  // ── Features ─────────────────────────────────────────────────────────────
  function addFeature() {
    const val = featureInput.trim()
    if (!val || form.features.includes(val)) return
    set('features', [...form.features, val])
    setFeatureInput('')
  }

  function removeFeature(feat: string) {
    set('features', form.features.filter((f) => f !== feat))
  }

  // ── Images ───────────────────────────────────────────────────────────────
  function handleRemoveExisting(fileId: string) {
    setExistingImages((prev) => prev.filter((id) => id !== fileId))
    setRemovedImages((prev) => [...prev, fileId])
  }

  function handleAddFiles(files: File[]) {
    setNewFiles((prev) => [...prev, ...files])
  }

  function handleRemoveNew(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Validate ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (!form.brand.trim())       e.brand       = 'Brand is required'
    if (!form.model.trim())       e.model       = 'Model is required'
    if (!form.year || form.year < 1900) e.year  = 'Valid year required'
    if (!form.price || form.price <= 0) e.price = 'Price must be > 0'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.location.trim())    e.location    = 'Location is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      // Upload new images
      const newIds = await Promise.all(newFiles.map(uploadCarImage))

      // Delete removed images
      await Promise.all(removedImages.map(deleteCarImage))

      const finalImages = [...existingImages, ...newIds]
      const payload: CarFormData = { ...form, images: finalImages }

      if (isEdit && id) {
        await updateCar(id, payload)
      } else {
        await createCar(payload)
      }

      navigate('/admin/dashboard')
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Failed to save car' })
    } finally {
      setSubmitting(false)
    }
  }

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isEdit ? 'Edit Car Listing' : 'Add New Car'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEdit ? 'Update the listing details below' : 'Fill in the details for your new listing'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAI(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-sm"
          >
            <Sparkles size={15} />
            AI Assist
          </button>
        </div>

        {errors.general && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Listing Title" required error={errors.title}>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. 2022 Toyota Camry XSE V6"
                  className={inputCls}
                />
              </Field>

              <Field label="Brand" required error={errors.brand}>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  placeholder="e.g. Toyota"
                  className={inputCls}
                />
              </Field>

              <Field label="Model" required error={errors.model}>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => set('model', e.target.value)}
                  placeholder="e.g. Camry"
                  className={inputCls}
                />
              </Field>

              <Field label="Year" required error={errors.year}>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => set('year', +e.target.value)}
                  min={1900}
                  max={2030}
                  className={inputCls}
                />
              </Field>

              <Field label="Price (KSh)" required error={errors.price}>
                <input
                  type="number"
                  value={form.price || ''}
                  onChange={(e) => set('price', +e.target.value)}
                  min={0}
                  placeholder="25000"
                  className={inputCls}
                />
              </Field>

              <Field label="Location" required error={errors.location}>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. Nairobi, Kenya"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          {/* Specifications */}
          <Section title="Specifications">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Fuel Type">
                <select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value as CarFormData['fuelType'])} className={selectCls}>
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>

              <Field label="Transmission">
                <select value={form.transmission} onChange={(e) => set('transmission', e.target.value as CarFormData['transmission'])} className={selectCls}>
                  {['Automatic', 'Manual'].map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>

              <Field label="Condition">
                <select value={form.condition} onChange={(e) => set('condition', e.target.value as CarFormData['condition'])} className={selectCls}>
                  {['New', 'Used', 'Certified Pre-Owned'].map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>

              <Field label="Engine">
                <input
                  type="text"
                  value={form.engine}
                  onChange={(e) => set('engine', e.target.value)}
                  placeholder="e.g. 2.5L 4-Cylinder DOHC"
                  className={inputCls}
                />
              </Field>

              <Field label="Mileage (km)">
                <input
                  type="number"
                  value={form.mileage || ''}
                  onChange={(e) => set('mileage', +e.target.value)}
                  min={0}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.isSold ? 'sold' : 'active'}
                  onChange={(e) => set('isSold', e.target.value === 'sold')}
                  className={selectCls}
                >
                  <option value="active">Active (For Sale)</option>
                  <option value="sold">Sold</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Description & Features */}
          <Section title="Description & Features">
            <Field label="Description" required error={errors.description}>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe the car's condition, history, and highlights…"
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="Features">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                  placeholder="e.g. Apple CarPlay — press Enter to add"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex-shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.features.map((feat) => (
                    <span
                      key={feat}
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {feat}
                      <button
                        type="button"
                        onClick={() => removeFeature(feat)}
                        className="text-blue-400 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </Section>

          {/* Images */}
          <Section title="Images">
            <ImageUploader
              existingIds={existingImages}
              newFiles={newFiles}
              onAddFiles={handleAddFiles}
              onRemoveExisting={handleRemoveExisting}
              onRemoveNew={handleRemoveNew}
            />
          </Section>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/admin/dashboard"
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
                  {isEdit ? 'Saving…' : 'Creating…'}
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Create Listing'
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />

      {showAI && (
        <AIAssistant onGenerate={handleAIGenerate} onClose={() => setShowAI(false)} />
      )}
    </div>
  )
}
