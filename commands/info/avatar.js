const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Display avatar of any user")
		.addUserOption(option =>
			option
				.setName("target")
				.setDescription("the user you want to get avatar of")
				.setRequired(false)
		),
	execute: async interaction => {
		let user = interaction.options.getUser("target") || interaction.user;

		let embed = new MessageEmbed()
			.setTitle(`${user.tag}'s Avatar`)
			.setDescription(
				`**[Download](${user.displayAvatarURL({
					size: 4096,
					dynamic: true,
					format: "png",
				})})**`
			)
			.setImage(
				user.displayAvatarURL({ dynamic: true, size: 4096, format: "png" })
			)
			.setTimestamp()
			.setColor(config.color);

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
