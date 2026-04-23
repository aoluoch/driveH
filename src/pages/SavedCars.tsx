import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Loader2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CarCard from '../components/cars/CarCard'
import { getCar } from '../lib/cars'
import { useFavourites } from '../context/FavouritesContext'
import type { Car } from '../types'

export default function SavedCars() {
  const { favourites, toggle } = useFavourites()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favourites.length === 0) {
      setCars([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.allSettled(favourites.map((id) => getCar(id)))
      .then((results) => {
        const loaded = results
          .filter((r): r is PromiseFulfilledResult<Car> => r.status === 'fulfilled')
          .map((r) => r.value)
        setCars(loaded)
      })
      .finally(() => setLoading(false))
  }, [favourites])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5400]/10 text-[#FF5400] rounded-xl flex items-center justify-center">
              <Heart size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Cars</h1>
              <p className="text-gray-500 text-sm">
                {favourites.length === 0 ? 'No saved cars yet' : `${favourites.length} saved car${favourites.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-[#FF5400] mb-3" />
            <p className="text-sm text-gray-500">Loading your saved cars…</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <Heart size={36} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No saved cars yet</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm">
              Browse our listings and tap the heart icon on any car to save it here for later.
            </p>
            <Link
              to="/cars"
              className="px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{cars.length}</span> saved {cars.length === 1 ? 'car' : 'cars'}
              </p>
              <button
                onClick={() => cars.forEach((c) => toggle(c.$id))}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-3">
              {cars.map((car) => (
                <CarCard key={car.$id} car={car} variant="horizontal" />
              ))}
            </div>

            <div className="pt-6 text-center">
              <Link to="/cars" className="text-sm font-semibold text-[#FF5400] hover:underline">
                ← Continue browsing
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
