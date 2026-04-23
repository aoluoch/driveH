import { ID, Query } from 'appwrite'
import { databases, storage, appwriteConfig } from './appwrite'
import type { Car, CarFormData, CarFilters } from '../types'

const { databaseId, carsCollectionId, bucketId, endpoint, projectId } = appwriteConfig

// ── Image helpers ─────────────────────────────────────────────────────────────

export function getCarImageUrl(fileId: string, width = 800): string {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}&width=${width}&quality=80`
}

export function getCarImageViewUrl(fileId: string): string {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`
}

export async function uploadCarImage(file: File): Promise<string> {
  const result = await storage.createFile(bucketId, ID.unique(), file)
  return result.$id
}

export async function deleteCarImage(fileId: string): Promise<void> {
  await storage.deleteFile(bucketId, fileId)
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function listCars(filters: CarFilters = {}): Promise<Car[]> {
  const queries: string[] = [Query.orderDesc('$createdAt'), Query.limit(100)]

  if (!filters.showSold) {
    queries.push(Query.equal('isSold', false))
  }
  if (filters.fuelType)     queries.push(Query.equal('fuelType', filters.fuelType))
  if (filters.transmission) queries.push(Query.equal('transmission', filters.transmission))
  if (filters.condition)    queries.push(Query.equal('condition', filters.condition))
  if (filters.minPrice !== undefined) queries.push(Query.greaterThanEqual('price', filters.minPrice))
  if (filters.maxPrice !== undefined) queries.push(Query.lessThanEqual('price', filters.maxPrice))
  if (filters.minYear !== undefined)  queries.push(Query.greaterThanEqual('year', filters.minYear))
  if (filters.maxYear !== undefined)  queries.push(Query.lessThanEqual('year', filters.maxYear))

  const response = await databases.listDocuments(databaseId, carsCollectionId, queries)
  let cars = response.documents as unknown as Car[]

  if (filters.search) {
    const term = filters.search.toLowerCase()
    cars = cars.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.brand.toLowerCase().includes(term) ||
        c.model.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term),
    )
  }

  return cars
}

export async function getCar(id: string): Promise<Car> {
  const doc = await databases.getDocument(databaseId, carsCollectionId, id)
  return doc as unknown as Car
}

export async function createCar(data: CarFormData): Promise<Car> {
  const doc = await databases.createDocument(databaseId, carsCollectionId, ID.unique(), data)
  return doc as unknown as Car
}

export async function updateCar(id: string, data: Partial<CarFormData>): Promise<Car> {
  const doc = await databases.updateDocument(databaseId, carsCollectionId, id, data)
  return doc as unknown as Car
}

export async function deleteCar(id: string): Promise<void> {
  await databases.deleteDocument(databaseId, carsCollectionId, id)
}

export async function toggleSoldStatus(id: string, isSold: boolean): Promise<Car> {
  return updateCar(id, { isSold })
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [allRes, soldRes, recentRes] = await Promise.all([
    databases.listDocuments(databaseId, carsCollectionId, [Query.limit(1)]),
    databases.listDocuments(databaseId, carsCollectionId, [
      Query.equal('isSold', true),
      Query.limit(1),
    ]),
    databases.listDocuments(databaseId, carsCollectionId, [
      Query.orderDesc('$createdAt'),
      Query.limit(6),
    ]),
  ])

  return {
    total: allRes.total,
    sold: soldRes.total,
    active: allRes.total - soldRes.total,
    recentCars: recentRes.documents as unknown as Car[],
  }
}
