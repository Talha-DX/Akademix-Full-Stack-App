// Misc backend helpers shared across controllers.

// Builds Prisma skip/take from ?page=&limit= query params.
export function paginate(query, defaultLimit = 20) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), 100)
  return { skip: (page - 1) * limit, take: limit, page, limit }
}

export function paginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  }
}

// e.g. AKX-2026-000123
export function generateAdmissionNumber(academicYear) {
  const year = (academicYear || new Date().getFullYear().toString()).toString().slice(0, 4)
  const rand = Math.floor(Math.random() * 900000 + 100000)
  return `AKX-${year}-${rand}`
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Wraps an async Express handler so thrown errors reach the error middleware
// instead of crashing the process or hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}
