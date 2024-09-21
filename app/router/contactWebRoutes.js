const express = require("express");
const contactWebController = require("../module/contact/controller/contactWebController");

const contactWebRoute = express.Router();

contactWebRoute.get("/contacts", contactWebController.getAllContacts);

module.exports = contactWebRoute;
