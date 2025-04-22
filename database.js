const  { Sequelize } = require('sequelize');



const sequelize = new Sequelize('copyphoenix', 'postgres', 'W4k6.Y', {
  host: "localhost",
  dialect: "postgres",
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("connection has been established successfully");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
};
module.exports = {connection};
