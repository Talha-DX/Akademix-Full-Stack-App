// File service — small helpers around uploaded files (multer already
// handles saving; this centralizes deletion and public URL building).
import fs from 'fs'
import path from 'path'

export function deleteUploadedFile(relativeUrl) {
  if (!relativeUrl) return
  const filePath = path.join(process.cwd(), relativeUrl.replace(/^\//, ''))
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') console.error('Failed to delete file:', err.message)
  })
}

export function publicUrl(req, relativePath) {
  return `${req.protocol}://${req.get('host')}${relativePath}`
}
