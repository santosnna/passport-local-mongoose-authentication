/**
 * This middleware guarantees that the variables user, success and error are always
 * available and up-to-date, so they don't need to be sent as parameters all the time.
 */
module.exports.updateLocalVariables = (req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
};

module.exports.errorHandling = (error, req, res, next) => {
	const { statusCode = 500 } = error;
	if (!error.message) error.message = "Something went wrong...";
	res.status(statusCode).render("boilerplate", {
		pageTitle: `Error ${statusCode}`,
		template: "error",
		error,
	});
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You need to be Logged In.");
		return res.redirect("/user/login");
	}
	next();
};

module.exports.storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};
