const hits = new Map()

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 50, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const now = Date.now()

    const userHits = hits.get(ip) || []
    const validHits = userHits.filter((timestamp) => now - timestamp < windowMs)

    if (validHits.length >= max) {
      return res.status(429).json({ message })
    }

    validHits.push(now)
    hits.set(ip, validHits)

    // Periodic cleanup every 1000 requests
    if (hits.size > 10000) {
      for (const [key, timestamps] of hits.entries()) {
        const remaining = timestamps.filter((ts) => now - ts < windowMs)
        if (remaining.length === 0) hits.delete(key)
        else hits.set(key, remaining)
      }
    }

    next()
  }
}
