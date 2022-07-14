const fs = require("fs");
const path = require("path");
var functions = {};

const PATH = path.join(__dirname, "../functions/");

const files = fs
	.readdirSync(PATH, { withFileTypes: true })
	.filter(file => file.isFile() && file.name.endsWith(".js"))
	.map(file => file.name);

files.forEach(file => {
	const fn = require(path.join(PATH, file));
	functions[fn.name] = fn;
});

module.exports = functions;
