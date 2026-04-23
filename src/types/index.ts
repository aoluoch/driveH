export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG'
export type Transmission = 'Automatic' | 'Manual'
export type Condition = 'New' | 'Used' | 'Certified Pre-Owned'

export interface Car {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: FuelType
  transmission: Transmission
  engine: string
  condition: Condition
  description: string
  location: string
  images: string[]
  isSold: boolean
  features: string[]
}

export type CarFormData = Omit<Car, '$id' | '$createdAt' | '$updatedAt'>

export interface CarFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuelType?: string
  transmission?: string
  condition?: string
  showSold?: boolean
}

export interface DashboardStats {
  total: number
  sold: number
  active: number
  recentCars: Car[]
}

export interface AIGeneratedCar {
  title: string
  brand: string
  model: string
  year: number
  fuelType: string
  transmission: string
  engine: string
  condition: string
  description: string
  features: string[]
}
