const jwt = require('jsonwebtoken');
const User = require("../models/User");

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = async (req, res) => {
  try {
    // Add hostname to database
    const clientIp = req.ip;

    // Take input from user
    const { name, email, password } = req.body;

    // Create a new user and store automatically
    const newUser = await User.create({ name:req.body.name, email:req.body.email, password:req.body.password, clientIp });

    // ----------------------------------------------------------------
                // JWT Signing

    // -------------------------------------------------------------------

    const jwt = jwt.sign

    res
      .status(201)
      .json({
        message: `User ${name} registered successfully!`,
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
    });
  }
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
