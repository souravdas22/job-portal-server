const JObModel = require("../job/model/jobModel");
const fs = require("fs");
const path = require("path");
const jobRepo = require("../job/repository/jobRepo");

class JobController {
  async createJob(req, res) {
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
        postedDate,
      } = req.body;

      const job = new JObModel({
        title,
        description,
        location,
        company,
        salary,
        jobType,
        vaccancies,
        skills,
        category,
        postedDate,
      });

      if (req.file) {
        job.image = req.file.path;
      }
      await job.save();
      res
        .status(200)
        .json({ message: "Job created successfully", status: 200 });
    } catch (err) {
      res.status(500).json({ message: err.message, status: 500 });
    }
  }
  async getJobs(req, res) {
    try {
      const jobs = await jobRepo.findJobs({ isdeleted: false });
      res.status(200).json({
        message: "Jobs fetched successfully",
        status: 200,
        jobs: jobs,
        total: jobs.length,
      });
    } catch (err) {
      res.status(500).json({ message: "failed to get jobs", status: 500 });
    }
  }
  async jobDetails(req, res) {
    try {
      const id = req.params.id;
      const job = await jobRepo.findJob({ isdeleted: false, _id: id });
      res.status(200).json({
        message: "Job details fetched successfully",
        status: 200,
        jobs: job,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: `failed to get jobs ${err.message}`, status: 500 });
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
        postedDate,
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
        postedDate,
      };
      if (new_image) {
        job.image = new_image;
      }
      const updatedJob = await jobRepo.editJob(id, job);

      res.status(200).json({
        message: "Job updated successfully",
        status: 200,
        data: updatedJob,
      });
    } catch (err) {
      res.status(500).json({ message: err.message, status: 500 });
    }
  }
  async deleteJob(req, res) {
    try {
      const id = req.params.id;
      const deletedJob = jobRepo.deleteJob(id, {
        isdeleted: true,
      });

      if (deletedJob) {
        fs.unlinkSync(deletedJob.image);
      }
      res.status(200).json({
        status: 200,
        message: "Job deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
  async filterByCategory(req, res) {
    try {
      const categoryParam = req.query.category;
      const categories = categoryParam
        .split(",")
        .map((category) => category.trim())
        .filter((category) => category);
      const query = {
        category: { $in: categories },
      };
      const filteredJobs = await jobRepo.findJobs({
        isdeleted: false,
        ...query,
      });

      return res.status(200).json({
        message: "Data fetched successfully",
        totalCount: filteredJobs.length,
        data: filteredJobs,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  async filterBySalary(req, res) {
    try {
      const salaryParam = parseInt(req.query.salary, 10);

      const Jobs = await jobRepo.findJobs({
        isdeleted: false,
      });

      const filteredJobs = Jobs.filter((job) => {
        return parseInt(job.salary, 10) >= salaryParam;
      });


      return res.status(200).json({
        message: "Data fetched successfully",
        totalCount: filteredJobs.length,
        data: filteredJobs,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async filterByLocation(req, res) {
    try {
      const locationParam = req.query.location;

      const filteredJobs = await jobRepo.findJobs({
        isdeleted: false,
        location: locationParam,
      });

      return res.status(200).json({
        message: "Data fetched successfully",
        totalCount: filteredJobs.length,
        data: filteredJobs,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  async jobCategories(req, res) {
    try {
      const jobs = await jobRepo.findJobs({
        isdeleted: false,
      });
      const categories = jobs.map((job) => job.category);
      const uniqueCategories = [...new Set(categories)];
      return res.status(200).json({
        message: "Categories fetched successfully",
        totalCount: uniqueCategories.length,
        categories: uniqueCategories,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
const jobController = new JobController();
module.exports = jobController;
