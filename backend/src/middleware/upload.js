// File upload middleware — Multer config for profile photos, documents,
// and homework attachments, saved to backend/uploads/<kind>.
import multer from 'multer'
import path from 'path'
import fs from 'fs'

function makeStorage(subfolder) {
  const dest = path.join(process.cwd(), 'uploads', subfolder)
  fs.mkdirSync(dest, { recursive: true })
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
    },
  })
}

export const uploadProfile = multer({ storage: makeStorage('profiles') })
export const uploadDocument = multer({ storage: makeStorage('documents') })
export const uploadHomework = multer({ storage: makeStorage('homework') })
