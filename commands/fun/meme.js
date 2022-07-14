const { SlashCommandBuilder } = require("@discordjs/builders");
const API = require("popcat-wrapper");
const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("Display a random meme"),
	execute: async interaction => {
		const utilities = interaction.client;

		if (!(await utilities.db.getServerVar("main", "fun", interaction.guildId))) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} **Fun** plugin is disabled!`)
				.setColor(config.fail);

			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}
		
        const meme = await API.meme();

		const embed = new MessageEmbed()
		.setAuthor({ name: `meme.title`, url: `meme.url` })
		.setImage(meme.image)
		.setColor(config.color)
		.setTimestamp();

		return await interaction.reply({ embeds: [embed], ephemeral: true })

	},
};
