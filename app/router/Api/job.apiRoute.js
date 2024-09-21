const express = require("express");
const jobController = require("../../module/webservice/JobApiController");
const uploadJob = require("../../helper/jobImage");

const jobRoute = express.Router();

jobRoute.get("/jobs", jobController.getJobs);
jobRoute.get("/job/details/:id", jobController.jobDetails);
jobRoute.post("/job/create", uploadJob.single("image"), jobController.createJob);
jobRoute.post(
  "/job/edit/:id",
  uploadJob.single("image"),
  jobController.editJob
);
jobRoute.get("/job/delete/:id", jobController.deleteJob);
jobRoute.get("/job/category", jobController.filterByCategory);
jobRoute.get("/job/salary", jobController.filterBySalary);
jobRoute.get("/job/location", jobController.filterByLocation);
jobRoute.get("/job/categories", jobController.jobCategories);




module.exports = jobRoute;
