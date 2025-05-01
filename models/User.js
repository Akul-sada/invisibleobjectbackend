const sequelize = require('./../database');
const crypto = require('crypto');
require('dotenv').config();
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');


// Define User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This email is already in use'
      },
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, Infinity], // Minimum length of 6 characters
      },
      passwordChangedAt: Date,
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true
      },
      active: {
        type: Boolean,
        default: true,
        select: false
      }
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    clientIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      // Before creating or updating a user, hash the password and clientIp
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeSave: async (user) => {
        // Only hash if password was changed (covers both create and update)
        if (user.changed("password")) {
          try {
            user.password = await bcrypt.hash(user.password, 10);
          } catch (error) {
            throw new Error("Password hashing failed");
          }
        }
      },
    },
  }
);

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// Static method to find user by email
User.findByEmail = async function (email) {
  if (!email) return null;
  
  return await this.findOne({ 
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('email')),
      sequelize.fn('lower', email)
    )
  });
};

// Static method to find user by ID
User.findById = async function (id) {
  if (!id) return null;
  
  return await this.findOne({ 
    where: { id }
  });
};


User.prototype.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  console.log({ resetToken }, this.passwordResetToken);
  
  await this.save(); // Sequelize requires explicit save
  
  return resetToken;
};


// Add to your User model definition
User.prototype.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};



userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email (case-insensitive search)
  const user = await User.findOne({
    where: {
      email: sequelize.where(
        sequelize.fn('lower', sequelize.col('email')),
        sequelize.fn('lower', req.body.email)
      )
    }
  });

  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  
  // Sequelize doesn't have validateBeforeSave, so we skip validation differently
  await user.save({
    fields: ['passwordResetToken', 'passwordResetExpires'], // Only update these fields
    validate: false // Skip validation
  });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    // Reset the token fields if email fails
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save({
      fields: ['passwordResetToken', 'passwordResetExpires'],
      validate: false
    });

    return next(
      new AppError('There was an error sending the email. Try again later!', 500)
    );
  }
});


// Export the User model
module.exports = User;

// Sync the model with the database (only for initial setup, remove in production)
(async () => {
  await sequelize.sync({ force: true });
})();
