const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("infractions")
		.setDescription("Display the amount of warnings that a user have")
		.addUserOption(option =>
			option
				.setName("target")
				.setDescription("the user you want to get amount of infractions from")
				.setRequired(true)
		),
	execute: async interaction => {
		const utilities = interaction.client;
		const guild = interaction.guild;

		if (
			!(await utilities.db.getServerVar("main", "moderation", interaction.guildId))
		) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} **Moderation** plugin is disabled!`)
				.setColor(config.fail);

			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		if (
			!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
		) {
			const embed = new MessageEmbed()
				.setDescription(`${config.cross} You don't have enough permissions!`)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let target = interaction.options.getMember("target");
		let warnings = await utilities.db.getMemberVar(
			"main",
			"warnings",
			guild.id,
			target.id
		);

		let embed = new MessageEmbed()
			.setDescription(`${target} Currently has ${warnings} infractions`)
			.setColor(config.color);

		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};
