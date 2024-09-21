const express = require("express");
const UserApiController = require("../../module/webservice/UserApiController");
const uploadProfile = require("../../helper/profileImage");

const userRoute = express.Router();

userRoute.post(
  "/register",
  uploadProfile.single("profile_img"),
  UserApiController.createRegister
);
userRoute.get("/confirmation/:email/:token", UserApiController.confirmation);

//login
userRoute.post("/login", UserApiController.createLogin);

//update password
userRoute.post("/update-password/:email", UserApiController.updatePassword);


// forget password
userRoute.post("/forget-password", UserApiController.forgetPassword);
// password reset confirmation
userRoute.get(
  "/password-reset/confirmation/:email/:token",
  UserApiController.passwordresetconfirmation
);
//new password
userRoute.post("/new-password/:email", UserApiController.newPasswordReset);
userRoute.get("/profile-details/:token", UserApiController.profileDetails);
userRoute.post("/profile-details/update/:id", UserApiController.updateProfileDetails);

module.exports = userRoute;
