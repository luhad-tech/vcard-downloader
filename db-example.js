const { Pool, Client } = require('pg')
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`

const pool = new Pool({
  connectionString,
})

 async function query() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO public.vcf_data (uuid, alias, email, firstname, lastname, midlename, prefix, suffix, org, title, role, h_email, w_email, h_phone, w_phone, w_address, h_address, urls, birthday, gender) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)'
    await client.query(queryText, ['6babdb0a-6876-4d2d-afa2-ccb91e3a13b9', 'luhad/hayden', 'hderifield2005@outlook.com', 'Hayden', 'Derifield', null, null, null, 'Luhad Tech', 'Tech Director', null, 'hderifield2005@outlook.com', 'hayden@luhad.tech', '5025425419', '5025578013', {street: null, city: null, state: null, code: null, country: null}, {street: null, city: null, state: null, code: null, country: null}, null, [null, null, null], 'male'])
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    console.log(e)
  } finally {
    client.release()
  }
 }
 query();