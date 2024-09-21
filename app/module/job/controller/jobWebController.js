const JObModel = require("../../job/model/jobModel");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jobRepo = require("../repository/jobRepo");

class JobWebController {
  //view
  async viewAddJob(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await jobRepo.findUserById(decoded.id);
      res.render("addJob", { token: token, user: user });
    } catch (error) {
      console.log(error.message);
    }
  }
  async viewJobsPage(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await jobRepo.findUserById(decoded.id);
      const jobs = await jobRepo.findJobs({ isdeleted: false });
      res.render("jobs", { jobs: jobs, token: token, user: user });
    } catch (error) {
      console.log(error.message);
    }
  }
  async viewEditJob(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await jobRepo.findUserById(decoded.id);
      const id = req.params.id;
      const job = await  JObModel.findOne({ isdeleted: false, _id: id });
      res.render("editJob", { job: job, token: token, user: user });
    } catch (error) {
      console.log(error.message);
    }
  }
  async viewJobDetails(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await jobRepo.findUserById(decoded.id);
      const id = req.params.id;
      const job = await jobRepo.findJobs({ isdeleted: false, _id: id });
      res.render("jobDetails", { job: job, token: token, user: user });
    } catch (error) {
      console.log(error.message);
    }
  }

  // create job
  async addJob(req, res) {
    try {
      const {
        title,
        description,
        location,
        company,
        salary,
        jobType,
        vaccancies,
        skills,
        category,
      } = req.body;

      const job = new JObModel({
        title,
        description,
        location,
        company,
        salary,
        jobType,
        vaccancies,
        skills: skills.split(",").map((skill) => skill.trim()),
        category,
      });

      if (req.file) {
        job.image = req.file.path;
      }
      await job.save();
      res.redirect("/jobs");
    } catch (error) {
      console.log(error.message);
    }
  }
  async editJob(req, res) {
    try {
      const id = req.params.id;
      const new_image = req.file ? req?.file?.path : null;
      const duplicateImage = await jobRepo.findJobById(id);
      if (new_image && duplicateImage.image) {
        fs.unlinkSync(duplicateImage.image);
      }
      const {
        title,
        description,
        location,
        company,
        salary,
        jobType,
        vaccancies,
        skills,
        category,
      } = req.body;

      const job = {
        title,
        description,
        location,
        company,
        salary,
        jobType,
        vaccancies,
        skills,
        category,
      };
      if (new_image) {
        job.image = new_image || job.image;
      }
      await jobRepo.editJob(id, job);

      res.redirect("/jobs");
    } catch (err) {
      console.log(err.message);
    }
  }
  async deleteJob(req, res) {
    try {
      const id = req.params.id;
      const deletedJob = await jobRepo.deleteJob(id, {
        isdeleted: true,
      });

      if (deletedJob) {
        fs.unlinkSync(deletedJob.image);
      }
      res.redirect("/jobs");
    } catch (error) {
      console.log(error.message);
    }
  }
}

const jobWebController = new JobWebController();
module.exports = jobWebController;
