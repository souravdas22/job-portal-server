const express = require('express');
const uploadProfile = require('../helper/profileImage');
const userWebController = require('../module/user/controller/UserController');
const userWebRoute = express.Router();


userWebRoute.get("/register", userWebController.viewRegister);
userWebRoute.get("/login", userWebController.viewLogin);
userWebRoute.post(
  "/register",
  uploadProfile.single("profile_img"),
  userWebController.createRegister
);
userWebRoute.get("/confirmation/:email/:token", userWebController.confirmation);

userWebRoute.post("/login", userWebController.createLogin);

module.exports = userWebRoute;