const chalk = require("chalk");
const mongoose = require("mongoose");
const mongo = {
	defaults: require("./defaultValues"),
	...require("dbdjs.mongo").default,
};
const Database = require("./class/Database");

module.exports = async client => {
	mongoose.connection.on("connected", () =>
		console.log(
			chalk.hex("#ff8000")("\n[DB]"),
			chalk.green("Database is connected and ready.")
		)
	);
	mongoose.connection.on("disconnected", () =>
		console.log(
			chalk.hex("#ff8000")("\n[DB]"),
			chalk.hex("#ff4000")("Database has been disconnected.")
		)
	);
	mongoose.connection.on("error", err =>
		console.error(
			chalk.hex("#ff8000")("\n[DB]"),
			chalk.red("An error occured!\n", err)
		)
	);

	mongoose.connect(process.env.database, {
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true,
	});

	mongo.createModel("main");
	mongo.createModel("economy");
	mongo.createModel("music");

	client.db = new Database(mongo);
};
