const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { timeStamp } = require('console');

const userSchema = new mongoose.Schema({
  guestId:{
    type: String,
    default: null
  },
  
  name: {
    type: String
  },
  userId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  countryCode:{
    type:String
  },
  mobileNumber:{
    type:String
  },
  email: {
    type: String,
    unique: true
  },
  userName:{
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin','guest'],
    default: 'user'
  },
  hostname: {
    type: String,
    required: true,
  },
  verifiedMobileNumber:{
    type: Boolean,
    default: false
  },
  verifiedEmail:{
    type: Boolean,
    default: false
  },
  isSignedUp:{
    type:Boolean,
    default:false,
  },
  isSubscribed:{
    type:Boolean,
    default:false,
    timeStamp:{
      type: Date,
      default: Date.now
    }
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
userSchema.methods.findByEmail = async function(email) {
    try {
        return await this.findOne({ email });
    } catch(err) {
        throw err;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;