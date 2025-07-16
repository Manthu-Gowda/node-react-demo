const authController = require("../Controller/authController");
const express = require('express');
const authRouter = express.Router();

authRouter.post("/createUser", authController.createUser);
authRouter.post("/userLogin", authController.userLogin);



module.exports = authRouter;