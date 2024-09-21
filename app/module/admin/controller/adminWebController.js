const jwt = require("jsonwebtoken");
const adminRepo = require("../repository/adminRepo");

class AdminWebController {
  async viewIndex(req, res) {
    try {
      const token = req.cookies.token || req.user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await adminRepo.findUserById(decoded.id);
      const jobs = await adminRepo.findJob({ isdeleted: false });
      const users = await adminRepo.getUsers();
       const applications = await adminRepo.getApplications()
        
      res.render("index", {
        token: token,
        user: user,
        users: users,
        jobs: jobs,
        applications: applications,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("token");
      res.redirect("/admin/login");
    } catch (err) {
      console.log(err.message);
    }
  }
}
const adminWebController = new AdminWebController();
module.exports = adminWebController;
