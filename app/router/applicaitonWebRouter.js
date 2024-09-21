const express = require("express");
const { authCheck } = require("../middleware/authHelper");
const applicationWebController = require("../module/application/controller/applicationWebController");
const applicationRoutes = express.Router();

applicationRoutes.get(
  "/applications",
  authCheck,
  applicationWebController.viewApplicationPage
);
applicationRoutes.get(
  "/application/:id",
  authCheck,
  applicationWebController.viewApplicationDetails
);

// view end

applicationRoutes.get(
  "/application/accept/:acceptId",
  applicationWebController.acceptApplications
);
applicationRoutes.get(
  "/application/reject/:rejectId",
  applicationWebController.rejectApplications
);

module.exports = applicationRoutes;
