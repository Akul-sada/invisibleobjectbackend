const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sequelize = require('../database');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

  exports.signup = catchAsync(async (req, res, next) => {
    // const { email } = req.body;

    // // 1) Check if user already exists
    // const existingUser = await User.findOne({ 
    //   where: { 
    //     email: sequelize.where(
    //       sequelize.fn('lower', sequelize.col('email')),
    //       sequelize.fn('lower', email)
    //     )
    //   } 
    // });
  
    // if (existingUser) {
    //   return res.status(409).json({
    //     status: 'fail',
    //     message: 'User already exists with this email address'
    //   });
    // }


    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      clientIp:req.ip
    });
  
    createSendToken(newUser, 201, res);
  });

  exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
  // 2) Check if user exists && password is correct
  const user = await User.findByEmail(email);
  
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  });


  exports.logout = (req, res) => {
    // Clear the JWT cookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict' // Added for CSRF protection
    });
    
    // Alternative method to immediately expire cookie
    // res.clearCookie('jwt');
    
    res.status(200).json({ 
      status: 'success',
      message: 'Successfully logged out'
    });
  };