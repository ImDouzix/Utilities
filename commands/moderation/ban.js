const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config.json");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban someone from the server")
		.addUserOption(option =>
			option
				.setName("target")
				.setDescription("the user you want to ban")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("reason")
				.setDescription("the reason why you want to ban the user")
				.setRequired(false)
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

		if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
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

		let target = interaction.options.getMember("target");

		if (target.id === interaction.authorId) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} You can't ban yourself!`)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		if (target.id === utilities.user.id) {
			let embed = new MessageEmbed()
				.setDescription(`${config.cross} Why you wanna ban me :(`)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		if (
			target.roles.highest.position >= interaction.member.roles.highest.position
		) {
			let embed = new MessageEmbed()
				.setDescription(
					`${config.cross} Your role is too low or have the same position as the target's role!`
				)
				.setColor(config.fail);
			return await interaction.reply({ embeds: [embed], ephemeral: false });
		}

		let reason = interaction.options.getString("reason");
		if (!reason) reason = "No Reason Provided";

		let dm = new MessageEmbed()
			.setTitle(`You have been banned from __${interaction.guild.name}__`)
			.setDescription(`The reason for your ban is: **${reason}**`)
			.setFooter({ text: `Banned by ${interaction.user.tag}` })
			.setColor(config.color);

		let toban = interaction.guild.members.cache.get(target.id);
		try {
			await toban.send({ embeds: [dm] });
		} catch (err) {
			let embed = new MessageEmbed()
				.setDescription(
					`${config.check} ${target.user.tag} has been banned.\n **Reason**\n ${reason}\n 
*I couldn't DM him/her.*`
				)
				.setColor(config.color);
			await toban.ban(reason);
			return interaction.reply({ embeds: [embed], ephemeral: false });
		}
		await toban.ban({ reason: reason });

		let embed = new MessageEmbed()
			.setDescription(
				`${config.check} ${target.user.tag} has been banned.\n **Reason**\n ${reason}`
			)
			.setColor(config.color);
		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};
