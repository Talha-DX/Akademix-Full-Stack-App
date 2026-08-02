// Entry point.
import 'dotenv/config'
import app from './app.js'
import { checkDatabaseConnection } from './config/database.js'

const PORT = process.env.PORT || 5000

async function start() {
  await checkDatabaseConnection() // fails fast if Supabase is unreachable
  app.listen(PORT, () => console.log(`Akademix API listening on :${PORT}`))
}

start()
