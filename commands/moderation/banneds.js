const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config.json");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("banneds")
		.setDescription("Display the banned users in the current guild"),
	execute: async interaction => {
		const channel = interaction.channel;
		const guild = interaction.guild;
		const utilities = interaction.client;

		if (
			!(await utilities.db.getServerVar("main", "moderation", interaction.guildId))
		) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} **Moderation** plugin is disabled!`)
				.setColor(config.fail);

			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		if (!guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} I don't have enough permissions!`)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} You don't have enough permissions!`)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const embed = new MessageEmbed()
			.setTitle(`Banned Users In **${guild.name}**`)
			.setColor(config.color)
			.setDescription(
				`**Ban Count:**\n ${await guild.bans
					.fetch()
					.then(x => x.size)}\n**Banned Users:**\n${guild.bans.cache
					.map(x => x.user.toString())
					.join(" / ")}`
			)
			.setThumbnail(guild.iconURL({ dyanmic: true, format: "png" }));
		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};
