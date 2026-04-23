import { Link } from 'react-router-dom'
import { Car as CarIcon, Fuel, Gauge, Heart, MapPin, Pencil, Settings2, Trash2 } from 'lucide-react'
import type { Car } from '../../types'
import { getCarImageUrl } from '../../lib/cars'
import { useFavourites } from '../../context/FavouritesContext'

interface CarCardProps {
  car: Car
  isAdmin?: boolean
  variant?: 'grid' | 'horizontal'
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleSold?: (id: string, isSold: boolean) => void
}

function conditionBadge(condition: string) {
  if (condition === 'New') return 'bg-emerald-100 text-emerald-700'
  if (condition === 'Certified Pre-Owned') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-600'
}

export default function CarCard({ car, isAdmin, variant = 'grid', onEdit, onDelete, onToggleSold }: CarCardProps) {
  const { toggle, isFavourite } = useFavourites()
  const saved = isFavourite(car.$id)

  const imageUrl =
    car.images.length > 0
      ? getCarImageUrl(car.images[0], 600)
      : 'https://placehold.co/600x400/f5f5f5/aaaaaa?text=No+Image'

  const specs = [
    car.bodyType && { icon: <CarIcon size={12} />, label: car.bodyType },
    car.fuelType && { icon: <Fuel size={12} />, label: car.fuelType },
    car.transmission && { icon: <Settings2 size={12} />, label: car.transmission },
    car.mileage > 0 && { icon: <Gauge size={12} />, label: `${car.mileage.toLocaleString()} km` },
    car.location && { icon: <MapPin size={12} />, label: car.location },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[]

  /* ── Horizontal variant (listings page) ── */
  if (variant === 'horizontal') {
    return (
      <article className="bg-white rounded-xl border border-gray-200 hover:border-[#FF5400] hover:shadow-md transition-all duration-200 flex overflow-hidden group">
        {/* Image */}
        <Link to={`/cars/${car.$id}`} className="relative flex-shrink-0 w-56 sm:w-64 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {car.isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white font-black text-lg px-6 py-1.5 rounded tracking-widest rotate-[-12deg]">SOLD</span>
            </div>
          )}
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-semibold ${conditionBadge(car.condition)}`}>
            {car.condition}
          </span>
        </Link>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link to={`/cars/${car.$id}`} className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-base leading-snug hover:text-[#FF5400] transition-colors line-clamp-1">
                  {car.title}
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">{car.brand} {car.model} · {car.year}</p>
              </Link>
              {!isAdmin && (
                <button
                  onClick={(e) => { e.preventDefault(); toggle(car.$id) }}
                  className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${saved ? 'text-[#FF5400]' : 'text-gray-300 hover:text-[#FF5400]'}`}
                  title={saved ? 'Remove from saved' : 'Save car'}
                >
                  <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            <p className="text-[#FF5400] font-bold text-xl mt-2">
              KSh {car.price.toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {specs.map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="text-gray-400">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {isAdmin ? (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => onEdit?.(car.$id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg font-medium transition-colors">
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => onToggleSold?.(car.$id, !car.isSold)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${car.isSold ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
              >
                {car.isSold ? 'Mark Active' : 'Mark Sold'}
              </button>
              <button onClick={() => onDelete?.(car.$id)} className="px-2.5 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <Link
              to={`/cars/${car.$id}`}
              className="mt-3 self-start px-5 py-2 bg-[#FF5400] hover:bg-[#e04a00] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              View Details →
            </Link>
          )}
        </div>
      </article>
    )
  }

  /* ── Grid variant (default) ── */
  return (
    <article className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#FF5400] hover:shadow-lg transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {car.isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-2xl px-8 py-2 rounded tracking-widest rotate-[-12deg] shadow-xl">SOLD</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded text-xs font-semibold ${conditionBadge(car.condition)}`}>
          {car.condition}
        </span>
        {!isAdmin && (
          <button
            onClick={(e) => { e.preventDefault(); toggle(car.$id) }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors shadow-sm ${saved ? 'text-[#FF5400]' : 'text-gray-400 hover:text-[#FF5400]'}`}
            title={saved ? 'Remove from saved' : 'Save'}
          >
            <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5 line-clamp-1">{car.title}</h3>
          <p className="text-gray-500 text-xs mb-2">{car.brand} {car.model} · {car.year}</p>
          <p className="text-[#FF5400] font-bold text-lg mb-2">KSh {car.price.toLocaleString()}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            {specs.slice(0, 3).map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className="text-gray-400">{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>

        {isAdmin ? (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <button onClick={() => onEdit?.(car.$id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg font-medium transition-colors">
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={() => onToggleSold?.(car.$id, !car.isSold)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${car.isSold ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}
            >
              {car.isSold ? 'Active' : 'Sold'}
            </button>
            <button onClick={() => onDelete?.(car.$id)} className="px-2.5 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <Link
            to={`/cars/${car.$id}`}
            className="mt-3 block w-full text-center py-2.5 bg-[#FF5400] hover:bg-[#e04a00] text-white rounded-lg font-semibold text-sm transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  )
}
