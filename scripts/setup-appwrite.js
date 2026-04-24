/**
 * DriveHub – Appwrite Database Setup Script
 * Usage: node scripts/setup-appwrite.js
 *
 * Prerequisites:
 *   1. Fill in APPWRITE_API_KEY in .env (create a server API key in your Appwrite console
 *      with Databases Read + Write scopes).
 *   2. Optionally set VITE_APPWRITE_CARS_COLLECTION_ID if you want to reuse an existing
 *      collection (all its attributes will be deleted and recreated).
 *   3. Run: node scripts/setup-appwrite.js
 *   4. Copy the printed collection ID into VITE_APPWRITE_CARS_COLLECTION_ID in .env.
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite'
import { readFileSync } from 'fs'

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadEnv() {
  const content = readFileSync('.env', 'utf-8')
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function retry(fn, label = '', attempts = 5, baseDelayMs = 1000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      const isLast = i === attempts
      const transient = e.message?.includes('fetch failed') || e.message?.includes('ECONNRESET') || e.message?.includes('timeout')
      if (isLast || !transient) throw e
      const wait = baseDelayMs * 2 ** (i - 1)
      console.log(`  ↻  ${label} — retrying in ${wait}ms (attempt ${i}/${attempts}): ${e.message}`)
      await sleep(wait)
    }
  }
}

// ── Config ────────────────────────────────────────────────────────────────────

const env = loadEnv()

const ENDPOINT    = env.VITE_APPWRITE_ENDPOINT
const PROJECT_ID  = env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = env.VITE_APPWRITE_DATABASE_ID
const API_KEY     = env.APPWRITE_API_KEY
let   CARS_COLLECTION_ID     = env.VITE_APPWRITE_CARS_COLLECTION_ID     || ''
let   MESSAGES_COLLECTION_ID = env.VITE_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID || ''
let   INQUIRIES_COLLECTION_ID = env.VITE_APPWRITE_SELL_INQUIRIES_COLLECTION_ID  || ''
let   GUIDES_COLLECTION_ID    = env.VITE_APPWRITE_GUIDE_ARTICLES_COLLECTION_ID   || ''

if (!API_KEY) {
  console.error('❌  APPWRITE_API_KEY is not set in .env')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new Databases(client)
const storageClient = new Storage(client)

// ── Attribute helpers ─────────────────────────────────────────────────────────

async function runSteps(steps) {
  for (const step of steps) {
    try {
      const attr = await retry(step, 'attribute')
      console.log(`  ✔  ${attr.key}`)
    } catch (e) {
      console.error(`  ✖  Error: ${e.message}`)
    }
    await sleep(600)
  }
}

async function createCarsAttributes(collectionId) {
  await runSteps([
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'title',       255,  true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'brand',       100,  true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'model',       100,  true),
    () => databases.createIntegerAttribute(DATABASE_ID, collectionId, 'year',       true, 1900, 2030),
    () => databases.createFloatAttribute(DATABASE_ID, collectionId, 'price',        true, 0),
    () => databases.createIntegerAttribute(DATABASE_ID, collectionId, 'mileage',    false, 0),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'fuelType',
          ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'], true),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'transmission',
          ['Automatic', 'Manual'], true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'engine',      100,  false),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'condition',
          ['New', 'Used', 'Certified Pre-Owned'], true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'description', 5000, true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'location',    255,  true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'images',      255,  false, null, true),
    () => databases.createBooleanAttribute(DATABASE_ID, collectionId, 'isSold',     false, false),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'bodyType',
          ['Sedan', 'Hatchback', 'SUV', 'Pickup', 'Van', 'Coupe', 'Convertible', 'Wagon', 'Minivan'], false),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'features',    255,  false, null, true),
  ])
}

async function createContactMessagesAttributes(collectionId) {
  await runSteps([
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'name',    255, true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'email',   255, true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'subject', 255, true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'message', 5000, true),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'status',
          ['unread', 'read', 'replied'], false, 'unread'),
  ])
}

async function createSellInquiriesAttributes(collectionId) {
  await runSteps([
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'name',       255,  true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'phone',      50,   true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'email',      255,  false),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'carDetails', 500,  true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'message',    2000, false),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'status',
          ['new', 'contacted', 'listed', 'closed'], false, 'new'),
  ])
}

async function createGuideArticlesAttributes(collectionId) {
  await runSteps([
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'title',        255,    true),
    () => databases.createEnumAttribute(DATABASE_ID, collectionId, 'category',
          ['Buying Guides', 'Finance & Costs', 'Car Care & Maintenance', 'Selling Your Car'], true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'excerpt',      1000,   false, ''),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'content',      500000, true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'coverImageId', 255,    false, ''),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'readTime',     50,     false, ''),
    () => databases.createBooleanAttribute(DATABASE_ID, collectionId, 'published',   false,  true),
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'slug',         255,    false, ''),
  ])
}

// ── Generic collection setup ──────────────────────────────────────────────────

async function setupCollection({ existingId, name, permissions, createAttrsFn }) {
  let collectionId = existingId

  if (collectionId) {
    console.log(`\n📦  Updating existing "${name}" collection: ${collectionId}`)
    try {
      await retry(() => databases.updateCollection(DATABASE_ID, collectionId, name, permissions), 'updateCollection')
      console.log('  ✔  Permissions updated')
    } catch (e) {
      console.error('  ✖  Could not update permissions:', e.message)
    }

    let existing
    try {
      existing = await retry(() => databases.listAttributes(DATABASE_ID, collectionId), 'listAttributes')
    } catch (e) {
      console.error('  ✖  Could not fetch attributes:', e.message)
      return collectionId
    }

    if (existing.attributes.length > 0) {
      console.log(`🗑   Deleting ${existing.attributes.length} existing attribute(s)…`)
      for (const attr of existing.attributes) {
        try {
          await retry(() => databases.deleteAttribute(DATABASE_ID, collectionId, attr.key), `delete:${attr.key}`)
          console.log(`  ✔  Deleted: ${attr.key}`)
        } catch (e) {
          console.error(`  ✖  Could not delete ${attr.key}: ${e.message}`)
        }
        await sleep(600)
      }
      console.log('  ⏳  Waiting for deletions to propagate…')
      await sleep(3000)
    }
  } else {
    console.log(`\n📦  Creating new "${name}" collection…`)
    const col = await retry(() => databases.createCollection(DATABASE_ID, ID.unique(), name, permissions), 'createCollection')
    collectionId = col.$id
    console.log(`  ✔  Collection created: ${collectionId}`)
    await sleep(1000)
  }

  console.log(`🔧  Creating attributes for "${name}"…`)
  await createAttrsFn(collectionId)
  return collectionId
}

// ── Main ──────────────────────────────────────────────────────────────────────

const publicWriteAdminRead = [
  Permission.read(Role.users()),
  Permission.create(Role.any()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
]

const adminOnly = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
]

async function main() {
  console.log('\n🚗  DriveHub – Appwrite Setup\n')

  // ── Cars collection ──────────────────────────────────────────────────────────
  CARS_COLLECTION_ID = await setupCollection({
    existingId: CARS_COLLECTION_ID,
    name: 'Cars',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    createAttrsFn: createCarsAttributes,
  })

  // ── Contact Messages collection ───────────────────────────────────────────────
  MESSAGES_COLLECTION_ID = await setupCollection({
    existingId: MESSAGES_COLLECTION_ID,
    name: 'ContactMessages',
    permissions: publicWriteAdminRead,
    createAttrsFn: createContactMessagesAttributes,
  })

  // ── Sell Inquiries collection ─────────────────────────────────────────────────
  INQUIRIES_COLLECTION_ID = await setupCollection({
    existingId: INQUIRIES_COLLECTION_ID,
    name: 'SellInquiries',
    permissions: publicWriteAdminRead,
    createAttrsFn: createSellInquiriesAttributes,
  })

  // ── Guide Articles collection ─────────────────────────────────────────────────
  GUIDES_COLLECTION_ID = await setupCollection({
    existingId: GUIDES_COLLECTION_ID,
    name: 'GuideArticles',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    createAttrsFn: createGuideArticlesAttributes,
  })

  // ── Guide Articles indexes ────────────────────────────────────────────────────
  console.log('\n🔍  Creating indexes for GuideArticles…')
  for (const [key, order] of [['published', 'ASC'], ['category', 'ASC']]) {
    try {
      await retry(() => databases.createIndex(DATABASE_ID, GUIDES_COLLECTION_ID, key, 'key', [key], [order]), `index:${key}`)
      console.log(`  ✔  Index: ${key}`)
    } catch (e) {
      console.log(`  ⚠  Index ${key}: ${e.message}`)
    }
    await sleep(800)
  }

  // ── Done ──────────────────────────────────────────────────────────────────────
  console.log('\n✅  Setup complete!')
  console.log('\n👉  Add / update these lines in your .env file:')
  console.log(`    VITE_APPWRITE_CARS_COLLECTION_ID=${CARS_COLLECTION_ID}`)
  console.log(`    VITE_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID=${MESSAGES_COLLECTION_ID}`)
  console.log(`    VITE_APPWRITE_SELL_INQUIRIES_COLLECTION_ID=${INQUIRIES_COLLECTION_ID}`)
  console.log(`    VITE_APPWRITE_GUIDE_ARTICLES_COLLECTION_ID=${GUIDES_COLLECTION_ID}\n`)

  void adminOnly

  // ── Storage bucket permissions ────────────────────────────────────────────────
  const BUCKET_ID = env.VITE_APPWRITE_BUCKET_ID
  if (BUCKET_ID) {
    console.log(`\n🪣  Updating storage bucket permissions: ${BUCKET_ID}`)
    try {
      const bucket = await retry(() => storageClient.getBucket(BUCKET_ID), 'getBucket')
      await retry(
        () => storageClient.updateBucket(
          BUCKET_ID,
          bucket.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ],
        ),
        'updateBucket',
      )
      console.log('  ✔  Bucket permissions updated (create allowed for users)')
    } catch (e) {
      console.error('  ✖  Could not update bucket:', e.message)
      console.log('  ℹ  Fix manually: Appwrite Console → Storage → your bucket → Permissions → add Create for users')
    }
  } else {
    console.log('\n⚠️  VITE_APPWRITE_BUCKET_ID not set — skipping bucket permission update')
  }
}

main().catch((e) => {
  console.error('\n❌  Setup failed:', e.message)
  process.exit(1)
})
