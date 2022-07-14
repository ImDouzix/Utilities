const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../../config");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roleinfo")
		.setDescription("Display information of a role")
		.addRoleOption(option =>
			option
				.setName("role")
				.setDescription("The role you want to get information of")
				.setRequired(true)
		),
	execute: async interaction => {
		const { guild } = interaction;
		let role = interaction.options.getRole("role");

		let embed = new MessageEmbed()
			.setColor(role.color || config.color)
			.setThumbnail(role.iconURL())
			.addField("Name", role.name)
			.addField("Role ID", role.id)
			.addField("Mention", role.toString())
			.addField("Color", role.hexColor.toUpperCase())
			.addField("Hoisted", role.hoist ? "Yes" : "No")
			.addField("Mentionable", role.mentionable ? "Yes" : "No")
			.addField(
				"Position",
				`${guild.roles.cache.size - role.rawPosition}/${guild.roles.cache.size}`
			)
			.addField("Members", `${role.members.size}`)
			.addField("Creation Date", role.createdAt.toUTCString());

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
