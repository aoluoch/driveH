import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Sparkles, X } from 'lucide-react'
import { generateFromImage, generateFromName } from '../../lib/ai'
import type { AIGeneratedCar } from '../../types'

interface AIAssistantProps {
  onGenerate: (data: AIGeneratedCar) => void
  onClose: () => void
}

export default function AIAssistant({ onGenerate, onClose }: AIAssistantProps) {
  const [mode, setMode] = useState<'name' | 'image'>('name')
  const [carName, setCarName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImage(file: File | null) {
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleGenerate() {
    setError(null)
    setLoading(true)
    try {
      let result: AIGeneratedCar
      if (mode === 'name') {
        if (!carName.trim()) throw new Error('Please enter a car name.')
        result = await generateFromName(carName.trim())
      } else {
        if (!imageFile) throw new Error('Please select an image.')
        const b64 = await toBase64(imageFile)
        result = await generateFromImage(b64, imageFile.type)
      }
      onGenerate(result)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'AI generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">AI Listing Assistant</h2>
              <p className="text-xs text-slate-500">Auto-fill form with AI-generated content</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['name', 'image'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  mode === m
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'name' ? '✏️  By Name' : '🖼  By Image'}
              </button>
            ))}
          </div>

          {mode === 'name' ? (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Car name or model
              </label>
              <input
                type="text"
                placeholder="e.g. 2022 Toyota Camry XSE"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Car image
              </label>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setImageFile(null); setPreview(null) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <ImagePlus size={24} />
                  <span className="text-sm">Click to upload car image</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 py-2.5 text-sm bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
