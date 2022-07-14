const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { MessageEmbed } = require("discord.js");
const { Api: TopggApi } = require("@top-gg/sdk");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription("Display information of a user")
		.addUserOption(option =>
			option
				.setName("user")
				.setDescription("The user you want to display information of")
				.setRequired(false)
		),
	execute: async interaction => {
		const { guild, user, client: utilities } = interaction;

		let target = interaction.options.getUser("user") || user;
		if (target.banner === undefined) target = await target.fetch();
		const member = await guild.members.fetch(target.id).catch(_ => null);
		let dm = await target.send(" ").catch(err => err.code);
		const badges = target.flags
			.toArray()
			.join(" ")
			.replace("EARLY_VERIFIED_DEVELOPER", "<:dev:876963499434201098>")
			.replace("HOUSE_BALANCE", "<:balance:876959658550636585>")
			.replace("HOUSE_BRILLIANCE", "<:brilliance:876959658584182784>")
			.replace("HOUSE_BRAVERY", "<:bravery:876959658361892884>")
			.replace("VERIFIED_DEVELOPER", "<:dev:876963499434201098>")
			.replace("DISCORD_PARTNER", "<:partner:876963499249635328>")
			.replace("EARLY_SUPPORTER", "<:support:876966604074790942>")
			.replace("NITRO_CLASSIC", "<:nitro:876959658462548018>")
			.replace("PARTNERED_SERVER_OWNER;<:partner:876963499249635328>")
			.replace("DISCORD_EMPLOYEE", "<:staff:876963499509682176>")
			.replace("HYPESQUAD_EVENTS", "<:event:876963497211224064>")
			.replace("BUGHUNTER_LEVEL_2", "<:hunter2:876963499564216320>")
			.replace("BUGHUNTER_LEVEL_1", "<:hunter:876963499413233674>")
			.replace("BOT_HTTP_INTERACTIONS", "")
			.replace("VERIFIED_BOT", "")
			.replace(/ +/g, " ");
		const isDev = utilities.owners.includes(target.id);
		const hasVoted = await new TopggApi(process.env.topgg_token).hasVoted(
			target.id
		);

		const embed = new MessageEmbed()
			.setColor(member?.displayColor || target.hexAccentColor || config.color)
			.setThumbnail(target.displayAvatarURL({ dynamic: true, format: "png" }))
			.setImage(target.bannerURL({ size: 2048, dynamic: true }))
			.addField(
				"Name",
				`[${target.tag}]` +
					`(https://discord.com/users/${target.id}) ${
						isDev ? "<:BotDeveloper:911754194346717204>" : ""
					} ${
						target.flags.has(65536)
							? "<:verified_bot:934169571122884649>"
							: target.bot
							? "<:unverified_bot:937328661969928222>"
							: ""
					} ${badges || ""} ${hasVoted ? config.vote_badge : ""}`.replace(
						/ +/g,
						" "
					)
			)
			.addField("User Id", target.id)
			.addField(
				"DM Status",
				String(dm !== 50007 || target.bot ? "Opened" : "Closed")
			);
		if (member) embed.addField("Highest Role", member.roles.highest.toString());
		embed.addField("Joined Discord", target.createdAt.toUTCString());
		if (member) embed.addField("Joined Server", member.joinedAt.toUTCString());

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
