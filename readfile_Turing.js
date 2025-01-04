const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const PORT = 80;

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(bodyParser.json());const fs = require('fs');


app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname,'/public/Turing-Machine.html'));
})

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});



