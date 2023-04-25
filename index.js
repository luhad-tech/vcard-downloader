const express = require('express')
const uuid = require('uuid');
const app = express()
const port = 3000
app.set('view engine', 'pug')


app.get('/:id', (req, res, next) => {
  const id = req.params.id
  if (!uuid.validate(id)) {
    next()
  } else {

  }

})

app.get('*', function (req, res) {
    const path = req.path
    console.log(path)

    res.download(`./cards${path}/.vcf`, function (err) {
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        console.log('some error occurred. But I am too lazy to implement error handling :) sue me.')
      } else {
        // decrement a download credit, etc.
        console.log(res.headersSent)
      }
    })
})

app.listen(port, () => {
  console.log(`vCard server listening on port ${port}`)
})
