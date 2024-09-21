const express = require('express');
const adminWebController = require('../module/admin/controller/adminWebController');
const { authCheck } = require('../middleware/authHelper');
const adminRoute = express.Router();


adminRoute.get('/',authCheck, adminWebController.viewIndex);
adminRoute.get("/logout", adminWebController.logout);

module.exports = adminRoute;