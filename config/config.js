require("dotenv").config();

module.exports.mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

module.exports.sessionConfig = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60,
	},
};
