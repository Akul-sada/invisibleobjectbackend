const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
// Middleware to parse JSON
app.use(express.json());
// Define pug

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'),'views');

// Create hello world get request
app.get('/', (req, res) => {
  res.send('Hello World!');});




module.exports = app;
 