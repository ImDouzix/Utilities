const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config");
const { version } = require("../../package");
const ms = require("ms");
const os = require("os");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Display utilities stats"),
	execute: async interaction => {
		const { client: utilities } = interaction;
		const current = Number(
			(process.memoryUsage.rss() / 1024 / 1024).toFixed(2)
		);
		const max = Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
		const prefix = await utilities.db.getServerVar(
			"main",
			"prefix",
			interaction.guildId
		);
		const commandCount = utilities.commands.cache.filter(k => {
			return (
				k.type === "messageCreate" &&
				!k.alwaysExecute &&
				!k.disabled &&
				!k.path.startsWith(`${process.cwd()}/commands/dev/`)
			);
		}).size;

		let embed = new MessageEmbed()
			.setTitle(`${utilities.user.username} Stats`)
			.addField("__Ping__", `> ${utilities.ws.ping} ms`, false)
			.addField("__Guilds__", `> ${utilities.guilds.cache.size}`, false)
			.addField("__Uptime__", `> ${ms(utilities.uptime)}`, false)
			.addField("__Prefix__", `> ${prefix}`, false)
			.addField("__Node.JS__", `> ${process.version}`, false)
			.addField("__Ram__", `> ${current} MB / ${max} GB`, false)
			.addField("__Version__", `> ${version}`, false)
			.addField("__Commands__", `> ${commandCount}`, false)
			.addField("__Ready__", `> ${utilities.readyAt}`, false)
			.setColor(config.color)
			.setThumbnail(config.avatar);

		let website = new MessageButton()
			.setStyle("LINK")
			.setLabel("Website")
			.setURL("https://utilitiesbot.com/");

		let row = new MessageActionRow().addComponents([website]);

		await interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
		});
	},
};
