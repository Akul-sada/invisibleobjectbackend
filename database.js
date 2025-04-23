const dotenv = require('dotenv');
import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';


dotenv.config({path: './config.env'});


const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;


const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: `${database}`,
  port:5432,
  database: `${database}`,
  host: 'localhost',
  port: 5432,
  ssl: true,
  clientMinMessages: 'notice',
});

// const client =new Client({
//     host:"localhost",
//     user:"postgres",
//     port:5432,
//     database: `${database}`,
//     database: `${database}`,
// });
// // client.connect();

// module.exports = client;




const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("connection has been established successfully");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
};
module.exports = {connection};
