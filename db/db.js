require("dotenv").config();
const mongoose = require("mongoose");
const { mongoOptions } = require("../config/config");

module.exports.connect = function () {
	mongoose.connect(process.env.MONGO_URI, mongoOptions);

	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", () => {
		console.log("DB connected");
	});
};
