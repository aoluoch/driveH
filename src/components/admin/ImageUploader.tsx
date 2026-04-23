import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { getCarImageUrl } from '../../lib/cars'

interface ImageUploaderProps {
  existingIds: string[]
  newFiles: File[]
  onAddFiles: (files: File[]) => void
  onRemoveExisting: (fileId: string) => void
  onRemoveNew: (index: number) => void
}

export default function ImageUploader({
  existingIds,
  newFiles,
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const accepted = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (accepted.length) onAddFiles(accepted)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const totalCount = existingIds.length + newFiles.length

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-colors hover:bg-blue-50/30"
      >
        <ImagePlus size={32} className="mx-auto mb-2 text-slate-400" />
        <p className="text-sm text-slate-600 font-medium">Drop images here or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10 MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails */}
      {totalCount > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Existing images */}
          {existingIds.map((id) => (
            <div key={id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                src={getCarImageUrl(id, 200)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={12} />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                Saved
              </span>
            </div>
          ))}

          {/* New (unsaved) images */}
          {newFiles.map((file, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveNew(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={12} />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] bg-blue-600/80 text-white px-1.5 py-0.5 rounded">
                New
              </span>
            </div>
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <p className="text-xs text-slate-500">
          {totalCount} image{totalCount !== 1 ? 's' : ''} total
          {newFiles.length > 0 && ` · ${newFiles.length} pending upload`}
        </p>
      )}
    </div>
  )
}
