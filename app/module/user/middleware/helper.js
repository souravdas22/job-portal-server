const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.SECRET_KEY, (err, data) => {
      req.user = data;
      next();
    });
  } else {
    next();
  }
};

const globalMessage = (req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
};

module.exports = { authCheck, globalMessage };
