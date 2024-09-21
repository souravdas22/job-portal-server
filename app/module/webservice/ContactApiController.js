const ContactModel = require("../contact/model/contact");

class ContactApiController {
  async createContact(req, res) {
    try {
      const { name, email, subject, message } = req.body;
      const contact = new ContactModel({
        name,
        email,
        subject,
        message,
      });
      await contact.save();
      res.status(200).json({
        message: " Message sent successfully",
        status: 200,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
  async getAllContacts(req, res) {
    try {
        const contacts = await ContactModel.find();
      res.status(200).json({
        message: "Contacts retrieved successfully",
        status: 200,
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
}
const contactApiController = new ContactApiController();
module.exports = contactApiController;
