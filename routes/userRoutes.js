const express = require("express");

const userController = require("./../controllers/userController");

const router = express.Router();

router
  .route("/api/v1/user")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/api/v1/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/hello").get(userController.getHelloWorld);

module.exports = router;
