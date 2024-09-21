const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../user/model/user");
const TokenModel = require("../user/model/tokenModel");
const crypto = require("crypto");
const { mailSend, createTransporter, hashPassword } = require("../../middleware/authHelper");
const userRepo = require("../user/repository/userRepo");

class userController {
  authUser(req, res, next) {
    if (req.user) {
      next();
    } else {
      res
        .status(500)
        .json({ message: "Error While Authenticating user", status: 500 });
    }
  }
  async createRegister(req, res) {
    try {
      const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        role: "candidate",
        mobile: req.body.mobile,
      });
      if (req.file) {
        user.profile_img = req.file.path;
      }
      const result = await user.save();
      // token verification
      const token_model = new TokenModel({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token_model.save();
      const senderEmail = process.env.MAIL_ID;
      const senderPassword = process.env.PASSWORD;
      const transport = createTransporter(senderEmail, senderPassword);

      const mailOptions = {
        from: senderEmail,
        to: user.email,
        subject: "Email Verification ",
        text: "Hello " + user.name,
        html: `
        <p>Please verify your account by clicking the link:</p>
        <a href="${process.env.LOCAL_PORT_URL}/api/confirmation/${user.email}/${token_model.token}">
         Verify Email
        </a>
        <p>Thank you!</p>
         `,
      };
      mailSend(req, res, transport, mailOptions);

      return res.status(200).json({
        status: 200,
        message: `Verification link sent successfully to ${user.email}`,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in registration",
        error: error.message,
      });
    }
  }

  // register verification

