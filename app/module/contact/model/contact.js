const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
const ContactModel = mongoose.model("Contact", contactSchema);
module.exports = ContactModel;
