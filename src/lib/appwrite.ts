import { Account, Client, Databases, Functions, Storage } from 'appwrite'

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `Missing required env var ${key}. Add it to .env (Vite requires client env vars to start with VITE_).`,
    )
  }
  return value
}

export const appwriteConfig = {
  endpoint: requireEnv('VITE_APPWRITE_ENDPOINT'),
  projectId: requireEnv('VITE_APPWRITE_PROJECT_ID'),
  databaseId: requireEnv('VITE_APPWRITE_DATABASE_ID'),
  bucketId: requireEnv('VITE_APPWRITE_BUCKET_ID'),
  // Set after running: npm run setup
  carsCollectionId: (import.meta.env.VITE_APPWRITE_CARS_COLLECTION_ID as string) ?? '',
  contactMessagesCollectionId: (import.meta.env.VITE_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID as string) ?? '',
  sellInquiriesCollectionId: (import.meta.env.VITE_APPWRITE_SELL_INQUIRIES_COLLECTION_ID as string) ?? '',
  guideArticlesCollectionId: (import.meta.env.VITE_APPWRITE_GUIDE_ARTICLES_COLLECTION_ID as string) ?? '',
}

export const appwriteClient = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)

export const account = new Account(appwriteClient)
export const databases = new Databases(appwriteClient)
export const storage = new Storage(appwriteClient)
export const functions = new Functions(appwriteClient)