  async confirmation(req, res) {
    try {
      const token = await userRepo.getToken({ token: req.params.token });
      if (!token) {
        const { email } = req.params;
        const user = await userRepo.findUser({ email });
        const token_model = new TokenModel({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        await token_model.save();

        const senderEmail = process.env.MAIL_ID;
        const senderPassword = process.env.PASSWORD;
        const transport = createTransporter(senderEmail, senderPassword);
        const mailOptions = {
          from: senderEmail,
          to: email,
          subject: "Email Verification",
          html: `
        <p>This is a new link for for verifying your email which will expire in 10 mins \n\n click the link below to verify:</p>
        <a href="${process.env.LOCAL_PORT_URL}/api/confirmation/${email}/${token_model.token}">
        Verify Email
        </a>
        <p>Thank you!</p>
         `,
        };
        mailSend(req, res, transport, mailOptions);

        return res.status(400).json({
          status: 400,
          message: `verification link may be expired,New verification link sent to ${email}`,
        });
      } else {
        const user = await userRepo.findUser({
          _id: token._userId,
          email: req.params.email,
        });
        if (!user) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
          });
        }
        if (user.isVerified) {
          return res.status(400).json({
            status: 400,
            message: "User already verified",
          });
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
          status: 200,
          message:
            "User verified successfully. Now you can login to your account.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in email verification",
        error: error.message,
      });
    }
  }

  async createLogin(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "All inputs are required.", status: 400 });
      }

      // Finding user by email
      const user = await userRepo.findUser({ email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Email is not registered", status: 401 });
      }
      if (user.isVerified === false) {
        return res.status(401).send({
          status: 401,
          message: "User not verified",
        });
      }

      // Checking if the user's role matches the route parameter
      if (user.role !== "candidate") {
        return res.status(403).json({
          message: `Access denied for ${user.role}s`,
          status: 403,
        });
      }

      // Comparing the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid password.",
          status: 401,
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      res.cookie("token", token);
      // Send the response with token and user info
      res.status(200).json({
        message: "Login successful.",
        status: 200,
        user: user,
        token,
      });
    } catch (err) {
      res.status(500).json({
        message: `Internal Server Error: ${err.message}`,
        status: 500,
      });
    }
  }
  //update password
  async updatePassword(req, res) {
    try {
     const email = req.params.email;
      const user = await userRepo.findUser({ email });
      if (!user) {
         res.status(500).json({
           status: 500,
           message: `Error in password update: ${error.message}`,
         });
      }
      const { newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepo.updatePass(user._id, { password: hashedPassword });

      res.status(200).send({
        status: 200,
        message: "Password updated successfully.",
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: `Error in password update: ${error.message}`,
      });
    }
  }

  //forget password

  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      //check user
      const user = await userRepo.findUser({ email });
      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "Email is not registered",
        });
      }
      if (user.isVerified === false) {
        return res.status(500).send({
          status: 500,
          message: "email is not verified",
        });
      }
      const token_model = new TokenModel({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token_model.save();

      const senderEmail = process.env.MAIL_ID;
      const senderPassword = process.env.PASSWORD;
      const transport = createTransporter(senderEmail, senderPassword);
      const mailOptions = {
        from: senderEmail,
        to: user.email,
        subject: "Forgot Password",
        html: `
        <p>create a new password by clicking the link below:</p>
         <a href="${process.env.LOCAL_PORT_URL}/api/password-reset/confirmation/${user.email}/${token_model.token}">
        Reset Password
        </a>
        <p>Thank you!</p>
         `,
      };
      if (user.isVerified) {
        mailSend(req, res, transport, mailOptions);
      }

      return res.status(200).send({
        status: 200,
        message: "password reset link sent successfully on your email",
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in password reset",
        error: error.message,
      });
    }
  }
  // reset email confirmation
  async passwordresetconfirmation(req, res) {
    try {
      const token = await userRepo.getToken({ token: req.params.token });

      if (!token) {
        const { email } = req.params;
        const user = await userRepo.findUser({ email });
        const token_model = new TokenModel({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        await token_model.save();

        const senderEmail = process.env.MAIL_ID;
        const senderPassword = process.env.PASSWORD;
        const transport = createTransporter(senderEmail, senderPassword);
        const mailOptions = {
          from: senderEmail,
          to: email,
          subject: "Forgot Password",
          html: `
        <p>This is a new link for creating a new password which will expire in 10 mins \n\n click the link below to create a new password:</p>
        <a href="${process.env.LOCAL_PORT_URL}/api/password-reset/confirmation/${email}/${token_model.token}">
        Reset Password
        </a>
        <p>Thank you!</p>
         `,
        };
        mailSend(req, res, transport, mailOptions);

        return res.status(400).send({
          status: 400,
          message: `reset link may be expired,New reset link sent to ${email}`,
        });
      } else {
        const user = await userRepo.findUser({
          _id: token._userId,
          email: req.params.email,
        });
        if (!user) {
          return res.status(404).send({
            status: 404,
            message: "User not found",
          });
        }
        if (user.isVerified) {
          return res.status(200).send({
            status: 200,
            message: "User verified now you can reset password",
            id: user._id,
          });
        }
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in email verification",
      });
    }
  }
  // new reset password
  async newPasswordReset(req, res) {
    try {
      const email = req.params.email;
      const user = await userRepo.findUser({ email });
      const userId = user._id;
      const token = await userRepo.getToken({ _userId: userId });
      if (token) {
        await TokenModel.deleteOne({ _id: token._id });
      }
      const newPassword = req.body.newPassword;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.findOneAndUpdate({ email }, { password: hashedPassword });
      res.status(200).send({
        status: 200,
        message: " password reset successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in password reset",
      });
    }
  }

  async profileDetails(req, res) {
    try {
      const token = req.params.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const id = decoded.id;
          const userDetails = await userRepo.findUserById(id);
          return res.status(200).json({
            status: 200,
            message: "user data fetched successfully",
            data: {
              id: userDetails.id,
              name: userDetails.name,
              email: userDetails.email,
              mobile: userDetails.mobile,
              role: userDetails.role,
              profile_img: userDetails.profile_img,

            },
          });
        } catch (error) {
          return res.status(401).json({
            status: false,
            message: "failed to fetch user data",
            error,
          });
        }
      }
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: "invalid token",
        error,
      });
    }
  }
  async updateProfileDetails(req, res) {
    try {
      const id = req.params.id;
      const {
        name,
        email,
        mobile,
        role
       
      } = req.body;

      const user = {
        name,
        email,
        mobile,
        role,
      };
      const updatedUser = await userRepo.editUser(id, user, {
        new: true,
      });

      res.status(200).json({
        message: "User updated successfully",
        status: 200,
        data: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message, status: 500 });
    }
  }
}

module.exports = new userController();
