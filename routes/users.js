const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const { isLoggedIn, storeReturnTo } = require("../middleware");

router
	.route("/register")
	.get(users.renderRegistrationForm)
	.post(catchAsync(users.register));

router
	.route("/login")
	.get(users.renderLoginForm)
	.post(
		storeReturnTo,
		passport.authenticate("local", {
			failureRedirect: "/user/login",
			keepSessionInfo: true,
		}),
		users.login
	);

router.route("/reset").get(users.renderResetPage).patch(users.resetPassword);

router.get("/logout", users.logout);

router
	.route("/:id/edit")
	.get(isLoggedIn, users.renderEditForm)
	.patch(isLoggedIn, users.changeUserPassword);

router
	.route("/:id/delete")
	.get(isLoggedIn, users.renderDeletePage)
	.delete(isLoggedIn, users.deleteUserAccount);

module.exports = router;
