const path = require('path');
const express = require('express');
const mongoose = require('mongoose');



const app = express();

// Define pug

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'),'views');


module.exports = app; 
 