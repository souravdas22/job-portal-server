const express = require("express");
const applicationApiController = require("../../module/webservice/ApplicaitonApiController");
const uploadApplication = require("../../helper/applicationFile");

const applicationRoute = express.Router();

//web
applicationRoute.get('/application', (req, res) => {
    res.render("application", {
      filePath: "http://localhost:7000/uploads\\applications\\cv sample.pdf",
    });
})

applicationRoute.get(
  "/applications",
  applicationApiController.getAllApplications
);
applicationRoute.post(
  "/application/create",
  uploadApplication.single("resume"),
  applicationApiController.createApplication
);
applicationRoute.get(
  "/application/:applicationId",
  applicationApiController.getApplicationDetails
);
applicationRoute.get(
  "/application/delete/:id",
  applicationApiController.deleteApplication
);

module.exports = applicationRoute;
