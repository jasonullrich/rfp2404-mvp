import 'dotenv/config'

import postgres from 'postgres'

const sql = postgres(process.env.DB_URL, { max: 50 })

export default sql
