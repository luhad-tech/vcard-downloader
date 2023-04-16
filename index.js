const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'pug')

app.get('/:id', (req, res) => {
  const id = req.params.id
})

app.get('/:org/:person', function (req, res) {
    const org = req.params.org
    const person = req.params.person
    
    res.download(`./cards/${org}/${person}.vcf`, function (err) {
      if (err) {
        res.render('leg-error')
      }
    })
})

app.listen(port, () => {
  console.log(`vCard server listening on port ${port}`)
})
