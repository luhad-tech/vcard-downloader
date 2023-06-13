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
const queryTextUUID = 'SELECT * FROM public.vcf_cards WHERE UUID = $1'
const queryTextAlias = 'SELECT * FROM public.vcf_cards WHERE alias = $1'
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
  if (d.organization != null) {
    vCard.organization = d.organization
  }
  if (d.photo != null) {
    vCard.photo.embedFromString(d.photo, 'image/png');
  }
  if (d.w_phone[0] != null) {
    vCard.workPhone = d.w_phone
  }
  if (d.title != null) {
    vCard.title = d.title
  }
  if (d.url != null) {
    vCard.url = d.url
  }
  if (d.workurl != null) {
    vCard.workUrl = d.workurl
  }
  if (d.note != null) {
    vCard.note = d.note
  }
  if (d.nickname != null) {
    vCard.nickname = d.nickname
  }
  if (d.prefix != null) {
    vCard.namePrefix = d.prefix
  }
  if (d.suffix != null) {
    vCard.nameSuffix = d.suffix
  }
  if (d.gender != null) {
    vCard.gender = d.gender
  }
  if (d.role != null) {
    vCard.role = d.role
  }
  if (d.h_phone[0] != null) {
    vCard.homePhone = d.h_phone
  }
  if (d.c_phone[0] != null) {
    vCard.cellPhone = d.c_phone
  }
  if (d.p_phone[0] != null) {
    vCard.pagerPhone = d.p_phone
  }
  if (d.h_fax[0] != null) {
    vCard.homeFax = d.h_fax
  }
  if (d.w_fax[0] != null) {
    vCard.workFax = d.w_fax
  }
  if (d.h_email[0] != null) {
    vCard.email = d.h_email
  }
  if (d.w_email[0] != null) {
    vCard.workEmail = d.w_email
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
    vCard.homeAddress.label = 'Home Address';
    vCard.homeAddress.street = d.h_address.street;
    vCard.homeAddress.city = d.h_address.city;
    vCard.homeAddress.stateProvince = d.h_address.state;
    vCard.homeAddress.postalCode = d.h_address.code;
    vCard.homeAddress.countryRegion = d.h_address.country;
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
