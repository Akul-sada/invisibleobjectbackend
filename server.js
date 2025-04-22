const dotenv = require('dotenv');
const app = require('./app');
const { connection } = require('./database');
dotenv.config({path: './config.env'});
const port = process.env.PORT || 5432;


app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
});
connection();

