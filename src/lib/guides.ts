import { ID, Permission, Role, Query } from 'appwrite'
import { databases, storage, appwriteConfig } from './appwrite'
import { compressImage } from './imageUtils'
import type { GuideArticle, GuideArticleFormData, GuideCategory } from '../types'

const { databaseId, bucketId, endpoint, projectId } = appwriteConfig

function collectionId(): string {
  const id = appwriteConfig.guideArticlesCollectionId
  if (!id) throw new Error('GuideArticles collection not configured. Run `npm run setup` and add VITE_APPWRITE_GUIDE_ARTICLES_COLLECTION_ID to .env.')
  return id
}

// ── Image helpers ─────────────────────────────────────────────────────────────

export function getGuideImageUrl(fileId: string, width = 800): string {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}&width=${width}&quality=80`
}

export async function uploadGuideImage(file: File): Promise<string> {
  const compressed = await compressImage(file)
  const result = await storage.createFile(
    bucketId,
    ID.unique(),
    compressed,
    [Permission.read(Role.any()), Permission.delete(Role.users())],
  )
  return result.$id
}

export async function deleteGuideImage(fileId: string): Promise<void> {
  await storage.deleteFile(bucketId, fileId)
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function listGuides(category?: GuideCategory, onlyPublished = true): Promise<GuideArticle[]> {
  const queries: string[] = [Query.orderDesc('$createdAt'), Query.limit(200)]
  if (onlyPublished) queries.push(Query.equal('published', true))
  if (category) queries.push(Query.equal('category', category))
  const response = await databases.listDocuments(databaseId, collectionId(), queries)
  return response.documents as unknown as GuideArticle[]
}

export async function listAllGuides(): Promise<GuideArticle[]> {
  const response = await databases.listDocuments(databaseId, collectionId(), [
    Query.orderDesc('$createdAt'),
    Query.limit(200),
  ])
  return response.documents as unknown as GuideArticle[]
}

export async function getGuide(id: string): Promise<GuideArticle> {
  const doc = await databases.getDocument(databaseId, collectionId(), id)
  return doc as unknown as GuideArticle
}

export async function createGuide(data: GuideArticleFormData): Promise<GuideArticle> {
  const doc = await databases.createDocument(databaseId, collectionId(), ID.unique(), data)
  return doc as unknown as GuideArticle
}

export async function updateGuide(id: string, data: Partial<GuideArticleFormData>): Promise<GuideArticle> {
  const doc = await databases.updateDocument(databaseId, collectionId(), id, data)
  return doc as unknown as GuideArticle
}

export async function deleteGuide(id: string): Promise<void> {
  await databases.deleteDocument(databaseId, collectionId(), id)
}

export async function toggleGuidePublished(id: string, published: boolean): Promise<GuideArticle> {
  return updateGuide(id, { published })
}
