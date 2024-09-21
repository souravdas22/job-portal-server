const express = require("express");
const contactApiController = require("../../module/webservice/ContactApiController");

const contactRoute = express.Router();

contactRoute.get("/contacts", contactApiController.getAllContacts);
contactRoute.post("/contact/create", contactApiController.createContact);

module.exports = contactRoute;
