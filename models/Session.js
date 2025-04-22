const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize (make sure to replace these values with your actual database info)
const sequelize = new Sequelize('database', 'username', 'password', {
host: 'localhost', // Replace with your host
dialect: 'postgres',
});

// Define Session model
const Session = sequelize.define('Session', {
user: {
type: DataTypes.INTEGER, // Use INTEGER if using IDs
allowNull: false,
references: {
model: 'Users', // Name of the table in the database
key: 'id', // The key in the referenced model
},
},
photo1: {
type: DataTypes.STRING, // Store the file path or URL of the first photo
allowNull: false,
},
photo2: {
type: DataTypes.STRING, // Store the file path or URL of the second photo
allowNull: false,
},
clickOnSubmit:{
    type:DataTypes.BOOLEAN
},
like:{
    type:DataTypes.BOOLEAN
},

submittedAt: {
type: DataTypes.DATE,
defaultValue: Sequelize.NOW, // Store when the session was submitted
},
}, {
// Options for the model
tableName: 'sessions', // Specify custom table name if desired
});

// Export the Session model
module.exports = Session;

// Sync the model with the database (only for initial setup, remove in production)
(async () => {
await sequelize.sync({ force: true });
})();