const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/applications");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadApplication = multer({ storage: storage });


module.exports = uploadApplication;
