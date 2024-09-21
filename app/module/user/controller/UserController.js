const TokenModel = require("../../user/model/tokenModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const UserModel = require("../../user/model/user");
const {
  createTransporter,
  mailSend,
} = require("../../../middleware/authHelper");
const jwt = require("jsonwebtoken");
const userRepo = require("../repository/userRepo")

class UserWebController {
 

  async viewRegister(req, res) {
    try {
      res.render("register");
    } catch (error) {
      console.log(error.message);
    }
  }
  async viewLogin(req, res) {
    try {
      res.render("login");
    } catch (error) {
      console.log(error.message);
    }
  }

  async createRegister(req, res) {
    try {
      const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        role: "admin",
        mobile: req.body.mobile,
      });
      if (req.file) {
        user.profile_img = req.file.path;
      }
      await user.save();
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
        <a href="${process.env.LOCAL_PORT_URL}/admin/confirmation/${user.email}/${token_model.token}">
         Verify Email
        </a>
        <p>Thank you!</p>
         `,
      };
      mailSend(req, res, transport, mailOptions);

      res.redirect("/admin/login");
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in registration",
        error: error.message,
      });
    }
  }
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
        <a href="${process.env.LOCAL_PORT_URL}/admin/confirmation/${email}/${token_model.token}">
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
        console.log("All inputs are required.");
      }

      // Finding user by email
      const user = await userRepo.findUser({ email });
      if (!user) {
        console.log("Email is not registered");
      }
      if (user.isVerified === false) {
        console.log("User not verified");
      }

      // Checking if the user's role matches the route parameter
      if (user.role !== "admin") {
        console.log(
          `Users with the role '${user.role}' are not allowed to login here.`
        );
      }

      // Comparing the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Invalid password.");
      }

      // Send the response with token and user info
      if (user.role === "admin") {
        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );
        req.user = token;
        res.cookie("token", token);
        console.log("Login successful.");
        res.redirect("/admin");
      }
    } catch (err) {
      res.status(500).json({
        message: `Internal Server Error: ${err.message}`,
        status: 500,
      });
    }
  }
}
const userWebController = new UserWebController();
module.exports = userWebController;
