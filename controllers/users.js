const User = require("../models/users");

module.exports.renderRegistrationForm = (req, res) => {
	res.render("boilerplate", {
		pageTitle: "Register User",
		template: "users/register",
		action: "/user/register",
		method: "POST",
	});
};

module.exports.register = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = new User({ username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (error) => {
			if (error) return next(error);
			res.redirect("/");
		});
	} catch (error) {
		req.flash("error", error.message);
		next(error);
	}
};

module.exports.renderLoginForm = (req, res, next) => {
	res.render("boilerplate", {
		pageTitle: "User Login",
		template: "users/login",
		action: "/user/login",
		method: "POST",
	});
};

module.exports.login = (req, res, next) => {
	const redirectTo = res.locals.returnTo || "/";
	delete req.session.returnTo;
	res.redirect(redirectTo);
};

module.exports.logout = (req, res, next) => {
	req.logout((error) => {
		if (error) return next(error);
		res.redirect("/");
	});
};

module.exports.renderEditForm = (req, res) => {
	res.render("boilerplate", {
		pageTitle: "Edit User",
		template: "users/edit",
		action: `/user/${req.params.id}/edit?_method=PATCH`,
		method: "POST",
	});
};

module.exports.changeUserPassword = async (req, res, next) => {
	try {
		const { oldPassword, newPassword } = req.body;
		const user = await User.findById(req.params.id);
		const updatedUser = await user.changePassword(oldPassword, newPassword);
		updatedUser.save();
		req.flash("success", "Password successfully changed!");
		res.redirect(req.originalUrl);
	} catch (error) {
		req.flash("error", error.message);
		next(error);
	}
};

module.exports.renderResetPage = (req, res) => {
	res.render("boilerplate", {
		pageTitle: "Reset Password",
		template: "users/reset",
		action: "/user/reset?_method=PATCH",
		method: "POST",
	});
};

module.exports.resetPassword = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findByUsername(username);
		const resetUser = await user.setPassword(password);
		resetUser.save();
		req.flash("success", "Password successfully reseted.");
		res.redirect(req.originalUrl);
	} catch (error) {
		req.flash("error", error.message);
		if (error) return next(error);
	}
};

module.exports.renderDeletePage = (req, res) => {
	res.render("boilerplate", {
		pageTitle: "Delete User",
		template: "users/delete",
		action: `/user/${req.params.id}/delete?_method=DELETE`,
		method: "POST",
	});
};

module.exports.deleteUserAccount = async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	req.flash("success", "Account successfully deleted.");
	res.redirect("/");
};
