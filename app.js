const path = require('path');
const express = require('express');
const userRouter = require('./routes/userRoutes');

// const sessionRoutes = require('./routes/sessionRoutes');



const app = express();
app.use(express.json());


app.use('/api/v1/users',userRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

// Define pug

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'),'views');


module.exports = app; 
 