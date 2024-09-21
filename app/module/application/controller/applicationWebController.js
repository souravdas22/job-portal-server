const jwt = require("jsonwebtoken");
const applicationRepo = require("../repository/applicationRepo");

class ApplicationWebController {
  async viewApplicationPage(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await applicationRepo.findUserById(decoded.id);
      const applications = await applicationRepo.getApplications();

      if (!applications) {
        return res.send("Application not found");
      }
      res.render("application", {
        applications: applications,
        token: token,
        user: user,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  async viewApplicationDetails(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await applicationRepo.findUserById(decoded.id);
      const applicationId = req.params.id;
      const application = await applicationRepo.getApplicationById(
        applicationId
      );
      if (!application) {
        console.log("Application not found");
      }
      res.render("application-details", {
        application: application,
        token: token,
        user: user,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async acceptApplications(req, res) {
    try {
      const id = req.params.acceptId;
      await applicationRepo.editApplication(
        id,
        { status: "accepted" },
      );
      res.redirect("/applications");
    } catch (error) {
      console.log(error.message);
    }
  }
  async rejectApplications(req, res) {
    try {
      const id = req.params.rejectId;
      await applicationRepo.editApplication(id,{ status: "rejected" });
      res.redirect("/applications");
    } catch (error) {
      console.log(error.message);
    }
  }
}
const applicationWebController = new ApplicationWebController();
module.exports = applicationWebController;
