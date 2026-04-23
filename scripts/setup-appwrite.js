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

import { Client, Databases, ID, Permission, Role } from 'node-appwrite'
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

// ── Config ────────────────────────────────────────────────────────────────────

const env = loadEnv()

const ENDPOINT   = env.VITE_APPWRITE_ENDPOINT
const PROJECT_ID = env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = env.VITE_APPWRITE_DATABASE_ID
const API_KEY    = env.APPWRITE_API_KEY
let   COLLECTION_ID = env.VITE_APPWRITE_CARS_COLLECTION_ID || ''

if (!API_KEY) {
  console.error('❌  APPWRITE_API_KEY is not set in .env')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new Databases(client)

// ── Attribute definitions ─────────────────────────────────────────────────────

async function createAttributes(collectionId) {
  const steps = [
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
    // Array of storage file IDs
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'images',      255,  false, null, true),
    () => databases.createBooleanAttribute(DATABASE_ID, collectionId, 'isSold',     false, false),
    // Array of feature strings (AI-generated or manual)
    () => databases.createStringAttribute(DATABASE_ID, collectionId, 'features',    255,  false, null, true),
  ]

  for (const step of steps) {
    let attr
    try {
      attr = await step()
      console.log(`  ✔  ${attr.key}`)
    } catch (e) {
      console.error(`  ✖  Error: ${e.message}`)
    }
    await sleep(800)
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚗  DriveHub – Appwrite Setup\n')

  if (COLLECTION_ID) {
    // ── Update existing collection ──────────────────────────────────────────
    console.log(`📦  Updating existing collection: ${COLLECTION_ID}`)

    try {
      await databases.updateCollection(DATABASE_ID, COLLECTION_ID, 'Cars', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ])
      console.log('  ✔  Collection permissions updated')
    } catch (e) {
      console.error('  ✖  Could not update collection permissions:', e.message)
    }

    let existing
    try {
      existing = await databases.listAttributes(DATABASE_ID, COLLECTION_ID)
    } catch (e) {
      console.error('❌  Could not fetch collection attributes:', e.message)
      process.exit(1)
    }

    if (existing.attributes.length > 0) {
      console.log(`🗑   Deleting ${existing.attributes.length} existing attribute(s)…`)
      for (const attr of existing.attributes) {
        try {
          await databases.deleteAttribute(DATABASE_ID, COLLECTION_ID, attr.key)
          console.log(`  ✔  Deleted: ${attr.key}`)
        } catch (e) {
          console.error(`  ✖  Could not delete ${attr.key}: ${e.message}`)
        }
        await sleep(600)
      }
      console.log('\n⏳  Waiting for deletions to propagate…')
      await sleep(3000)
    }
  } else {
    // ── Create new collection ───────────────────────────────────────────────
    console.log('📦  Creating new "Cars" collection…')
    const col = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      'Cars',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
    )
    COLLECTION_ID = col.$id
    console.log(`  ✔  Collection created: ${COLLECTION_ID}`)
    await sleep(1000)
  }

  // ── Create attributes ─────────────────────────────────────────────────────
  console.log('\n🔧  Creating attributes…')
  await createAttributes(COLLECTION_ID)

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n✅  Setup complete!')
  console.log('\n👉  Add this line to your .env file:')
  console.log(`    VITE_APPWRITE_CARS_COLLECTION_ID=${COLLECTION_ID}\n`)
}

main().catch((e) => {
  console.error('\n❌  Setup failed:', e.message)
  process.exit(1)
})
