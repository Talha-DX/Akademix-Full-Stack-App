// Database connection — plain PostgreSQL via Prisma.
//
// Prisma reads DATABASE_URL from .env directly (see prisma/schema.prisma),
// so this file's job is to export a single, shared PrismaClient instance
// for the rest of the app to import.
//
// The globalThis cache below matters in dev: without it, `nodemon`
// restarting on every file save would each time create a fresh
// PrismaClient (and a fresh connection pool). Caching on globalThis
// survives module reloads in dev while still behaving like a normal
// singleton in production.

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Call once at server startup (see server.js) to fail fast with a clear
 * error if the database is unreachable or the credentials are wrong,
 * instead of the first API request surfacing a cryptic Prisma error.
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Connected to PostgreSQL')
  } catch (err) {
    console.error('❌ Could not connect to the database:', err.message)
    throw err
  }
}