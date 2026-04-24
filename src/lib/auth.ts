import { ID } from 'appwrite'
import { account } from './appwrite'
import type { Models } from 'appwrite'

export type AppUser = Models.User<Models.Preferences>

export async function loginUser(email: string, password: string): Promise<AppUser> {
  await account.createEmailPasswordSession(email, password)
  const user = await account.get()
  if (!user.emailVerification) {
    // Resend verification link and block the session so the user must verify first
    const verifyUrl = `${window.location.origin}/verify-email`
    try { await account.createVerification(verifyUrl) } catch { /* ignore duplicate-send errors */ }
    await account.deleteSession('current')
    throw new Error('email_not_verified')
  }
  return user
}

export async function registerUser(name: string, email: string, password: string): Promise<void> {
  // 1. Create the Appwrite account
  await account.create(ID.unique(), email, password, name)
  // 2. Open a temporary session to set preferences and send the verification email
  await account.createEmailPasswordSession(email, password)
  // 3. Tag the account with role 'user' (admins are identified by VITE_ADMIN_EMAIL)
  await account.updatePrefs({ role: 'user' })
  // 4. Send verification email — user must click the link before they can log in
  const verifyUrl = `${window.location.origin}/verify-email`
  await account.createVerification(verifyUrl)
  // 5. End the temporary session — no active session until email is verified
  await account.deleteSession('current')
}

export async function verifyEmail(userId: string, secret: string): Promise<void> {
  await account.updateVerification(userId, secret)
}

export async function createPasswordRecovery(email: string): Promise<void> {
  const recoveryUrl = `${window.location.origin}/reset-password`
  await account.createRecovery(email, recoveryUrl)
}

export async function updatePasswordRecovery(userId: string, secret: string, newPassword: string): Promise<void> {
  await account.updateRecovery(userId, secret, newPassword)
}

export async function logoutUser(): Promise<void> {
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
