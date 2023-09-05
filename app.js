require("dotenv").config();
const express = require("express");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const db = require("./db/db");
const { sessionConfig } = require("./config/config");
const User = require("./models/users");
const userRoutes = require("./routes/users");
const ExpressError = require("./utils/ExpressError");
const {
	updateLocalVariables,
	errorHandling,
	isLoggedIn,
} = require("./middleware");

db.connect();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(updateLocalVariables);

app.use("/user", userRoutes);

app.get("/", (req, res) => {
	res.render("boilerplate", { pageTitle: "Homepage", template: "home" });
});

app.get("/secret", isLoggedIn, (req, res, next) => {
	res.render("boilerplate", { pageTitle: "Secrete Page!", template: "secret" });
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

app.use(errorHandling);

app.listen(process.env.PORT, () => {
	console.log("Server up");
});
