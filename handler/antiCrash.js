const chalk = require("chalk");

module.exports = client => {
	process.on("unhandledRejection", (reason, p) => {
		console.log(
			chalk.hex("#ff8000")("[ANTICRASH]"),
			chalk.hex("#ff2052")("Unhandled Rejection/Catch")
		);
		console.log(reason, p);
	});
	process.on("uncaughtException", (err, origin) => {
		console.log(
			chalk.hex("#ff8000")("[ANTICRASH]"),
			chalk.hex("#ff2052")("Uncaught Exception/Catch")
		);
		console.log(err, origin);
	});
	process.on("uncaughtExceptionMonitor", (err, origin) => {
		console.log(
			chalk.hex("#ff8000")("[ANTICRASH]"),
			chalk.hex("#ff2052")("Uncaught Exception/Catch (MONITOR)")
		);
		console.log(err, origin);
	});
	process.on("multipleResolves", (type, promise, reason) => {
		//console.log(chalk.hex("#ff8000")("[ANTICRASH]"), chalk.hex("#ff2052")("Multiple Resolves"));
		//console.log(type, promise, reason);
	});
};
