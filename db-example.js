const { Pool, Client } = require('pg')
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`

const pool = new Pool({
  connectionString,
})
// {street: null, city: null, state: null, code: null, country: null}
 async function query() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO public.vcf_cards (uuid, email, firstname, lastname, middlename, organization, photo, w_phone, birthday, title, url, workurl, note, nickname, prefix, suffix, gender, role, h_phone, c_phone, p_phone, h_fax, w_fax, h_email, w_email, logo, h_address, w_address, alias) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)'
    await client.query(queryText, ['6babdb0a-6876-4d2d-afa2-ccb91e3a13b9', 'hderifield2005@outlook.com', 'Hayden', 'Derifield', null, 'Luhad Technologies', null, ['5025578013'], ['2005', '6', '6'], 'Technical Director', null, 'https://luhad.tech', null, null, null, null, 'M', null, [null], ['5025425419'], [null], [null], [null], ['hderifield2005@outlook.com'], ['hayden@luhad.tech'], null, {street: null, city: null, state: null, code: null, country: null}, {street: null, city: null, state: null, code: null, country: null}, '/luhad/hayden_derifield'])
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    console.log(e)
  } finally {
    client.release()
  }
 }
 query();