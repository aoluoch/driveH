import { useState } from 'react'
import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import type { CarFilters } from '../../types'

interface SearchFilterProps {
  filters: CarFilters
  onChange: (filters: CarFilters) => void
  showSoldToggle?: boolean
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']
const TRANSMISSIONS = ['Automatic', 'Manual']
const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned']

export default function SearchFilter({ filters, onChange, showSoldToggle }: SearchFilterProps) {
  const [expanded, setExpanded] = useState(false)

  function set(patch: Partial<CarFilters>) {
    onChange({ ...filters, ...patch })
  }

  function reset() {
    onChange({ showSold: filters.showSold })
  }

  const hasActiveFilters = !!(
    filters.search ||
    filters.fuelType ||
    filters.transmission ||
    filters.condition ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minYear ||
    filters.maxYear
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      {/* Search + toggle row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, brand, model, location…"
            value={filters.search ?? ''}
            onChange={(e) => set({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-xl border font-medium transition-colors ${
            expanded || hasActiveFilters
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">
              !
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Reset filters"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Fuel Type</label>
            <select
              value={filters.fuelType ?? ''}
              onChange={(e) => set({ fuelType: e.target.value || undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Transmission</label>
            <select
              value={filters.transmission ?? ''}
              onChange={(e) => set({ transmission: e.target.value || undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Condition</label>
            <select
              value={filters.condition ?? ''}
              onChange={(e) => set({ condition: e.target.value || undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Min Price (KSh)</label>
            <input
              type="number"
              placeholder="0"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) => set({ minPrice: e.target.value ? +e.target.value : undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Price (KSh)</label>
            <input
              type="number"
              placeholder="Any"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) => set({ maxPrice: e.target.value ? +e.target.value : undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Min Year */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Min Year</label>
            <input
              type="number"
              placeholder="1990"
              min={1900}
              max={2030}
              value={filters.minYear ?? ''}
              onChange={(e) => set({ minYear: e.target.value ? +e.target.value : undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Year */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Year</label>
            <input
              type="number"
              placeholder={String(new Date().getFullYear())}
              min={1900}
              max={2030}
              value={filters.maxYear ?? ''}
              onChange={(e) => set({ maxYear: e.target.value ? +e.target.value : undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Show Sold */}
          {showSoldToggle && (
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={filters.showSold ?? false}
                  onChange={(e) => set({ showSold: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                Show Sold Cars
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
