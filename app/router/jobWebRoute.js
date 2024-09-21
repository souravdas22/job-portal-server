const express = require("express");
const uploadJob = require("../helper/jobImage");
const { authCheck } = require("../middleware/authHelper");
const jobWebController = require("../module/job/controller/jobWebController");
const jobWebRoute = express.Router();

jobWebRoute.get("/add-job", authCheck, jobWebController.viewAddJob);
jobWebRoute.get("/edit-job/:id", authCheck, jobWebController.viewEditJob);
jobWebRoute.get("/jobs", authCheck, jobWebController.viewJobsPage);
jobWebRoute.get(
  "/job-details/:id",
  authCheck,
  jobWebController.viewJobDetails
);

// view end

jobWebRoute.post(
  "/create-job",
  authCheck,
  uploadJob.single("image"),
  jobWebController.addJob
);
jobWebRoute.post(
  "/update-job/:id",
  authCheck,
  uploadJob.single("image"),
  jobWebController.editJob
);
jobWebRoute.get("/delete-job/:id", jobWebController.deleteJob);


module.exports = jobWebRoute;
