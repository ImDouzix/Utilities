const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription(
			"Deletes an amount of messages of your choice from the current channel"
		)
		.addStringOption(option =>
			option
				.setName("amount")
				.setDescription("the amount of messages you wish to clear")
				.setRequired(true)
		),
	execute: async interaction => {
		const utilities = interaction.client;

		if (
			!(await utilities.db.getServerVar("main", "moderation", interaction.guildId))
		) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} **Moderation** plugin is disabled!`)
				.setColor(config.fail);

			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		try {
			if (
				!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
			) {
				let embed = new MessageEmbed()
					.setDescription(`${config.cross} I don't have enough permissions!`)
					.setColor(config.fail);
				return await interaction.reply({ embeds: [embed], ephemeral: false });
			}

			if (
				!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
			) {
				let embed = new MessageEmbed()
					.setDescription(`${config.cross} You don't have enough permissions!`)
					.setColor(config.fail);
				return await interaction.reply({ embeds: [embed], ephemeral: true });
			}

			let messages = interaction.options.getString("amount");

			if (messages > 100) {
				let embed = new MessageEmbed()
					.setDescription(
						`${config.cross} You can't delete more than 100 messages!`
					)
					.setColor(config.fail);

				return await interaction.reply({ embeds: [embed], ephemeral: false });
			}

			if (isNaN(messages)) {
				let embed = new MessageEmbed()
					.setDescription(`${config.cross} The amount must be a number!`)
					.setColor(config.fail);

				return await interaction.reply({ embeds: [embed], ephemeral: false });
			}

			let embed = new MessageEmbed()
				.setDescription(`${config.check} Deleted **${messages}** messages!`)
				.setColor(config.color);

			interaction.channel.bulkDelete(messages, true);

			await interaction.reply({ embeds: [embed], ephemeral: false });
		} catch (err) {
			console.log(err);
		}
	},
};
