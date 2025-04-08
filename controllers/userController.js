const User = require('../models/User');

exports.getAllUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.createUser = async (req, res) => {
    try{

    const { name, email, password} = req.body;
    // Create a new user and store automatically
    const newUser = new User({name, email,password});

    await newUser.save();
    res.status(201).json({message: `User ${name} registered successfully!`,user:newUser})

    }catch(error){
        res.status(500).json({
            status: 'error',
            message: 'This route is not yet defined!'
          });

    }
    
  };
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };

  