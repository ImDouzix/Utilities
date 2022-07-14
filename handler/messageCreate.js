const { MessageEmbed } = require("discord.js");
const fns = require("./functions");
const config = require("../config");

module.exports = client => {
	// alwaysExecute
	client.on("messageCreate", async message => {
		const data = {
			utilities: client,
			message,
			channel: message.channel,
			guild: message.guild,
			author: message.author,
			member: message.member,
			player: client.player,
		};
		const cmd = {
			prefix: "",
			trigger: "",
			content: message.content,
		};

		let cmds = client.commands.cache.filter(
			x => x.type === "messageCreate" && !x.disabled && x.alwaysExecute
		);

		for (const [id, command] of cmds) {
			data.args = cmd.content.split(/ +/);
			if (!command.allowBots && message.author.bot) return;

			try {
				await command.execute(data, cmd, fns);
			} catch (err) {
				console.error(err);
				message.channel
					.send({
						embeds: [
							new MessageEmbed()
								.setTitle("Fatal Error")
								.setDescription(
									"We ran into an error while trying to execute your command! Please, report this error in our **[Support Server](https://discord.gg/jFybTsbaPk)**."
								)
								.setColor(config.fail),
						],
					})
					.catch(_ => null);
			}
		}
	});

	// regular
	client.on("messageCreate", async message => {
		const data = {
			utilities: client,
			message,
			channel: message.channel,
			guild: message.guild,
			author: message.author,
			member: message.member,
			player: client.player,
		};
		const cmd = {
			prefix: "",
			trigger: "",
			content: "",
			type: "regular",
		};

		const mainPrefix = await client.db.getServerVar(
			"main",
			"prefix",
			message.guildId
		);
		const prefixes = [
			mainPrefix,
			`<@${client.user.id}>`,
			`<@!${client.user.id}>`,
		];

		let trigger = [];
		cmd.prefix = Array.from(prefixes)
			.map(x => x.toLowerCase())
			.sort((x, y) => y.length - x.length);

		cmd.prefix = cmd.prefix.find(x =>
			message.content.toLowerCase().startsWith(x)
		);

		if (!cmd.prefix) return;

		let noPrefixMsg = message.content.slice(cmd.prefix.length).trim();
		let cmds = client.commands.cache
			.filter(x => x.type === "messageCreate")
			.filter(x => {
				let insensitive = x.insensitive ? "i" : "";
				trigger[x.id] = Array.from(x.aliases);
				trigger[x.id].unshift(x.name);
				trigger[x.id].sort((a, b) => b.length - a.length);
				trigger[x.id] = trigger[x.id].find(z =>
					new RegExp(`^(${z}\\s|${z}$)`, insensitive).test(noPrefixMsg)
				);
				return (
					!x.disabled && !x.alwaysExecute && !x.nonPrefixed && !!trigger[x.id]
				);
			});

		for (const command of cmds.values()) {
			cmd.trigger = trigger[command.id];
			cmd.content = noPrefixMsg
				.replace(new RegExp(cmd.trigger, "i"), "")
				.trim();
			data.args = cmd.content.split(/ +/g);

			if (!command.allowBots && message.author.bot) return;
			try {
				await command.execute(data, cmd, fns);
			} catch (err) {
				console.error(err);
				message.channel
					.send({
						embeds: [
							new MessageEmbed()
								.setTitle("Fatal Error")
								.setDescription(
									"We ran into an error while trying to execute your command! Please, report this error in our **[Support Server](https://discord.gg/jFybTsbaPk)**."
								)
								.setColor(config.fail),
						],
					})
					.catch(_ => null);
			}
		}
	});

	// nonPrefixed
	client.on("messageCreate", async message => {
		const data = {
			utilities: client,
			message,
			channel: message.channel,
			guild: message.guild,
			author: message.author,
			member: message.member,
			player: client.player,
		};
		const cmd = {
			prefix: "",
			trigger: [],
			content: "",
		};
		let trigger = [];

		let msg = message.content;
		let cmds = client.commands.cache
			.filter(x => x.type === "messageCreate")
			.filter(x => {
				let insensitive = x.insensitive ? "i" : "";
				trigger[x.id] = Array.from(x.aliases);
				trigger[x.id].unshift(x.name);
				trigger[x.id].sort((a, b) => b.length - a.length);
				trigger[x.id] = trigger[x.id].find(z =>
					new RegExp(`^(${z}\\s|${z}$)`, insensitive).test(msg)
				);
				return (
					!x.disabled && !x.alwaysExecute && x.nonPrefixed && !!trigger[x.id]
				);
			});

		for (const command of cmds.values()) {
			cmd.trigger = trigger[command.id];
			cmd.content = msg.replace(new RegExp(cmd.trigger, "i"), "").trim();
			data.args = cmd.content.split(/ +/g);

			if (!command.allowBots && message.author.bot) return;
			try {
				await command.execute(data, cmd, fns);
			} catch (err) {
				console.error(err);
				message.channel
					.send({
						embeds: [
							new MessageEmbed()
								.setTitle("Fatal Error")
								.setDescription(
									"We ran into an error while trying to execute your command!"
								)
								.setColor(config.fail),
						],
					})
					.catch(_ => null);
			}
		}
	});
};
