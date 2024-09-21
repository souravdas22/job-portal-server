const UserModel = require("../../user/model/user");
const ContactModel = require("../model/contact");
const jwt = require("jsonwebtoken");


class ContactWebController {

  async getAllContacts(req, res) {
      try {
          const token = req.cookies.token || req.user;
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           const user = await UserModel.findById(decoded.id);
        const contacts = await ContactModel.find();
        res.render('contacts', {
            contacts: contacts,
            token: token,
            user:user
        })
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
}
const contactWebController = new ContactWebController();
module.exports = contactWebController;
