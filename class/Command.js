class Command {
	constructor(cmd, id) {
		var obj = {};
		obj.type = String(cmd.type ?? "messageCreate");

		if (["messageCreate", "message"].includes(obj.type)) {
			obj.name = cmd.name?.trim();
			if (!obj.name)
				throw new Error(
					`Command name must be a non empty string got ${
						typeof cmd.name === "string" ? `"${cmd.name}"` : typeof cmd.name
					}\n\tat ${cmd.path}`
				);
			obj.aliases = alias(cmd.aliases, cmd.path);
			obj.nonPrefixed = !!cmd.nonPrefixed;
			obj.alwaysExecute = !!cmd.alwaysExecute;
			obj.allowBots = !!cmd.allowBots;
			obj.insensitive = !!(cmd.insensitive ?? true);
			obj.disabled = !!cmd.disabled;
			if (!obj.disabled && typeof cmd.execute !== "function")
				throw new Error(
					`cmd.execute must be a function, got ${typeof cmd.execute}\n\tat ${
						cmd.path
					}`
				);
			else obj.execute = cmd.execute;
			Object.defineProperty(this, "path", {
				value: cmd.path,
			});
			delete cmd.path;
			Object.assign(
				this,
				{ id: id, type: "", name: "", aliases: [] },
				cmd,
				obj,
				{ id: id }
			);
		} else {
			obj.name = cmd.name;
			obj.disabled = !!cmd.disabled;
			if (!obj.disabled && typeof cmd.execute !== "function")
				throw new Error(
					`cmd.execute must be a function, got ${typeof cmd.execute}\n\tat ${
						cmd.path
					}`
				);
			else obj.execute = cmd.execute;
			Object.defineProperty(this, "path", {
				value: cmd.path,
			});
			delete cmd.path;
			Object.assign(this, { id: id, type: "", name: "" }, cmd, obj, { id: id });
		}
	}
}

function alias(aliases, path) {
	let a;
	if (aliases instanceof Array)
		a = aliases.filter(x => typeof x === "string").map(x => x.trim());
	else if (typeof aliases === "string") a = [aliases.trim()];
	else a = [];

	if (a.includes(""))
		throw Error(`aliases must not contain empty string\n\tat ${path}`);
	return a;
}

module.exports = Command;
