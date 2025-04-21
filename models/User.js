const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Initialize Sequelize (make sure to replace these values with your actual database info)
const sequelize = new Sequelize('database', 'username', 'password', {
host: 'localhost', // Replace with your host
dialect: 'postgres',
});

// Define User model
const User = sequelize.define('User', {
name: {
type: DataTypes.STRING,
allowNull: false,
},
email: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
},
password: {
type: DataTypes.STRING,
allowNull: false,
validate: {
len: [6, Infinity], // Minimum length of 6 characters
},
},
role: {
type: DataTypes.ENUM('user', 'admin'),
defaultValue: 'user',
},
hostname: {
type: DataTypes.STRING,
allowNull: false,
},
}, {
hooks: {
// Before creating or updating a user, hash the password and hostname
beforeCreate: async (user) => {
if (user.password) {
user.password = await bcrypt.hash(user.password, 10);
}
if (!user.hostname) {
user.hostname = require('os').hostname(); // Get system hostname
} else {
user.hostname = await bcrypt.hash(user.hostname, 10);
}
},
beforeSave: async (user) => {
if (user.changed('password')) {
user.password = await bcrypt.hash(user.password, 10);
}
if (user.changed('hostname')) {
user.hostname = await bcrypt.hash(user.hostname, 10);
}
},
},
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
User.findByEmail = async function (email) {
return await this.findOne({ where: { email } });
};

// Export the User model
module.exports = User;

// Sync the model with the database (only for initial setup, remove in production)
(async () => {
await sequelize.sync({ force: true });
})();