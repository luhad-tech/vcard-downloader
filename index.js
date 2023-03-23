const express = require('express')
const app = express()
app.use(express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.redirect('https://luhad.tech')
})

app.get('/:org/:person', function (req, res) {
    const org = req.params.org
    const person = req.params.person
    
    res.download(`./cards/${org}/${person}.vcf`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})