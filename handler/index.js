const fs = require("fs");
const chalk = require("chalk");
const { walk } = require("./functions");
const config = require("../config");
const { join } = require("path");
const { Collection, MessageEmbed, Interaction } = require("discord.js");
const Command = require("../class/Command");

module.exports = client => {
	Object.defineProperty(client, "commands", {
		value: {},
		enumerable: true,
		configurable: false,
		writable: false,
	});
	Object.defineProperty(client.commands, "cache", {
		value: {},
		enumerable: true,
		configurable: false,
		writable: true,
	});
	Object.defineProperty(client.commands, "slash", {
		value: new Collection(),
		enumerable: true,
		configurable: false,
		writable: true,
	});
	Object.defineProperty(client.commands, "paths", {
		value: [],
		enumerable: false,
		configurable: false,
		writable: false,
	});

	// [ LOADER ]

	const updateCommands = debug => {
		for (var filePath of client.commands.paths) {
			delete require.cache[filePath];
		}
		client.commands.cache = {};

		let cmdFiles = walk(join(__dirname, "../old")).filter(x =>
			/.+\.js$/i.test(x.name)
		);
		let cmds = [];
		let slashCmdFiles = walk(join(__dirname, "../commands")).filter(x =>
			/.+\.js$/i.test(x.name)
		);
		let slashCmds = [];

		for (let file of cmdFiles) {
			try {
				if (debug)
					console.log(chalk.hex("#837300")("Loading"), chalk.grey(file.path));
				let cmd = require(file.path);
				if (cmd instanceof Array) {
					cmd.forEach(v => {
						v.path = file.path;
						if (debug)
							console.log(
								"Loaded",
								chalk.hex("#3E70DD")(
									v.name,
									chalk.hex("#02994b")(
										cmd.type ? `[${cmd.type}]` : "[messageCreate]"
									)
								)
							);
					});
				} else {
					cmd.path = file.path;
					if (debug)
						console.log(
							"Loaded",
							chalk.hex("#3E70DD")(
								cmd.name,
								chalk.hex("#02994b")(
									cmd.type ? `[${cmd.type}]` : "[messageCreate]"
								)
							)
						);
				}
				cmds.push(cmd);
			} catch (err) {
				if (debug)
					console.log(
						chalk.hex("#ff2052")("Failed to load"),
						chalk.grey(file.path)
					);
				// console.log(err);
			}
		}
		cmds = cmds.flat();

		client.commands.cache = new Collection(
			cmds.map((v, k) => {
				try {
					return [k, new Command(v, k)];
				} catch (err) {
					console.log(err.message);
				}
			})
		);

		for (let file of slashCmdFiles) {
			try {
				if (debug)
					console.log(chalk.hex("#837300")("Loading"), chalk.grey(file.path));
				let cmd = require(file.path);
				if (cmd instanceof Array) {
					cmd.forEach(v => {
						v.path = file.path;
						if (debug)
							console.log(
								"Loaded",
								chalk.hex("#3E70DD")(
									v.data.name,
									chalk.hex("#02994b")("[slashCommand]")
								)
							);
					});
				} else {
					cmd.path = file.path;
					if (debug)
						console.log(
							"Loaded",
							chalk.hex("#3E70DD")(
								cmd.data.name,
								chalk.hex("#02994b")("[slashCommand]")
							)
						);
				}
				slashCmds.push(cmd);
			} catch (err) {
				if (debug)
					console.log(
						chalk.hex("#ff2052")("Failed to load"),
						chalk.grey(file.path)
					);
			}
		}
		slashCmds.flat().forEach(cmd => {
			client.commands.slash.set(cmd.data.name, cmd);
		});

		client.commands.paths.push(
			...client.commands.cache.map(y => y.path),
			...client.commands.slash.map(y => y.path)
		);

		return true;
	};

	Object.defineProperty(client.commands, "update", {
		value: updateCommands,
		enumerable: true,
		configurable: false,
		writable: false,
	});
	updateCommands(true);

	let n = 0;
	client.events = new Collection(
		walk(join(__dirname, "../events"))
			.filter(x => /.+\.js$/i.test(x.name))
			.map(file => {
				try {
					const data = require(file.path);
					return [n++, data];
				} catch (err) {} // eslint-disable-line no-empty
			})
			.filter(e => e)
	);

	require("./messageCreate")(client);
	require("./interactionCreate")(client);
	require("./events")(client);

	client.commands.cache
		.filter(v => v.type !== "messageCreate" && !v.disabled)
		.forEach(cmd => {
			if (cmd.once) {
				client.once(cmd.type, async (...params) => {
					try {
						await cmd.execute(...params);
					} catch (error) {
						console.log(error);
						let interaction = params.find(x => x instanceof Interaction);
						if (interaction)
							interaction
								.reply({
									embeds: [
										new MessageEmbed()
											.setTitle("Fatal Error")
											.setDescription(
												"We ran into an error while trying to execute your command!"
											)
											.setColor(config.fail),
									],
									ephemeral: true,
								})
								.catch(_ => null);
					}
				});
			} else {
				client.on(cmd.type, async (...params) => {
					try {
						await cmd.execute(...params);
					} catch (error) {
						console.log(error);
						let interaction = params.find(x => x instanceof Interaction);
						if (interaction)
							interaction
								.reply({
									embeds: [
										new MessageEmbed()
											.setTitle("Fatal Error")
											.setDescription(
												"We ran into an error while trying to execute your command!"
											)
											.setColor(config.fail),
									],
									ephemeral: true,
								})
								.catch(_ => null);
					}
				});
			}
		});
};
