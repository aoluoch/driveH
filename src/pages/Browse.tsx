import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Filter, Loader2, RotateCcw, SearchX, SlidersHorizontal, X } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CarCard from '../components/cars/CarCard'
import CarBrandLogo from '../components/cars/CarBrandLogo'
import { listCars } from '../lib/cars'
import type { Car as CarType, CarFilters } from '../types'

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']
const TRANSMISSIONS = ['Automatic', 'Manual']
const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned']
const BODY_TYPES = ['Sedan', 'Hatchback', 'SUV', 'Pickup', 'Van', 'Coupe', 'Convertible', 'Wagon', 'Minivan']
const POPULAR_BRANDS = [
  'Toyota', 'Honda', 'BMW', 'Mercedes', 'Ford', 'Nissan', 'Volkswagen', 'Subaru',
  'Audi', 'Mazda', 'Hyundai', 'Kia', 'Porsche', 'Volvo', 'Lexus', 'Mitsubishi',
  'Jeep', 'Land Rover', 'Tesla', 'Ferrari', 'Lamborghini', 'Jaguar', 'Maserati',
  'Bentley', 'Rolls-Royce', 'McLaren', 'Aston Martin', 'Mini', 'Polestar',
  'Chevrolet', 'Dodge', 'Cadillac', 'Infiniti', 'Acura', 'Genesis', 'Fiat',
  'Alfa Romeo', 'Lincoln', 'GMC', 'RAM',
]
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]
const PRICE_RANGES = [
  { label: 'Under KSh 500K', max: 500000 },
  { label: 'KSh 500K – 1M', min: 500000, max: 1000000 },
  { label: 'KSh 1M – 2M', min: 1000000, max: 2000000 },
  { label: 'KSh 2M – 5M', min: 2000000, max: 5000000 },
  { label: 'Over KSh 5M', min: 5000000 },
]

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-[#FF5400]"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [refetchTick, setRefetchTick] = useState(0)

  const [filters, setFilters] = useState<CarFilters>(() => ({
    search: searchParams.get('search') || undefined,
    condition: searchParams.get('condition') || undefined,
    fuelType: searchParams.get('fuel') || undefined,
    bodyType: searchParams.get('bodyType') || undefined,
    brand: searchParams.get('brand') || undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }))

  useEffect(() => {
    const onFocus = () => setRefetchTick((t) => t + 1)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    listCars(filters)
      .then((data) => {
        const sorted = [...data]
        if (sortBy === 'price_asc') sorted.sort((a, b) => a.price - b.price)
        else if (sortBy === 'price_desc') sorted.sort((a, b) => b.price - a.price)
        setCars(sorted)
      })
      .finally(() => setLoading(false))
  }, [filters, sortBy, refetchTick])

  function setFilter(patch: Partial<CarFilters>) {
    setFilters((f) => ({ ...f, ...patch }))
  }

  function resetFilters() {
    setFilters({})
    setSearchParams({})
  }

  const activeFilterCount = [
    filters.search,
    filters.fuelType,
    filters.transmission,
    filters.condition,
    filters.bodyType,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.minYear,
    filters.maxYear,
  ].filter(Boolean).length

  /* ── Sidebar content ── */
  const sidebarContent = (
    <div className="space-y-0 divide-y divide-gray-100">
      {/* Keyword search */}
      <div className="pb-4">
        <input
          type="text"
          placeholder="Brand, model, keyword…"
          value={filters.search ?? ''}
          onChange={(e) => setFilter({ search: e.target.value || undefined })}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5400] focus:border-transparent"
        />
      </div>

      <FilterSection title="Brand">
        <div className="space-y-2">
          {POPULAR_BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === b}
                onChange={() => setFilter({ brand: filters.brand === b ? undefined : b })}
                className="w-4 h-4 accent-[#FF5400]"
              />
              <CarBrandLogo brand={b} size={20} className="flex-shrink-0" aria-label={b} />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5400]">{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Body Type">
        <div className="space-y-2">
          {BODY_TYPES.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="bodyType"
                checked={filters.bodyType === b}
                onChange={() => setFilter({ bodyType: filters.bodyType === b ? undefined : b })}
                className="w-4 h-4 accent-[#FF5400]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5400]">{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Condition">
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                checked={filters.condition === c}
                onChange={() => setFilter({ condition: filters.condition === c ? undefined : c })}
                className="w-4 h-4 accent-[#FF5400]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5400]">{c}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2">
          {PRICE_RANGES.map(({ label, min, max }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === min && filters.maxPrice === max}
                onChange={() => setFilter({ minPrice: min, maxPrice: max })}
                className="w-4 h-4 accent-[#FF5400]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5400]">{label}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min KSh"
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter({ minPrice: e.target.value ? +e.target.value : undefined })}
            className="px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
          />
          <input
            type="number"
            placeholder="Max KSh"
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter({ maxPrice: e.target.value ? +e.target.value : undefined })}
            className="px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
          />
        </div>
      </FilterSection>

      <FilterSection title="Fuel Type">
        <div className="space-y-2">
          {FUEL_TYPES.map((f) => (
            <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.fuelType === f}
                onChange={() => setFilter({ fuelType: filters.fuelType === f ? undefined : f })}
                className="w-4 h-4 accent-[#FF5400]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5400]">{f}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission">
        <div className="space-y-2">
          {TRANSMISSIONS.map((t) => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.transmission === t}
                onChange={() => setFilter({ transmission: filters.transmission === t ? undefined : t })}
                className="w-4 h-4 accent-[#FF5400]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5400]">{t}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Year Range" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="From"
            min={1990}
            max={2030}
            value={filters.minYear ?? ''}
            onChange={(e) => setFilter({ minYear: e.target.value ? +e.target.value : undefined })}
            className="px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
          />
          <input
            type="number"
            placeholder="To"
            min={1990}
            max={2030}
            value={filters.maxYear ?? ''}
            onChange={(e) => setFilter({ maxYear: e.target.value ? +e.target.value : undefined })}
            className="px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
          />
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Browse Cars</h1>
          <p className="text-gray-500 text-sm mt-0.5">Find your perfect vehicle from our full inventory</p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#FF5400]" />
                  <span className="font-bold text-gray-900 text-sm">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-[#FF5400] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-[#FF5400] flex items-center gap-1">
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>
              {sidebarContent}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-[#FF5400] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <p className="text-sm text-gray-600">
                  {loading ? 'Loading…' : <><span className="font-bold text-gray-900">{cars.length}</span> cars found</>}
                </p>

                {/* Active filter chips */}
                {filters.search && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-[#FF5400]/30 text-[#FF5400] text-xs rounded-full font-medium">
                    "{filters.search}"
                    <button onClick={() => setFilter({ search: undefined })}><X size={11} /></button>
                  </span>
                )}
                {filters.condition && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-[#FF5400]/30 text-[#FF5400] text-xs rounded-full font-medium">
                    {filters.condition}
                    <button onClick={() => setFilter({ condition: undefined })}><X size={11} /></button>
                  </span>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5400] bg-white text-gray-700"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 size={36} className="animate-spin text-[#FF5400] mb-3" />
                <p className="text-sm text-gray-500">Finding your perfect car…</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-xl border border-gray-200">
                <SearchX size={48} className="mb-4 text-gray-300" />
                <p className="font-semibold text-gray-700 text-lg">No cars match your filters</p>
                <p className="text-sm mt-1 mb-5">Try adjusting or resetting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#FF5400] text-white rounded-lg font-semibold text-sm hover:bg-[#e04a00] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cars.map((car) => (
                  <CarCard key={car.$id} car={car} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#FF5400]" />
                <span className="font-bold text-gray-900">Filters</span>
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button onClick={() => { resetFilters(); setSidebarOpen(false) }} className="text-xs text-gray-500 hover:text-[#FF5400]">
                    Reset all
                  </button>
                )}
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500 hover:text-gray-800">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-5">{sidebarContent}</div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full py-3 bg-[#FF5400] text-white font-bold rounded-xl"
              >
                Show {cars.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
