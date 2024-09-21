const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./app/config/db");
const session = require("express-session");
const body_parser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
const cors = require("cors");

require("app-module-path").addPath(__dirname + "/app/module");

dotenv.config();
const app = express();
dbConnection();
app.use(cors());

app.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(flash());

// flash message
const { globalMessage } = require("./app/module/user/middleware/helper");
app.use(globalMessage);
//setting ejs
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "app", "module", "admin", "views"),
  path.join(__dirname, "app", "module", "contact", "views"),
  path.join(__dirname, "app", "module", "job", "views"),
  path.join(__dirname, "app", "module", "user", "views"),
  path.join(__dirname, "app", "module", "application", "views"),
  path.join(__dirname, "app", "module", "contact", "views"),
  path.join(__dirname, "views", "Layout"),
]);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

//web route

const adminRoute = require("./app/router/adminWebRoute");
const applicationRoutes = require("./app/router/applicaitonWebRouter");
const jobWebRoutes = require("./app/router/jobWebRoute");
const userWebRoute = require("./app/router/userWebRoute");
const contactWebRoute = require("./app/router/contactWebRoutes");


app.use("/admin", adminRoute);
app.use( jobWebRoutes);
app.use(applicationRoutes);
app.use("/admin",userWebRoute);
app.use(contactWebRoute);

// api
const jobRoute = require("./app/router/Api/job.apiRoute");
const applicationRoute = require("./app/router/Api/application.apiRoute");
const contactRoute = require("./app/router/Api/contact.apiRoute");
const userRoute = require("./app/router/Api/user.apiRouter");
app.use("/api", userRoute);
app.use("/api", jobRoute);
app.use("/api", applicationRoute);
app.use("/api", contactRoute);

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => console.log(`http://localhost:${process.env.PORT}`));
