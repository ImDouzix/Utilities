const fs = require("fs");
function walk(path, files = []) {
	let root = fs.readdirSync(path, {
		withFileTypes: true,
	});
	let dirs = root.filter(x => x.isDirectory());
	let newFiles = root.filter(x => x.isFile());
	newFiles.forEach(x => (x.path = path + "/" + x.name));
	files.push(...newFiles);

	dirs.forEach(sd => walk(path + "/" + sd.name, files));
	return files;
}

module.exports = walk;
