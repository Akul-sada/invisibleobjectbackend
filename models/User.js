const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    validate: {
      validator: function(value) {
        // Additional password validation rules
        return value.length >= 6;
      },
      message: 'Password must be at least 6 characters long'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  hostname: {
    type: String,
    required: true,
  }
});

// Define saltRounds globally for the module
const saltRounds = 10;
// ------------------------------------------------------------------------------------
// 
//         Hash Password before saving the user
// 
// 
// ------------------------------------------------------------------------------------
userSchema.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')) return next();
    
    try {
        const hash = await bcrypt.hash(user.password, saltRounds);
        user.password = hash;
        next();
    } catch(err) {
        return next(err);
    }
});

// --------------------------------------------------------------------------
// 
// Automatically store and encrypt the hostname
// 
// 
// ---------------------------------------------------------------------------
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.hostname) {
        user.hostname = require('os').hostname(); // Get system hostname
    }
    
    if (user.isModified('hostname')) {
        try {
            const hash = await bcrypt.hash(user.hostname, saltRounds);
            user.hostname = hash;
            next();
        } catch(err) {
            return next(err);
        }
    } else {
        next();
    }
});
// -----------------------------------------------------------------------------
// 
// Method to verify password
// 
// 
// -----------------------------------------------------------------------------
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch(err) {
        throw err;
    }
};

// -------------------------------------------------------------------------------
// 
// 
// Static method to find user by email
// 
// 
// --------------------------------------------------------------------------------
userSchema.statics.findByEmail = async function(email) {
    try {
        return await this.findOne({ email });
    } catch(err) {
        throw err;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;