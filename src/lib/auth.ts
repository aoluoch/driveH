import { ID } from 'appwrite'
import { account } from './appwrite'
import type { Models } from 'appwrite'

export type AppUser = Models.User<Models.Preferences>

export async function loginAdmin(email: string, password: string): Promise<AppUser> {
  await account.createEmailPasswordSession(email, password)
  return account.get()
}

export async function registerUser(name: string, email: string, password: string): Promise<AppUser> {
  await account.create(ID.unique(), email, password, name)
  await account.createEmailPasswordSession(email, password)
  return account.get()
}

export async function logoutAdmin(): Promise<void> {
  await account.deleteSession('current')
}

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    return await account.get()
  } catch {
    return null
  }
}

export function checkIsAdmin(user: AppUser | null): boolean {
  if (!user) return false
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined
  if (adminEmail && adminEmail.trim()) {
    return user.email === adminEmail.trim()
  }
  return true
}
