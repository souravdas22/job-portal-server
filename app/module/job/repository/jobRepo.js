const JObModel = require("../model/jobModel");
const UserModel = require("../../user/model/user");

class JobRepo {
  async findUser(params) {
    try {
      const user = await UserModel.findOne(params);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  async findUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findJobs(params) {
    try {
      const job = await JObModel.find(params);
      return job;
    } catch (error) {
      console.log(error);
    }
  }
  async findJob(params) {
    try {
      const job = await JObModel.findOne(params);
      return job;
    } catch (error) {
      console.log(error);
    }
  }
  async findJobById(id) {
    try {
      const job = await JObModel.findById(id);
      return job;
    } catch (error) {
      console.log(error);
    }
  }
  async editJob(id, params) {
    try {
      const job = await JObModel.findByIdAndUpdate(id, params, {
        new: true,
      });
      return job;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteJob(id, params) {
    try {
      const job = await JObModel.findByIdAndUpdate(id, params);
      return job;
    } catch (error) {
      console.log(error);
    }
  }
}
const jobRepo = new JobRepo();
module.exports = jobRepo;