import { Link } from 'react-router-dom'
import { Fuel, Gauge, MapPin, Pencil, Settings2, Trash2 } from 'lucide-react'
import type { Car } from '../../types'
import { getCarImageUrl } from '../../lib/cars'

interface CarCardProps {
  car: Car
  isAdmin?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleSold?: (id: string, isSold: boolean) => void
}

export default function CarCard({ car, isAdmin, onEdit, onDelete, onToggleSold }: CarCardProps) {
  const imageUrl =
    car.images.length > 0
      ? getCarImageUrl(car.images[0], 600)
      : 'https://placehold.co/600x400/1e293b/64748b?text=No+Image'

  const conditionColor =
    car.condition === 'New'
      ? 'bg-emerald-100 text-emerald-700'
      : car.condition === 'Certified Pre-Owned'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-slate-100 text-slate-600'

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Sold overlay */}
        {car.isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-2xl px-8 py-2 rounded-sm tracking-widest shadow-xl rotate-[-12deg]">
              SOLD
            </span>
          </div>
        )}
        {/* Condition badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold ${conditionColor}`}
        >
          {car.condition}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-base leading-snug mb-0.5 line-clamp-1">
            {car.title}
          </h3>
          <p className="text-slate-500 text-sm mb-3">
            {car.brand} {car.model} · {car.year}
          </p>

          <p className="text-blue-600 font-bold text-xl mb-3">
            KSh {car.price.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <Fuel size={12} className="text-slate-400" />
              {car.fuelType}
            </span>
            <span className="flex items-center gap-1">
              <Settings2 size={12} className="text-slate-400" />
              {car.transmission}
            </span>
            {car.mileage > 0 && (
              <span className="flex items-center gap-1">
                <Gauge size={12} className="text-slate-400" />
                {car.mileage.toLocaleString()} km
              </span>
            )}
            {car.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                {car.location}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {isAdmin ? (
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onEdit?.(car.$id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg font-medium transition-colors"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => onToggleSold?.(car.$id, !car.isSold)}
              className={`flex-1 py-2 text-xs rounded-lg font-medium transition-colors ${
                car.isSold
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              {car.isSold ? 'Mark Active' : 'Mark Sold'}
            </button>
            <button
              onClick={() => onDelete?.(car.$id)}
              className="px-3 py-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <Link
            to={`/cars/${car.$id}`}
            className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  )
}
