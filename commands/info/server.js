const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("serverinfo")
		.setDescription("Display the guild's information"),
	execute: async interaction => {
		const guild = interaction.guild;
		const channel = interaction.channel;
		const utilities = interaction.client;

		if (!guild) return;
		const owner = await utilities.users.fetch(guild.ownerId);
		const bans = (await guild.bans.fetch().catch(_ => null))?.size;
		const channels = guild.channels.cache.size;
		const text = guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size;
		const voice = guild.channels.cache.filter(
			c => c.type === "GUILD_VOICE"
		).size;
		const news = guild.channels.cache.filter(c => c.type === "GUILD_NEWS").size;
		const stage = guild.channels.cache.filter(
			c => c.type === "GUILD_STAGE_VOICE"
		).size;
		const members = guild.memberCount;
		const boosts = guild.premiumSubscriptionCount;
		const tier = guild.premiumTier;

		const embed = new MessageEmbed()
			.setThumbnail(guild.iconURL({ dynamic: true, format: "png" }))
			.setImage(guild.bannerURL({ dynamic: true, format: "png", size: 1024 }))
			.setColor(config.color)
			.setTitle(guild.name);
		if (guild.description) embed.setDescription(guild.description);
		embed
			.addField("Server ID", guild.id)
			.addField(
				"Server Owner",
				`[${owner.tag}](https://discord.com/users/${owner.id}) (${owner.id})`
			)
			.addField("Verification Level", titleCase(guild.verificationLevel))
			.addField("Creation Date", guild.createdAt.toUTCString())
			.addField(
				"Boosts",
				(tier === "TIER_1"
					? "<:level_1:937327565335560272>"
					: tier === "TIER_2"
					? "<:level_2:937411386076700713>"
					: tier === "TIER_3"
					? "<:level_3:937327476789624882>"
					: "") + `${boosts} (Level: ${tier.split("_")[1] || 0})`
			);
		if (bans !== undefined)
			embed.addField("Ban Count", `<:ban_hammer:937416547566256160> ${bans}`);
		embed
			.addField("Role Count", `${guild.roles.cache.size}`)
			.addField(
				"Emoji Count",
				`<:emoji:937389613780201544> ${guild.emojis.cache.size}`
			)
			.addField(
				"Sticker Count",
				`<:sticker:937389687620927559> ${guild.stickers.cache.size}`
			)
			.addField(
				"Channels",
				`Total: ${channels}\n` +
					`<:text_channel:937406170807812096> Text: ${text}\n` +
					`<:voice_channel:937406319986630656> Voice: ${voice}` +
					(guild.rulesChannelId
						? `\n<:news_channel:937406440291856444> News: ${news}\n` +
						  `<:stage_channel:937406596626128896> Stage: ${stage}`
						: "")
			);
		if (guild.features.length)
			embed.addField(
				"Features",
				guild.features.map(x => titleCase(x)).join("\n")
			);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};

function titleCase(str) {
	return str
		.split(/ |_/)
		.map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
		.join(" ");
}
