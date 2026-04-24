export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG'
export type Transmission = 'Automatic' | 'Manual'
export type Condition = 'New' | 'Used' | 'Certified Pre-Owned'
export type BodyType = 'Sedan' | 'Hatchback' | 'SUV' | 'Pickup' | 'Van' | 'Coupe' | 'Convertible' | 'Wagon' | 'Minivan'

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
  bodyType: BodyType | ''
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
  bodyType?: string
  brand?: string
  showSold?: boolean
}

export interface DashboardStats {
  total: number
  sold: number
  active: number
  recentCars: Car[]
}

export type MessageStatus = 'unread' | 'read' | 'replied'
export type InquiryStatus = 'new' | 'contacted' | 'listed' | 'closed'

export interface ContactMessage {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  email: string
  subject: string
  message: string
  status: MessageStatus
}

export interface SellInquiry {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  phone: string
  email: string
  carDetails: string
  message: string
  status: InquiryStatus
}

export type GuideCategory = 'Buying Guides' | 'Finance & Costs' | 'Car Care & Maintenance' | 'Selling Your Car'

export interface GuideArticle {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  category: GuideCategory
  excerpt: string
  content: string
  coverImageId: string
  readTime: string
  published: boolean
  slug: string
}

export type GuideArticleFormData = Omit<GuideArticle, '$id' | '$createdAt' | '$updatedAt'>

