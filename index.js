// ------------------ IMPORTS DES PACKAGES ------------------ //
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const router = require('./routes/router');


//Le Middleware json-server
const jsm = jsonServer.router('db.json');
const pays = JSON.parse(fs.readFileSync('db.json')).pays

//On lance le serveur express, app.use
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', jsm);
app.use(router);
app.use('/images', express.static('images'));
app.set('view engine', 'ejs');
app.use("/images",express.static("images"));


app.listen(3001, () => console.log('Le serveur est lancé sur le port 3001'));