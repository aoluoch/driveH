import { ID, Query } from 'appwrite'
import { databases, appwriteConfig } from './appwrite'
import type { ContactMessage, SellInquiry, MessageStatus, InquiryStatus } from '../types'

const { databaseId } = appwriteConfig

// ── Contact Messages ───────────────────────────────────────────────────────────

export async function createContactMessage(
  data: Pick<ContactMessage, 'name' | 'email' | 'subject' | 'message'>,
): Promise<ContactMessage> {
  const doc = await databases.createDocument(
    databaseId,
    appwriteConfig.contactMessagesCollectionId,
    ID.unique(),
    { ...data, status: 'unread' },
  )
  return doc as unknown as ContactMessage
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const response = await databases.listDocuments(
    databaseId,
    appwriteConfig.contactMessagesCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)],
  )
  return response.documents as unknown as ContactMessage[]
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<ContactMessage> {
  const doc = await databases.updateDocument(
    databaseId,
    appwriteConfig.contactMessagesCollectionId,
    id,
    { status },
  )
  return doc as unknown as ContactMessage
}

export async function deleteContactMessage(id: string): Promise<void> {
  await databases.deleteDocument(databaseId, appwriteConfig.contactMessagesCollectionId, id)
}

// ── Sell Inquiries ─────────────────────────────────────────────────────────────

export async function createSellInquiry(
  data: Pick<SellInquiry, 'name' | 'phone' | 'email' | 'carDetails' | 'message'>,
): Promise<SellInquiry> {
  const doc = await databases.createDocument(
    databaseId,
    appwriteConfig.sellInquiriesCollectionId,
    ID.unique(),
    { ...data, status: 'new' },
  )
  return doc as unknown as SellInquiry
}

export async function listSellInquiries(): Promise<SellInquiry[]> {
  const response = await databases.listDocuments(
    databaseId,
    appwriteConfig.sellInquiriesCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)],
  )
  return response.documents as unknown as SellInquiry[]
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<SellInquiry> {
  const doc = await databases.updateDocument(
    databaseId,
    appwriteConfig.sellInquiriesCollectionId,
    id,
    { status },
  )
  return doc as unknown as SellInquiry
}

export async function deleteSellInquiry(id: string): Promise<void> {
  await databases.deleteDocument(databaseId, appwriteConfig.sellInquiriesCollectionId, id)
}

// ── Inbox stats ────────────────────────────────────────────────────────────────

export async function getInboxStats(): Promise<{
  totalMessages: number
  unreadMessages: number
  totalInquiries: number
  newInquiries: number
}> {
  const [messagesRes, unreadRes, inquiriesRes, newInquiriesRes] = await Promise.all([
    databases.listDocuments(databaseId, appwriteConfig.contactMessagesCollectionId, [Query.limit(1)]),
    databases.listDocuments(databaseId, appwriteConfig.contactMessagesCollectionId, [
      Query.equal('status', 'unread'),
      Query.limit(1),
    ]),
    databases.listDocuments(databaseId, appwriteConfig.sellInquiriesCollectionId, [Query.limit(1)]),
    databases.listDocuments(databaseId, appwriteConfig.sellInquiriesCollectionId, [
      Query.equal('status', 'new'),
      Query.limit(1),
    ]),
  ])
  return {
    totalMessages: messagesRes.total,
    unreadMessages: unreadRes.total,
    totalInquiries: inquiriesRes.total,
    newInquiries: newInquiriesRes.total,
  }
}
