const ApplicationModel = require("../../application/model/applicationModel");
const UserModel = require("../../user/model/user");

class ApplicationRepo {
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
      const user = await UserModel.findById(id)
        .populate("jobId")
        .populate("userId");
      return user;
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
  async findApplication(params) {
    try {
      const application = await ApplicationModel.findOne(params);
      return application;
    } catch (error) {
      console.log(error);
    }
  }
  async getApplicationById(id) {
    try {
      const application = await ApplicationModel.findById(id)
        .populate("jobId")
        .populate("userId");
      return application;
    } catch (error) {
      console.log(error);
    }
  }
  async editApplication(id, params) {
    try {
      const application = await ApplicationModel.findByIdAndUpdate(id, params, {
        new: true,
      });
      return application;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteApplication(id) {
    try {
      const application = await ApplicationModel.findByIdAndDelete(id);
      return application;
    } catch (error) {
      console.log(error);
    }
  }
}
const applicationRepo = new ApplicationRepo();
module.exports = applicationRepo;
