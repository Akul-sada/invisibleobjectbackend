const jwt = require('jsonwebtoken');
const User = require("../models/User");

// exports.getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined!",
//   });
// };
// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined!",
//   });
// };
exports.createUser = async (req, res) => {
  try {
    // Add hostname to database
    const clientIp = req.ip;



    // Create a new user and store automatically
    const newUser = await User.create({ id,name:req.body.name, email:req.body.email, password:req.body.password, clientIp });

    // ----------------------------------------------------------------
                // JWT Signing and storing toke to cookies

    // -------------------------------------------------------------------

    const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,process.env.JWT_EXPIRES);

    res
      .status(201)
      .json({
        status:'success',
        token,
        data:{
          user:newUser
        }
      });
  } catch (error) {
    console.log(error);
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



exports.getHelloWorld =(req,res)=>{
  res.status(200).json({
    status:"success",
    message:"Hello World"
  });

}