import { useEffect, useState } from 'react'
import { Car as CarIcon, Loader2, SearchX } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CarCard from '../components/cars/CarCard'
import SearchFilter from '../components/cars/SearchFilter'
import { listCars } from '../lib/cars'
import type { Car, CarFilters } from '../types'

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CarFilters>({})

  useEffect(() => {
    setLoading(true)
    listCars(filters)
      .then(setCars)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CarIcon size={28} className="text-blue-400" />
            <span className="text-blue-400 font-medium text-sm tracking-widest uppercase">
              DriveHub Marketplace
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect <span className="text-blue-400">Drive</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Browse our curated selection of quality vehicles — new, used, and certified pre-owned.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SearchFilter filters={filters} onChange={setFilters} />

        {/* Results header */}
        {!loading && !error && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {cars.length === 0 ? 'No cars found' : `${cars.length} car${cars.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
            <p className="text-sm">Loading cars…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16 text-red-600 bg-red-50 rounded-2xl border border-red-100">
            <p className="font-medium">Failed to load cars</p>
            <p className="text-sm mt-1 text-red-500">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && cars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <SearchX size={48} className="mb-4 text-slate-300" />
            <p className="font-medium text-slate-600">No cars match your search</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Car grid */}
        {!loading && !error && cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard key={car.$id} car={car} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
