// Re-exports the shared Prisma client from config/database.js.
//
// Controllers/services should import `prisma` from here (or from
// config/database.js directly — same object either way), never
// instantiate their own `new PrismaClient()`. A second instance means a
// second, redundant connection pool against the same database.
export { prisma } from '../config/database.js'