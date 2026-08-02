// Cloudinary config — optional. Only needed if file uploads (profile
// photos, documents) are offloaded to Cloudinary instead of local disk
// storage under /uploads. Safe to leave the env vars empty if unused.
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
