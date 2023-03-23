const express = require('express')
const app = express()
const port = 3000

app.get('/:org/:person', function (req, res, next) {
    const org = req.params.org
    const person = req.params.person
    
    res.download(`./cards/${org}/${person}.vcf`, function (err) {
      if (err) {
        res.redirect('/')
      }
    })
})

app.get('*', (req, res) => {
  res.redirect('https://luhad.tech')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
