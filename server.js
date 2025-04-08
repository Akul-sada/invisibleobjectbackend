const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});
const port = process.env.PORT || 3000;

const connectionString = process.env.CONNECTION_STRING



async function connectToDatabase(){
    try{
        await mongoose.connect(connectionString);
        console.log('Connected to the database');
    }catch(error){
        console.log('Error connecting to MongoDB:', error);

    }
}
connectToDatabase();

app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
});