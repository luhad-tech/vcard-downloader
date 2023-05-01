const express = require('express')
const uuid = require('uuid');
const vCardsJS = require('vcards-js');

const app = express()
const port = 3000
const { Pool } = require('pg')
require('dotenv').config();
app.set('view engine', 'pug')

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
const queryTextUUID = 'SELECT * FROM public.vcf_data WHERE UUID = $1'
const queryTextAlias = 'SELECT * FROM public.vcf_data WHERE alias = $1'
const pool = new Pool({
  connectionString,
})

async function cardMaker(d) {
  const vCard = vCardsJS();
  vCard.uid = d.uuid;
  vCard.firstName = d.firstname;
  vCard.lastName = d.lastname;
  if (d.middlename != null) {
    vCard.middleName = d.middlename;
  }
  if (d.prefix != null) {
    vCard.namePrefix = d.prefix;
  }
  if (d.suffix != null) {
    vCard.nameSuffix = d.suffix;
  }
  if (d.w_address.street != null) {
    vCard.workAddress.label = 'Work Address';
    vCard.workAddress.street = d.w_address.street;
    vCard.workAddress.city = d.w_address.city;
    vCard.workAddress.stateProvince = d.w_address.state;
    vCard.workAddress.postalCode = d.w_address.code;
    vCard.workAddress.countryRegion = d.w_address.country;
  } 
  if (d.h_address.street != null) {
    vCard.homeAddress.label = 'Work Address';
    vCard.homeAddress.street = d.h_address.street;
    vCard.homeAddress.city = d.h_address.city;
    vCard.homeAddress.stateProvince = d.h_address.state;
    vCard.homeAddress.postalCode = d.h_address.code;
    vCard.homeAddress.countryRegion = d.h_address.country;
  }  
  if (d.birthday[0] != null) {
    // year month day
    vCard.birthday = new Date(d.birthday[0], d.birthday[1], d.birthday[2]);
  }  
  if (d.org != null) {
    vCard.organization = d.org;
  }  
  if (d.w_email != null) {
    vCard.workEmail = d.w_email;
  }  
  if (d.h_email != null) {
    vCard.email = d.h_email;
  }  
  if (d.title != null) {
    vCard.title = d.title;
  }  
  if (d.role != null) {
    vCard.role = d.role;
  }  
  if (d.w_phone != null) {
    vCard.workPhone = d.w_phone;
  }  
  if (d.h_phone != null) {
    vCard.cellPhone = d.h_phone;
  }  
  return vCard.getFormattedString()
}



app.get('/:id', (req, res, next) => {
  const id = req.params.id
  const val = [id]
  if (!uuid.validate(id)) {
    next()
  } else {
    pool
  .query(queryTextUUID, val)
  .then(async (r) => {
    res.set('Content-Type', `text/vcard; name="${r.rows[0].firstname}_${r.rows[0].lastname}.vcf"`);
    res.set('Content-Disposition', `inline; filename="${r.rows[0].firstname}_${r.rows[0].lastname}.vcf"`);
    res.send(await cardMaker(r.rows[0]))
  })
  .catch(e => console.error(e.stack))
  }

})

app.get('*', function (req, res) {
    const path = req.path
    const val = [path]

    pool
  .query(queryTextAlias, val)
  .then(async (r) => {
    res.set('Content-Type', `text/vcard; name="${r.rows[0].firstname}_${r.rows[0].lastname}.vcf"`);
    res.set('Content-Disposition', `inline; filename="${r.rows[0].firstname}_${r.rows[0].lastname}.vcf"`);
    res.send(await cardMaker(r.rows[0]))
  })
  .catch(e => console.error(e.stack))
})

app.listen(port, () => {
  console.log(`vCard server listening on port ${port}`)
})
