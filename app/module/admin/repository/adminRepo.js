const ApplicationModel = require("../../application/model/applicationModel");
const JObModel = require("../../job/model/jobModel");
const TokenModel = require("../../user/model/tokenModel");
const UserModel = require("../../user/model/user");

class AdminRepo {
  async getUsers() {
    try {
      const user = await UserModel.find();
      return user;
    } catch (error) {
      console.log(error)
    }
  }
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
      console.log(error)
    }
  }
  async editUser(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      console.log(error)
    }
  }

  async findJob(params) {
    try {
      const job = await JObModel.find(params);
      return job;
    } catch (error) {
      console.log(error);
    }
  }
  async findJobById() {
    try {
    } catch (error) {
      console.log(error);
    }
  }
  async getApplications() {
    try {
      const applications = await ApplicationModel.find()
        .populate("jobId")
        .populate("userId");
      return applications;
    } catch (error) {
      console.log(error);
    }
  }

  async getToken(params) {
    try {
      const token = await TokenModel.findOne(params);
      return token
    } catch (error) {
      console.log(error);
    }
    }
    

}
const adminRepo = new AdminRepo();
module.exports = adminRepo;