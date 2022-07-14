const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("prefix")
		.setDescription("Display or set utilities prefix")
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("the prefix you want to set")
				.setRequired(false)
		),
	execute: async interaction => {
		const utilities = interaction.client;

		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			const embed = new MessageEmbed()
				.setDescription(`${config.cross} You don't have enough permissions!`)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let prefix = interaction.options.getString("prefix");

		if (!prefix) {
			let embed = new MessageEmbed()
				.setDescription(
					`The current prefix is \`${await utilities.db.getServerVar(
						"main",
						"prefix",
						interaction.guildId
					)}\`, use \`${await utilities.db.getServerVar(
						"main",
						"prefix",
						interaction.guildId
					)}help\` for example`
				)
				.setColor(config.color);

			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let embed = new MessageEmbed()
			.setDescription(`${config.check} prefix was set to **${prefix}**`)
			.setColor(config.color);

		await utilities.db.setServerVar("main", "prefix", interaction.guildId, prefix);
		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};
