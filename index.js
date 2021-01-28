const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path')
const makeclusters = require('./makeclusters.js');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(fileUpload());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
  res.redirect('/mapa');
})

app.post('/upload', function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/datasets/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send(err);
    nclusters = parseInt(req.body.nclusters);
    makeclusters(uploadPath, nclusters);
  });
  // res.send('File uploaded! <a href="/mapa">mapa</a>');
  res.redirect('/mapa');
});

app.get("/mapa", (req, res) => {
  res.sendFile(path.resolve('leafletjs.html'));
});

app.get('/pontos', (req, res) => {
  res.sendFile(path.resolve('public/valesmall.json'));
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
