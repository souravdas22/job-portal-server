const ApplicationModel = require("../application/model/applicationModel");
const applicationRepo = require("../application/repository/applicationRepo");

class ApplicationApiController {
  async createApplication(req, res) {
    try {
      const { jobId, userId, coverLetter } = req.body;
      const existedApplicaiton = await applicationRepo.findApplication({
        jobId: jobId,
        userId: userId,
      });
      if (existedApplicaiton) {
        return res
          .status(404)
          .json({ message: "Application already exists", status: 404 });
      }
      const application = new ApplicationModel({
        jobId,
        userId,
        coverLetter,
      });
      if (req.file) {
        application.resume = req.file.path;
      }
      await application.save();
      res.status(200).json({
        message: "Job created successfully",
        status: 200,
        data: application,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }

  async getAllApplications(req, res) {
    try {
      const applications = await applicationRepo.getApplications()

      if (!applications) {
        return res
          .status(404)
          .json({ message: "Application not found", status: 404 });
      }

      res.status(200).json({
        message: "Applications retrieved successfully",
        status: 200,
        data: applications,
        total: applications.length,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
  async getApplicationDetails(req, res) {
    try {
      const applicationId = req.params.applicationId;
      const application = await applicationRepo.getApplicationById(applicationId)

      if (!application) {
        return res
          .status(404)
          .json({ message: "Application not found", status: 404 });
      }

      res.status(200).json({
        message: "Application details retrieved successfully",
        status: 200,
        data: application,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
  async deleteApplication(req, res) {
    try {
      const id = req.params.id;
      await applicationRepo.deleteApplication(id);
      return res
        .status(200)
        .json({ status: 200, message: "Applications deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
}
const applicationApiController = new ApplicationApiController();
module.exports = applicationApiController;
