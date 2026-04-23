import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Car,
  CheckCircle,
  Loader2,
  PlusCircle,
  Tag,
  TrendingUp,
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import CarCard from '../../components/cars/CarCard'
import SearchFilter from '../../components/cars/SearchFilter'
import { listCars, deleteCar, toggleSoldStatus, getDashboardStats } from '../../lib/cars'
import type { Car as CarType, CarFilters, DashboardStats } from '../../types'

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className={`rounded-2xl p-5 text-white ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <div className="opacity-80">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [cars, setCars] = useState<CarType[]>([])
  const [filters, setFilters] = useState<CarFilters>({ showSold: true })
  const [loading, setLoading] = useState(true)
  const [carsLoading, setCarsLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setCarsLoading(true)
    listCars(filters)
      .then(setCars)
      .finally(() => setCarsLoading(false))
  }, [filters])

  async function handleDelete(id: string) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    await deleteCar(id)
    setCars((prev) => prev.filter((c) => c.$id !== id))
    setStats((s) => s ? { ...s, total: s.total - 1, active: s.active - 1 } : s)
    setDeleteConfirm(null)
  }

  async function handleToggleSold(id: string, isSold: boolean) {
    const updated = await toggleSoldStatus(id, isSold)
    setCars((prev) => prev.map((c) => (c.$id === id ? updated : c)))
    setStats((s) =>
      s
        ? {
            ...s,
            sold: isSold ? s.sold + 1 : s.sold - 1,
            active: isSold ? s.active - 1 : s.active + 1,
          }
        : s,
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your DriveHub listings</p>
          </div>
          <Link
            to="/admin/cars/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            Add Car
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading stats…</span>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Car size={20} />}
              label="Total Listings"
              value={stats.total}
              color="bg-gradient-to-br from-blue-600 to-blue-700"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Active Listings"
              value={stats.active}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={<Tag size={20} />}
              label="Cars Sold"
              value={stats.sold}
              color="bg-gradient-to-br from-orange-500 to-red-500"
            />
          </div>
        ) : null}

        {/* Filter + listing management */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">All Listings</h2>
            {deleteConfirm && (
              <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                Click delete again to confirm
              </p>
            )}
          </div>

          <SearchFilter
            filters={filters}
            onChange={setFilters}
            showSoldToggle
          />

          {carsLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 size={30} className="animate-spin text-blue-600" />
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <CheckCircle size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">No cars found</p>
              <p className="text-sm text-slate-400 mt-1 mb-5">Add your first listing to get started</p>
              <Link
                to="/admin/cars/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                <PlusCircle size={15} />
                Add First Car
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cars.map((car) => (
                <div key={car.$id} className="relative">
                  {deleteConfirm === car.$id && (
                    <div className="absolute inset-0 bg-red-600/10 border-2 border-red-500 rounded-2xl z-10 flex items-center justify-center pointer-events-none">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                        Click delete again to confirm
                      </span>
                    </div>
                  )}
                  <CarCard
                    car={car}
                    isAdmin
                    onEdit={(id) => navigate(`/admin/cars/${id}/edit`)}
                    onDelete={handleDelete}
                    onToggleSold={handleToggleSold}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
