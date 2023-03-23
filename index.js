const express = require('express')
const app = express()
app.use(express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.redirect('https://luhad.tech')
})

app.get('/jlusby', (req, res) => {
  res.download('/cards/joy_lusby.vcf')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})