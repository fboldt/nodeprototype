const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));

const path = require('path')

app.get('/', (req, res) => {
  res.sendFile(path.resolve('leafletjs.html'))
})

app.get('/pontos', (req, res) => {
  res.sendFile(path.resolve('public/valesmall.json'));
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
