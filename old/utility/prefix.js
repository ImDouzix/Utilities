const { Permissions, MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: "prefix",
	aliases: ["set-prefix", "setprefix"],
	description: "set or display the bot's prefix",
	category: "utility",
	usage: "prefix | prefix <prefix>",
	execute: async ({ utilities, message, args }) => {
		if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			const embed = new MessageEmbed()
				.setDescription(`${config.cross} You don't have enough permissions!`)
				.setColor(config.fail);
			return message.channel.send({ embeds: [embed] });
		}

		let prefix = args.slice(0).join(" ");

		if (!prefix) {
			let embed = new MessageEmbed()
				.setDescription(
					`The current prefix is \`${await utilities.db.getServerVar(
						"main",
						"prefix",
						message.guildId
					)}\`, use \`${await utilities.db.getServerVar(
						"main",
						"prefix",
						message.guildId
					)}help\` for example`
				)
				.setColor(config.color);

			return await message.channel.send({ embeds: [embed] });
		}

		let embed = new MessageEmbed()
			.setDescription(`${config.check} prefix was set to **${prefix}**`)
			.setColor(config.color);

		await utilities.db.setServerVar("main", "prefix", message.guildId, prefix);
		await message.channel.send({ embeds: [embed] });
	},
};
