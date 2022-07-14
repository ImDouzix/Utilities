const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const { parseMS } = require("ms-utility");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("channelinfo")
		.setDescription("Display information of a channel")
		.addChannelOption(option =>
			option
				.setName("channel")
				.setDescription("The channel you want to get information of")
				.setRequired(false)
		),
	execute: async interaction => {
		const { guild } = interaction;
		let channel =
			interaction.options.getChannel("channel") || interaction.channel;

		let embed = new MessageEmbed()
			.addField("Name", channel.name)
			.addField("Channel ID", channel.id)
			.addField("Mention", channel.toString());
		if (channel.topic) embed.addField("Topic", channel.topic);

		if (["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type)) {
			embed
				.addField(
					"Type",
					channel.type === "GUILD_TEXT"
						? "<:text_channel:937406170807812096> Text Channel"
						: "<:news_channel:937406440291856444> News Channel"
				)
				.addField("Category", channel.parent.name)
				.addField("NSFW", channel.nsfw ? "Yes" : "No")
				.addField("Members", `${channel.members.size}`)
				.addField("Threads", `${channel.threads.cache.size}`)
				.addField(
					"Position",
					`${channel.rawPosition}/${guild.channels.cache.size}`
				);
			if (channel.type === "GUILD_TEXT")
				embed.addField(
					"Cooldown",
					parseMS(channel.rateLimitPerUser).toString() || "No Cooldown"
				);
		} else if (
			[
				"GUILD_PUBLIC_THREAD",
				"GUILD_NEWS_THREAD",
				"GUILD_PRIVATE_THREAD",
			].includes(channel.type)
		) {
			embed
				.addField(
					"Type",
					channel.type.includes("PUBLIC")
						? "Public Thread"
						: channel.type.includes("PRIVATE")
						? "Private Thread"
						: "News Thread"
				)
				.addField("Parent", channel.parent.name)
				.addField("Archived", channel.archived ? "Yes" : "No")
				.addField("Locked", channel.locked ? "Yes" : "No")
				.addField("Members", `${channel.memberCount}`)
				.addField("Messages", `${channel.messageCount}`)
				.addField(
					"Auto Archive Duration",
					parseMS(channel.autoArchiveDuration * 60000).toString()
				)
				.addField(
					"Cooldown",
					parseMS(channel.rateLimitPerUser).toString() || "No Cooldown"
				);
		} else if (channel.type === "GUILD_CATEGORY") {
			embed
				.addField("Type", "Category")
				.addField("Members", `${channel.members.size}`)
				.addField(
					"Position",
					`${channel.rawPosition}/${guild.channels.cache.size}`
				);
		} else if (["GUILD_VOICE", "GUILD_STAGE_VOICE"].includes(channel.type)) {
			embed
				.addField(
					"Type",
					channel.type === "GUILD_VOICE"
						? "<:voice_channel:937406319986630656> Voice Channel"
						: "<:stage_channel:937406596626128896> Stage Channel"
				)
				.addField("Category", channel.parent.name)
				.addField("Bit Rate", `${channel.bitrate / 1000}Kbps`)
				.addField(
					"Members",
					`${channel.members.size}${
						channel.userLimit ? "/" + channel.userLimit : ""
					}`
				);
		}

		embed
			.setColor(config.color)
			.addField("Creation Date", channel.createdAt.toUTCString());

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
